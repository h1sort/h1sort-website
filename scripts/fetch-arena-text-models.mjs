import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceUrl = 'https://arena.ai/leaderboard/text/pareto';
const defaultOutput = resolve(root, 'src/data/arena-text-models.json');
const userAgent = 'h1sort-model-catalog/1.0';
const requestDelayMs = 150;
const options = parseOptions(process.argv.slice(2));
const dataTimestamp = new Date().toISOString();

const sourceHtml = await fetchPage(sourceUrl);
const flightValues = extractFlightValues(sourceHtml);
const route = extractLeaderboard(flightValues);
const categoryDefinitions = extractCategoryDefinitions(flightValues);
const entries = route.leaderboard.entries;
const models = entries.map((entry) => ({
  ...entry,
  blendedPricePerMillion: getBlendedPrice(entry),
}));
const candidates = models.filter(
  (model) => Number.isFinite(model.rating) && model.blendedPricePerMillion !== null,
);
const paretoModelKeys = candidates
  .filter((model) => !candidates.some((other) => other !== model && dominates(other, model)))
  .sort((a, b) => b.rating - a.rating)
  .map((model) => model.modelKey);
if ((options.withEvaluations || options.categories.length) && !categoryDefinitions.length) {
  throw new Error('Could not find Arena evaluation categories in the page response');
}
const evaluationSlugs = getEvaluationSlugs(options, categoryDefinitions);
const evaluations = {};

for (const slug of evaluationSlugs) {
  const definition = categoryDefinitions.find((category) => category.slug === slug);
  if (!definition) throw new Error(`Unknown Arena evaluation category: ${slug}`);

  let evaluationRoute = route;
  let fetchedAt = dataTimestamp;
  if (slug !== route.leaderboard.params?.category) {
    await wait(requestDelayMs);
    const evaluationUrl = `https://arena.ai/leaderboard/text/${slug}`;
    const evaluationHtml = await fetchPage(evaluationUrl);
    evaluationRoute = extractLeaderboard(extractFlightValues(evaluationHtml));
    fetchedAt = new Date().toISOString();
  }

  evaluations[slug] = normalizeEvaluation(evaluationRoute, definition, fetchedAt);
}

const data = {
  sourceUrl,
  fetchedAt: dataTimestamp,
  arena: route.arena?.slug ?? route.leaderboard.arenaSlug ?? 'text',
  availableEvaluations: categoryDefinitions,
  leaderboard: {
    slug: route.leaderboard.leaderboardSlug,
    params: route.leaderboard.params,
    category: route.leaderboard.category,
    snapshotId: route.leaderboard.id,
    voteCutoffISOString: route.leaderboard.voteCutoffISOString,
    totalVotes: route.leaderboard.totalVotes,
    totalModels: route.leaderboard.totalModels,
  },
  pareto: {
    priceFormula: '(input + 3 * output) / 4',
    priceRatio: { input: 1, output: 3 },
    modelKeys: paretoModelKeys,
  },
  evaluationCount: Object.keys(evaluations).length,
  evaluations,
  modelCount: models.length,
  models,
};

await mkdir(dirname(options.output), { recursive: true });
await writeFile(options.output, `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `arena-text: wrote ${models.length} models, ${paretoModelKeys.length} Pareto models, and ${Object.keys(evaluations).length} evaluations to ${options.output}`,
);

function parseOptions(args) {
  const outputIndex = args.indexOf('--output');
  const outputValue = outputIndex === -1 ? null : args[outputIndex + 1];
  if (outputIndex !== -1 && (!outputValue || outputValue.startsWith('--'))) {
    throw new Error('Expected a path after --output');
  }

  const categoriesArg = args.find((arg) => arg.startsWith('--categories='));
  const categories = categoriesArg
    ? categoriesArg
        .slice('--categories='.length)
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean)
    : [];

  return {
    output: outputValue ? resolve(process.cwd(), outputValue) : defaultOutput,
    withEvaluations: args.includes('--with-evaluations'),
    categories,
  };
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': userAgent,
    },
  });

  if (!response.ok) throw new Error(`Arena request failed for ${url} with HTTP ${response.status}`);
  return response.text();
}

function extractFlightValues(html) {
  const values = [];
  const scripts = html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);

  for (const match of scripts) {
    const script = match[1].trim();
    const wrapper = script.match(/^self\.__next_f\.push\(([\s\S]*)\)$/);
    if (!wrapper) continue;

    try {
      const tuple = JSON.parse(wrapper[1]);
      if (Array.isArray(tuple) && typeof tuple[1] === 'string') values.push(tuple[1]);
    } catch {
      continue;
    }
  }

  return values;
}

function extractLeaderboard(flightValues) {
  for (const value of flightValues) {
    if (!value.includes('leaderboard-snapshots/latest')) continue;

    try {
      const flightPayload = JSON.parse(value.replace(/^d:/, ''));
      const route = flightPayload?.[3];
      if (Array.isArray(route?.leaderboard?.entries)) return route;
    } catch {
      continue;
    }
  }

  throw new Error('Could not find the leaderboard data in the Arena page response');
}

function extractCategoryDefinitions(flightValues) {
  for (const value of flightValues) {
    if (!/^\d+:\[/.test(value)) continue;

    try {
      const rows = JSON.parse(value.slice(value.indexOf(':') + 1));
      if (!Array.isArray(rows) || !rows.some((row) => row?.[0] === 'overall')) continue;
      return rows.map(([slug, metadata]) => ({
        slug,
        title: metadata?.title ?? slug,
        group: metadata?.group ?? null,
      }));
    } catch {
      continue;
    }
  }

  return [];
}

function getEvaluationSlugs(currentOptions, categoryDefinitions) {
  if (currentOptions.categories.length) return currentOptions.categories;
  if (currentOptions.withEvaluations) return categoryDefinitions.map((category) => category.slug);
  return [];
}

function normalizeEvaluation(route, definition, fetchedAt) {
  return {
    sourceUrl: `https://arena.ai/leaderboard/text/${definition.slug}`,
    fetchedAt,
    slug: route.leaderboard.leaderboardSlug,
    title: definition.title,
    group: definition.group,
    params: route.leaderboard.params,
    snapshotId: route.leaderboard.id,
    voteCutoffISOString: route.leaderboard.voteCutoffISOString,
    totalVotes: route.leaderboard.totalVotes,
    totalModels: route.leaderboard.totalModels,
    scores: route.leaderboard.entries.map((entry) => ({
      modelKey: entry.modelKey,
      modelDisplayName: entry.modelDisplayName,
      rank: entry.rank,
      rankUpper: entry.rankUpper,
      rankLower: entry.rankLower,
      rating: entry.rating,
      ratingUpper: entry.ratingUpper,
      ratingLower: entry.ratingLower,
      votes: entry.votes,
      isDay1: entry.isDay1 ?? false,
    })),
  };
}

function getBlendedPrice(model) {
  if (!(model.inputPricePerMillion > 0) || !(model.outputPricePerMillion > 0)) return null;
  return (model.inputPricePerMillion + 3 * model.outputPricePerMillion) / 4;
}

function dominates(a, b) {
  return (
    a.blendedPricePerMillion <= b.blendedPricePerMillion &&
    a.rating >= b.rating &&
    (a.blendedPricePerMillion < b.blendedPricePerMillion || a.rating > b.rating)
  );
}

function wait(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}
