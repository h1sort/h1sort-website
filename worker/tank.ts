// AI Tank: Shark Tank style judging for AI project pitches.
//
// Routes (wired from worker/index.ts):
//   GET  /tank/<token>          personal judge link: sets the judge cookie and
//                               redirects to /ai-tank/ (or ?invalid=1)
//   /api/tank/admin/*           organizer API, guarded by the polls admin
//                               session (same credentials as /polls)
//   /api/tank/judge/*           judge API, identity = HttpOnly judge cookie
//
// The JSON contract is documented in src/lib/tank.ts, shared with the pages.
// Schema: migrations/0006_ai_tank.sql. Scores store the index of the chosen
// slider stop, so editing a question's points re-scores the leaderboard.
import {
  type D1PreparedStatement,
  type Env,
  bodyErrorResponse,
  boundedText,
  clearCookie,
  getCookie,
  isLocalDevelopment,
  json,
  methodNotAllowed,
  randomToken,
  readBoundedJsonObject,
  requireAdmin,
  requireSameOrigin,
  serializeCookie,
} from './index';

type TankStatus = 'draft' | 'open' | 'closed';
type Move = 'up' | 'down';

interface Level {
  label: string;
  points: number;
}

interface EventRow {
  id: string;
  title: string;
  status: TankStatus;
  created_at: string;
}
interface CategoryRow {
  id: string;
  event_id: string;
  name: string;
  weight: number;
  position: number;
}
interface QuestionRow {
  id: string;
  category_id: string;
  prompt: string;
  levels: string;
  position: number;
}
interface ProjectRow {
  id: string;
  event_id: string;
  name: string;
  team: string;
  summary: string;
  position: number;
}
interface JudgeRow {
  id: string;
  name: string;
  token: string;
  created_at: string;
  last_seen_at: string | null;
  submitted: number;
}

interface Question {
  id: string;
  prompt: string;
  position: number;
  levels: Level[];
}
interface Category {
  id: string;
  name: string;
  weight: number;
  weightPct: number;
  position: number;
  questions: Question[];
}
interface Project {
  id: string;
  name: string;
  team: string;
  summary: string;
  position: number;
}
interface EventDetail {
  id: string;
  title: string;
  status: TankStatus;
  createdAt: string;
  categories: Category[];
  projects: Project[];
  judges: Array<{
    id: string;
    name: string;
    token: string;
    link: string;
    createdAt: string;
    lastSeenAt: string | null;
    submitted: number;
  }>;
}

interface JudgeContext {
  judgeId: string;
  judgeName: string;
  eventId: string;
  eventTitle: string;
  eventStatus: TankStatus;
}

const TANK_BODY_BYTES = 32_768;
const JUDGE_COOKIE_SECONDS = 45 * 24 * 60 * 60;
const JUDGE_TOKEN_RE = /^[A-Za-z0-9_-]{32}$/;
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const STATUSES: readonly TankStatus[] = ['draft', 'open', 'closed'];
const LIMITS = { categories: 12, questions: 12, projects: 80, judges: 60, scores: 200 };

const NOT_OPEN = 'event not open';

// Suggested starting rubric for a new event. Every value is editable.
const DEFAULT_LEVELS: Level[] = [
  { label: 'No', points: 0 },
  { label: 'Parcial', points: 10 },
  { label: 'Sí', points: 15 },
];
const DEFAULT_RUBRIC: Array<{ name: string; weight: number; questions: string[] }> = [
  {
    name: 'INNOVACIÓN',
    weight: 25,
    questions: ['¿El proyecto es innovador?', '¿Usa la IA de forma diferenciada frente a lo que ya existe?'],
  },
  {
    name: 'IMPACTO',
    weight: 30,
    questions: ['¿El proyecto es claro en su impacto?', '¿El beneficio para el banco o el cliente es medible?'],
  },
  {
    name: 'VIABILIDAD',
    weight: 25,
    questions: [
      '¿Es factible con los datos y la tecnología disponibles?',
      '¿Considera riesgos, regulación y seguridad de la información?',
    ],
  },
  {
    name: 'PRESENTACIÓN',
    weight: 20,
    questions: ['¿El equipo comunicó la propuesta con claridad?'],
  },
];

// ----------------------------------------------------------------------------
// Entry points
// ----------------------------------------------------------------------------

export async function handleTankLink(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return methodNotAllowed('GET');
  const match = url.pathname.match(/^\/tank\/([^/]+)\/?$/);
  const token = match && JUDGE_TOKEN_RE.test(match[1]) ? match[1] : null;
  const destination = new URL('/ai-tank/', url.origin);
  const headers = new Headers({ 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' });

  const judge = token
    ? await env.DB.prepare('SELECT id FROM tank_judges WHERE token = ?1').bind(token).first<{ id: string }>()
    : null;
  if (!judge || !token) {
    destination.searchParams.set('invalid', '1');
    headers.append('set-cookie', clearCookie(judgeCookieName(url), url));
  } else {
    headers.append('set-cookie', serializeCookie(judgeCookieName(url), token, JUDGE_COOKIE_SECONDS, url));
    await env.DB.prepare(`UPDATE tank_judges SET last_seen_at = datetime('now') WHERE id = ?1`).bind(judge.id).run();
  }
  headers.set('location', destination.toString());
  return new Response(null, { status: 302, headers });
}

export async function handleTankApi(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;

  if (path.startsWith('/api/tank/admin/')) {
    const authError = await requireAdmin(request, env, url);
    if (authError) return authError;
    if (method !== 'GET') {
      const originError = requireSameOrigin(request, url);
      if (originError) return originError;
    }
    return handleAdmin(request, env, url, path.slice('/api/tank/admin'.length).split('/').filter(Boolean));
  }

  if (path.startsWith('/api/tank/judge/')) {
    if (method !== 'GET') {
      const originError = requireSameOrigin(request, url);
      if (originError) return originError;
    }
    return handleJudge(request, env, url, path.slice('/api/tank/judge'.length).split('/').filter(Boolean));
  }

  return json({ error: 'not found' }, 404);
}

// ----------------------------------------------------------------------------
// Admin
// ----------------------------------------------------------------------------

async function handleAdmin(request: Request, env: Env, url: URL, parts: string[]): Promise<Response> {
  const method = request.method;
  const [resource, id, sub] = parts;

  if (resource === 'events' && !id) {
    if (method === 'GET') return listEvents(env);
    if (method === 'POST') return createEvent(request, env, url);
    return methodNotAllowed('GET, POST');
  }

  if (!id || !ID_RE.test(id) || parts.length > 3) return json({ error: 'not found' }, 404);

  if (resource === 'events') {
    if (!sub) {
      if (method === 'GET') return eventResponse(env, url, id);
      if (method === 'PATCH') return updateEvent(request, env, url, id);
      if (method === 'DELETE') return deleteEvent(env, id);
      return methodNotAllowed('GET, PATCH, DELETE');
    }
    if (sub === 'leaderboard') {
      if (method !== 'GET') return methodNotAllowed('GET');
      return leaderboardResponse(env, url, id);
    }
    if (method !== 'POST') return methodNotAllowed('POST');
    if (sub === 'categories') return createCategory(request, env, url, id);
    if (sub === 'projects') return createProject(request, env, url, id);
    if (sub === 'judges') return createJudge(request, env, url, id);
    return json({ error: 'not found' }, 404);
  }

  if (resource === 'categories' && sub === 'questions') {
    if (method !== 'POST') return methodNotAllowed('POST');
    return createQuestion(request, env, url, id);
  }
  if (sub) return json({ error: 'not found' }, 404);

  if (resource === 'categories' || resource === 'questions' || resource === 'projects' || resource === 'judges') {
    if (method === 'PATCH') return updateChild(request, env, url, resource, id);
    if (method === 'DELETE') return deleteChild(env, url, resource, id);
    return methodNotAllowed('PATCH, DELETE');
  }

  return json({ error: 'not found' }, 404);
}

async function listEvents(env: Env): Promise<Response> {
  const { results = [] } = await env.DB.prepare(
    `SELECT e.id, e.title, e.status, e.created_at,
            (SELECT count(*) FROM tank_projects p WHERE p.event_id = e.id) AS projects,
            (SELECT count(*) FROM tank_judges j WHERE j.event_id = e.id) AS judges,
            (SELECT count(*) FROM tank_categories c WHERE c.event_id = e.id) AS categories
       FROM tank_events e
      ORDER BY e.created_at DESC, e.id`,
  ).all<EventRow & { projects: number; judges: number; categories: number }>();
  return json({
    events: results.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      createdAt: row.created_at,
      projects: Number(row.projects),
      judges: Number(row.judges),
      categories: Number(row.categories),
    })),
  }, 200);
}

async function createEvent(request: Request, env: Env, url: URL): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const title = boundedText(body.title, 120);
  if (!title) return json({ error: 'El título es obligatorio (máx. 120 caracteres)' }, 400);

  const eventId = crypto.randomUUID();
  const statements: D1PreparedStatement[] = [
    env.DB.prepare('INSERT INTO tank_events (id, title) VALUES (?1, ?2)').bind(eventId, title),
  ];
  if (body.seedRubric === true) {
    DEFAULT_RUBRIC.forEach((category, categoryIndex) => {
      const categoryId = crypto.randomUUID();
      statements.push(
        env.DB.prepare('INSERT INTO tank_categories (id, event_id, name, weight, position) VALUES (?1, ?2, ?3, ?4, ?5)')
          .bind(categoryId, eventId, category.name, category.weight, categoryIndex),
      );
      category.questions.forEach((prompt, questionIndex) => {
        statements.push(
          env.DB.prepare('INSERT INTO tank_questions (id, category_id, prompt, levels, position) VALUES (?1, ?2, ?3, ?4, ?5)')
            .bind(crypto.randomUUID(), categoryId, prompt, JSON.stringify(DEFAULT_LEVELS), questionIndex),
        );
      });
    });
  }
  await env.DB.batch(statements);
  return eventResponse(env, url, eventId, 201);
}

async function updateEvent(request: Request, env: Env, url: URL, eventId: string): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const sets: string[] = [];
  const values: unknown[] = [];
  if ('title' in body) {
    const title = boundedText(body.title, 120);
    if (!title) return json({ error: 'El título es obligatorio (máx. 120 caracteres)' }, 400);
    values.push(title);
    sets.push(`title = ?${values.length}`);
  }
  if ('status' in body) {
    if (!STATUSES.includes(body.status as TankStatus)) return json({ error: 'Estado inválido' }, 400);
    values.push(body.status);
    sets.push(`status = ?${values.length}`);
  }
  if (!sets.length) return json({ error: 'Nada que actualizar' }, 400);
  values.push(eventId);
  const result = await env.DB.prepare(
    `UPDATE tank_events SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?${values.length}`,
  ).bind(...values).run();
  if (!result.meta?.changes) return json({ error: 'Evento no encontrado' }, 404);
  return eventResponse(env, url, eventId);
}

async function deleteEvent(env: Env, eventId: string): Promise<Response> {
  const result = await env.DB.prepare('DELETE FROM tank_events WHERE id = ?1').bind(eventId).run();
  if (!result.meta?.changes) return json({ error: 'Evento no encontrado' }, 404);
  return json({ ok: true }, 200);
}

async function createCategory(request: Request, env: Env, url: URL, eventId: string): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const name = boundedText(body.name, 60);
  if (!name) return json({ error: 'El nombre de la categoría es obligatorio (máx. 60 caracteres)' }, 400);
  const weight = body.weight === undefined ? 25 : parseWeight(body.weight);
  if (weight === null) return json({ error: 'El peso debe ser un entero entre 0 y 100' }, 400);
  if (!(await eventExists(env, eventId))) return json({ error: 'Evento no encontrado' }, 404);
  if ((await countWhere(env, 'tank_categories', 'event_id', eventId)) >= LIMITS.categories) {
    return json({ error: `Máximo ${LIMITS.categories} categorías por evento` }, 409);
  }
  await env.DB.prepare(
    `INSERT INTO tank_categories (id, event_id, name, weight, position)
     VALUES (?1, ?2, ?3, ?4, (SELECT coalesce(max(position), -1) + 1 FROM tank_categories WHERE event_id = ?2))`,
  ).bind(crypto.randomUUID(), eventId, name, weight).run();
  return eventResponse(env, url, eventId, 201);
}

async function createQuestion(request: Request, env: Env, url: URL, categoryId: string): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const prompt = boundedText(body.prompt, 300);
  if (!prompt) return json({ error: 'La pregunta es obligatoria (máx. 300 caracteres)' }, 400);
  const levels = body.levels === undefined ? DEFAULT_LEVELS : parseLevels(body.levels);
  if (!levels) return json({ error: LEVELS_ERROR }, 400);
  const category = await env.DB.prepare('SELECT event_id FROM tank_categories WHERE id = ?1')
    .bind(categoryId).first<{ event_id: string }>();
  if (!category) return json({ error: 'Categoría no encontrada' }, 404);
  if ((await countWhere(env, 'tank_questions', 'category_id', categoryId)) >= LIMITS.questions) {
    return json({ error: `Máximo ${LIMITS.questions} preguntas por categoría` }, 409);
  }
  await env.DB.prepare(
    `INSERT INTO tank_questions (id, category_id, prompt, levels, position)
     VALUES (?1, ?2, ?3, ?4, (SELECT coalesce(max(position), -1) + 1 FROM tank_questions WHERE category_id = ?2))`,
  ).bind(crypto.randomUUID(), categoryId, prompt, JSON.stringify(levels)).run();
  return eventResponse(env, url, category.event_id, 201);
}

async function createProject(request: Request, env: Env, url: URL, eventId: string): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const name = boundedText(body.name, 120);
  if (!name) return json({ error: 'El nombre del proyecto es obligatorio (máx. 120 caracteres)' }, 400);
  const team = optionalText(body.team, 120, false);
  if (team === null) return json({ error: 'Equipo: máx. 120 caracteres' }, 400);
  const summary = optionalText(body.summary, 1000, true);
  if (summary === null) return json({ error: 'Resumen: máx. 1000 caracteres' }, 400);
  if (!(await eventExists(env, eventId))) return json({ error: 'Evento no encontrado' }, 404);
  if ((await countWhere(env, 'tank_projects', 'event_id', eventId)) >= LIMITS.projects) {
    return json({ error: `Máximo ${LIMITS.projects} proyectos por evento` }, 409);
  }
  await env.DB.prepare(
    `INSERT INTO tank_projects (id, event_id, name, team, summary, position)
     VALUES (?1, ?2, ?3, ?4, ?5, (SELECT coalesce(max(position), -1) + 1 FROM tank_projects WHERE event_id = ?2))`,
  ).bind(crypto.randomUUID(), eventId, name, team ?? '', summary ?? '').run();
  return eventResponse(env, url, eventId, 201);
}

async function createJudge(request: Request, env: Env, url: URL, eventId: string): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const name = boundedText(body.name, 80);
  if (!name) return json({ error: 'El nombre del juez es obligatorio (máx. 80 caracteres)' }, 400);
  if (!(await eventExists(env, eventId))) return json({ error: 'Evento no encontrado' }, 404);
  if ((await countWhere(env, 'tank_judges', 'event_id', eventId)) >= LIMITS.judges) {
    return json({ error: `Máximo ${LIMITS.judges} jueces por evento` }, 409);
  }
  await env.DB.prepare('INSERT INTO tank_judges (id, event_id, name, token) VALUES (?1, ?2, ?3, ?4)')
    .bind(crypto.randomUUID(), eventId, name, newJudgeToken()).run();
  return eventResponse(env, url, eventId, 201);
}

type ChildResource = 'categories' | 'questions' | 'projects' | 'judges';

async function updateChild(
  request: Request,
  env: Env,
  url: URL,
  resource: ChildResource,
  id: string,
): Promise<Response> {
  const body = await readBody(request);
  if (body instanceof Response) return body;
  const owner = await findOwner(env, resource, id);
  if (!owner) return json({ error: 'No encontrado' }, 404);

  const sets: string[] = [];
  const values: unknown[] = [];
  const set = (column: string, value: unknown) => {
    values.push(value);
    sets.push(`${column} = ?${values.length}`);
  };

  if (resource === 'categories') {
    if ('name' in body) {
      const name = boundedText(body.name, 60);
      if (!name) return json({ error: 'El nombre de la categoría es obligatorio (máx. 60 caracteres)' }, 400);
      set('name', name);
    }
    if ('weight' in body) {
      const weight = parseWeight(body.weight);
      if (weight === null) return json({ error: 'El peso debe ser un entero entre 0 y 100' }, 400);
      set('weight', weight);
    }
  } else if (resource === 'questions') {
    if ('prompt' in body) {
      const prompt = boundedText(body.prompt, 300);
      if (!prompt) return json({ error: 'La pregunta es obligatoria (máx. 300 caracteres)' }, 400);
      set('prompt', prompt);
    }
    if ('levels' in body) {
      const levels = parseLevels(body.levels);
      if (!levels) return json({ error: LEVELS_ERROR }, 400);
      set('levels', JSON.stringify(levels));
    }
  } else if (resource === 'projects') {
    if ('name' in body) {
      const name = boundedText(body.name, 120);
      if (!name) return json({ error: 'El nombre del proyecto es obligatorio (máx. 120 caracteres)' }, 400);
      set('name', name);
    }
    if ('team' in body) {
      const team = optionalText(body.team, 120, false);
      if (team === null) return json({ error: 'Equipo: máx. 120 caracteres' }, 400);
      set('team', team);
    }
    if ('summary' in body) {
      const summary = optionalText(body.summary, 1000, true);
      if (summary === null) return json({ error: 'Resumen: máx. 1000 caracteres' }, 400);
      set('summary', summary);
    }
  } else if (resource === 'judges') {
    if ('name' in body) {
      const name = boundedText(body.name, 80);
      if (!name) return json({ error: 'El nombre del juez es obligatorio (máx. 80 caracteres)' }, 400);
      set('name', name);
    }
    if (body.rotateToken === true) set('token', newJudgeToken());
  }

  let move: Move | null = null;
  if ('move' in body) {
    if (resource === 'judges' || (body.move !== 'up' && body.move !== 'down')) {
      return json({ error: 'Movimiento inválido' }, 400);
    }
    move = body.move as Move;
  }
  if (!sets.length && !move) return json({ error: 'Nada que actualizar' }, 400);

  if (sets.length) {
    values.push(id);
    await env.DB.prepare(`UPDATE tank_${resource} SET ${sets.join(', ')} WHERE id = ?${values.length}`)
      .bind(...values).run();
  }
  if (move && resource !== 'judges') await moveSibling(env, resource, owner.parentId, id, move);
  return eventResponse(env, url, owner.eventId);
}

async function deleteChild(env: Env, url: URL, resource: ChildResource, id: string): Promise<Response> {
  const owner = await findOwner(env, resource, id);
  if (!owner) return json({ error: 'No encontrado' }, 404);
  await env.DB.prepare(`DELETE FROM tank_${resource} WHERE id = ?1`).bind(id).run();
  return eventResponse(env, url, owner.eventId);
}

async function findOwner(
  env: Env,
  resource: ChildResource,
  id: string,
): Promise<{ eventId: string; parentId: string } | null> {
  if (resource === 'questions') {
    const row = await env.DB.prepare(
      `SELECT c.event_id, q.category_id FROM tank_questions q JOIN tank_categories c ON c.id = q.category_id WHERE q.id = ?1`,
    ).bind(id).first<{ event_id: string; category_id: string }>();
    return row ? { eventId: row.event_id, parentId: row.category_id } : null;
  }
  const row = await env.DB.prepare(`SELECT event_id FROM tank_${resource} WHERE id = ?1`)
    .bind(id).first<{ event_id: string }>();
  return row ? { eventId: row.event_id, parentId: row.event_id } : null;
}

async function moveSibling(
  env: Env,
  resource: 'categories' | 'questions' | 'projects',
  parentId: string,
  id: string,
  move: Move,
): Promise<void> {
  const parentColumn = resource === 'questions' ? 'category_id' : 'event_id';
  const { results = [] } = await env.DB.prepare(
    `SELECT id FROM tank_${resource} WHERE ${parentColumn} = ?1 ORDER BY position, id`,
  ).bind(parentId).all<{ id: string }>();
  const order = results.map((row) => row.id);
  const index = order.indexOf(id);
  const target = move === 'up' ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= order.length) return;
  [order[index], order[target]] = [order[target], order[index]];
  await env.DB.batch(order.map((rowId, position) =>
    env.DB.prepare(`UPDATE tank_${resource} SET position = ?1 WHERE id = ?2`).bind(position, rowId)));
}

async function eventResponse(env: Env, url: URL, eventId: string, status = 200): Promise<Response> {
  const event = await loadEventDetail(env, url, eventId);
  if (!event) return json({ error: 'Evento no encontrado' }, 404);
  return json({ event }, status);
}

async function loadEventDetail(env: Env, url: URL, eventId: string): Promise<EventDetail | null> {
  const event = await env.DB.prepare('SELECT id, title, status, created_at FROM tank_events WHERE id = ?1')
    .bind(eventId).first<EventRow>();
  if (!event) return null;

  const [categories, questions, projects, judges] = await Promise.all([
    env.DB.prepare('SELECT * FROM tank_categories WHERE event_id = ?1 ORDER BY position, id')
      .bind(eventId).all<CategoryRow>(),
    env.DB.prepare(
      `SELECT q.* FROM tank_questions q JOIN tank_categories c ON c.id = q.category_id
        WHERE c.event_id = ?1 ORDER BY q.position, q.id`,
    ).bind(eventId).all<QuestionRow>(),
    env.DB.prepare('SELECT * FROM tank_projects WHERE event_id = ?1 ORDER BY position, id')
      .bind(eventId).all<ProjectRow>(),
    env.DB.prepare(
      `SELECT j.id, j.name, j.token, j.created_at, j.last_seen_at,
              (SELECT count(*) FROM tank_scorecards s WHERE s.judge_id = j.id AND s.submitted_at IS NOT NULL) AS submitted
         FROM tank_judges j WHERE j.event_id = ?1 ORDER BY j.created_at, j.id`,
    ).bind(eventId).all<JudgeRow>(),
  ]);

  return {
    id: event.id,
    title: event.title,
    status: event.status,
    createdAt: event.created_at,
    categories: buildCategories(categories.results ?? [], questions.results ?? []),
    projects: (projects.results ?? []).map(serializeProject),
    judges: (judges.results ?? []).map((judge) => ({
      id: judge.id,
      name: judge.name,
      token: judge.token,
      link: `${url.origin}/tank/${judge.token}`,
      createdAt: judge.created_at,
      lastSeenAt: judge.last_seen_at,
      submitted: Number(judge.submitted),
    })),
  };
}

function buildCategories(categoryRows: CategoryRow[], questionRows: QuestionRow[]): Category[] {
  const totalWeight = categoryRows.reduce((sum, row) => sum + Number(row.weight), 0);
  const categories = categoryRows.map<Category>((row) => ({
    id: row.id,
    name: row.name,
    weight: Number(row.weight),
    weightPct: totalWeight > 0
      ? round1((Number(row.weight) / totalWeight) * 100)
      : round1(100 / categoryRows.length),
    position: Number(row.position),
    questions: [],
  }));
  const byId = new Map(categories.map((category) => [category.id, category]));
  for (const row of questionRows) {
    byId.get(row.category_id)?.questions.push({
      id: row.id,
      prompt: row.prompt,
      position: Number(row.position),
      levels: readLevels(row.levels),
    });
  }
  return categories;
}

function serializeProject(row: ProjectRow): Project {
  return { id: row.id, name: row.name, team: row.team, summary: row.summary, position: Number(row.position) };
}

// ----------------------------------------------------------------------------
// Leaderboard
// ----------------------------------------------------------------------------

async function leaderboardResponse(env: Env, url: URL, eventId: string): Promise<Response> {
  const event = await loadEventDetail(env, url, eventId);
  if (!event) return json({ error: 'Evento no encontrado' }, 404);

  const [scoreRows, cardRows] = await Promise.all([
    env.DB.prepare(
      `SELECT s.judge_id, s.project_id, s.question_id, s.level FROM tank_scores s
         JOIN tank_projects p ON p.id = s.project_id WHERE p.event_id = ?1`,
    ).bind(eventId).all<{ judge_id: string; project_id: string; question_id: string; level: number }>(),
    env.DB.prepare(
      `SELECT c.judge_id, c.project_id, c.notes, c.submitted_at FROM tank_scorecards c
         JOIN tank_projects p ON p.id = c.project_id WHERE p.event_id = ?1`,
    ).bind(eventId).all<{ judge_id: string; project_id: string; notes: string; submitted_at: string | null }>(),
  ]);

  const levelsByJudgeProject = new Map<string, Map<string, number>>();
  const started = new Map<string, Set<string>>();
  const markStarted = (projectId: string, judgeId: string) => {
    if (!started.has(projectId)) started.set(projectId, new Set());
    started.get(projectId)!.add(judgeId);
  };
  for (const row of scoreRows.results ?? []) {
    const key = `${row.judge_id}|${row.project_id}`;
    if (!levelsByJudgeProject.has(key)) levelsByJudgeProject.set(key, new Map());
    levelsByJudgeProject.get(key)!.set(row.question_id, Number(row.level));
    markStarted(row.project_id, row.judge_id);
  }
  const submittedCards = new Map<string, Array<{ judgeId: string; notes: string; submittedAt: string }>>();
  for (const row of cardRows.results ?? []) {
    markStarted(row.project_id, row.judge_id);
    if (!row.submitted_at) continue;
    if (!submittedCards.has(row.project_id)) submittedCards.set(row.project_id, []);
    submittedCards.get(row.project_id)!.push({ judgeId: row.judge_id, notes: row.notes, submittedAt: row.submitted_at });
  }

  const judgeNames = new Map(event.judges.map((judge) => [judge.id, judge.name]));
  const categoryMax = new Map(event.categories.map((category) => [
    category.id,
    category.questions.reduce((sum, question) => sum + maxPoints(question.levels), 0),
  ]));
  const maxTotal = [...categoryMax.values()].reduce((sum, value) => sum + value, 0);
  const totalQuestions = event.categories.reduce((sum, category) => sum + category.questions.length, 0);

  const rows = event.projects.map((project) => {
    const perJudge = (submittedCards.get(project.id) ?? []).map((card) => {
      const levels = levelsByJudgeProject.get(`${card.judgeId}|${project.id}`) ?? new Map<string, number>();
      const categoryScores: Record<string, number | null> = {};
      let points = 0;
      let answered = 0;
      for (const category of event.categories) {
        let earned = 0;
        for (const question of category.questions) {
          const level = levels.get(question.id);
          if (level === undefined) continue;
          answered += 1;
          earned += pointsAt(question.levels, level);
        }
        points += earned;
        const max = categoryMax.get(category.id) ?? 0;
        categoryScores[category.id] = max > 0 ? (earned / max) * 100 : null;
      }
      return {
        judgeId: card.judgeId,
        judgeName: judgeNames.get(card.judgeId) ?? 'Juez',
        score: weightedScore(event.categories, categoryScores),
        points,
        categoryScores,
        notes: card.notes,
        submittedAt: card.submittedAt,
        complete: answered >= totalQuestions,
      };
    });

    const categoryScores: Record<string, number | null> = {};
    for (const category of event.categories) {
      const values = perJudge
        .map((judge) => judge.categoryScores[category.id])
        .filter((value): value is number => value !== null);
      categoryScores[category.id] = values.length ? mean(values) : null;
    }
    const hasVotes = perJudge.length > 0;
    return {
      rank: 0,
      project: { id: project.id, name: project.name, team: project.team },
      score: hasVotes ? round1(weightedScore(event.categories, categoryScores)) : null,
      categoryScores: roundRecord(categoryScores),
      avgPoints: hasVotes ? round1(mean(perJudge.map((judge) => judge.points))) : null,
      maxPoints: maxTotal,
      judgesSubmitted: perJudge.length,
      judgesStarted: started.get(project.id)?.size ?? 0,
      perJudge: perJudge
        .map((judge) => ({ ...judge, score: round1(judge.score), categoryScores: roundRecord(judge.categoryScores) }))
        .sort((left, right) => right.score - left.score || left.judgeName.localeCompare(right.judgeName, 'es')),
      position: project.position,
    };
  });

  rows.sort((left, right) => {
    if (left.score === null || right.score === null) {
      if (left.score === right.score) return left.position - right.position;
      return left.score === null ? 1 : -1;
    }
    return right.score - left.score
      || (right.avgPoints ?? 0) - (left.avgPoints ?? 0)
      || left.position - right.position;
  });
  // Competition ranking (1, 1, 3). Projects without votes share the last rank.
  rows.forEach((row, index) => {
    const previous = rows[index - 1];
    const tied = previous && previous.score === row.score && previous.avgPoints === row.avgPoints;
    row.rank = tied ? previous.rank : index + 1;
  });

  return json({
    event: { id: event.id, title: event.title, status: event.status },
    categories: event.categories.map(({ id, name, weight, weightPct }) => ({ id, name, weight, weightPct })),
    judgesTotal: event.judges.length,
    ranking: rows.map(({ position: _position, ...row }) => row),
  }, 200);
}

/** Weighted mean of category percentages; equal weights when all weights are 0. */
function weightedScore(categories: Category[], scores: Record<string, number | null>): number {
  let weighted = 0;
  let weights = 0;
  const plain: number[] = [];
  for (const category of categories) {
    const value = scores[category.id];
    if (value === null || value === undefined) continue;
    plain.push(value);
    weighted += value * category.weight;
    weights += category.weight;
  }
  if (weights > 0) return weighted / weights;
  return plain.length ? mean(plain) : 0;
}

// ----------------------------------------------------------------------------
// Judge
// ----------------------------------------------------------------------------

async function handleJudge(request: Request, env: Env, url: URL, parts: string[]): Promise<Response> {
  const method = request.method;

  if (parts.length === 1 && parts[0] === 'logout') {
    if (method !== 'POST') return methodNotAllowed('POST');
    return json({ ok: true }, 200, { 'set-cookie': clearCookie(judgeCookieName(url), url) });
  }

  const judge = await requireJudge(request, env, url);
  if (judge instanceof Response) return judge;

  if (parts.length === 1 && parts[0] === 'me') {
    if (method !== 'GET') return methodNotAllowed('GET');
    return judgeSession(env, url, judge);
  }

  const [resource, projectId, action] = parts;
  if (resource !== 'projects' || !projectId || !ID_RE.test(projectId) || parts.length > 3) {
    return json({ error: 'not found' }, 404);
  }
  const project = await env.DB.prepare('SELECT * FROM tank_projects WHERE id = ?1 AND event_id = ?2')
    .bind(projectId, judge.eventId).first<ProjectRow>();
  if (!project) return json({ error: 'Proyecto no encontrado' }, 404);

  if (!action) {
    if (method !== 'GET') return methodNotAllowed('GET');
    const categories = await loadCategories(env, judge.eventId);
    return json({ project: serializeProject(project), scorecard: await loadScorecard(env, judge, project.id, categories) }, 200);
  }
  if (action === 'scores') {
    if (method !== 'PUT') return methodNotAllowed('PUT');
    return saveScores(request, env, judge, project.id);
  }
  if (action === 'submit') {
    if (method !== 'POST') return methodNotAllowed('POST');
    return submitScorecard(request, env, judge, project.id);
  }
  return json({ error: 'not found' }, 404);
}

async function requireJudge(request: Request, env: Env, url: URL): Promise<JudgeContext | Response> {
  const token = getCookie(request, judgeCookieName(url));
  const unauthorized = (clear: boolean) => json(
    { error: 'Necesitas tu enlace personal de juez' },
    401,
    clear ? { 'set-cookie': clearCookie(judgeCookieName(url), url) } : undefined,
  );
  if (!token) return unauthorized(false);
  if (!JUDGE_TOKEN_RE.test(token)) return unauthorized(true);
  const row = await env.DB.prepare(
    `SELECT j.id, j.name, j.event_id, e.title, e.status
       FROM tank_judges j JOIN tank_events e ON e.id = j.event_id WHERE j.token = ?1`,
  ).bind(token).first<{ id: string; name: string; event_id: string; title: string; status: TankStatus }>();
  if (!row) return unauthorized(true);
  return { judgeId: row.id, judgeName: row.name, eventId: row.event_id, eventTitle: row.title, eventStatus: row.status };
}

async function judgeSession(env: Env, url: URL, judge: JudgeContext): Promise<Response> {
  const [categories, projects, answeredRows, cardRows] = await Promise.all([
    loadCategories(env, judge.eventId),
    env.DB.prepare('SELECT * FROM tank_projects WHERE event_id = ?1 ORDER BY position, id')
      .bind(judge.eventId).all<ProjectRow>(),
    env.DB.prepare(
      `SELECT s.project_id, count(*) AS answered FROM tank_scores s
        WHERE s.judge_id = ?1 GROUP BY s.project_id`,
    ).bind(judge.judgeId).all<{ project_id: string; answered: number }>(),
    env.DB.prepare('SELECT project_id, submitted_at FROM tank_scorecards WHERE judge_id = ?1')
      .bind(judge.judgeId).all<{ project_id: string; submitted_at: string | null }>(),
    env.DB.prepare(`UPDATE tank_judges SET last_seen_at = datetime('now') WHERE id = ?1`).bind(judge.judgeId).run(),
  ]);
  const total = categories.reduce((sum, category) => sum + category.questions.length, 0);
  const answered = new Map((answeredRows.results ?? []).map((row) => [row.project_id, Number(row.answered)]));
  const submitted = new Set((cardRows.results ?? []).filter((row) => row.submitted_at).map((row) => row.project_id));

  return json({
    judge: { id: judge.judgeId, name: judge.judgeName },
    event: { id: judge.eventId, title: judge.eventTitle, status: judge.eventStatus },
    categories,
    projects: (projects.results ?? []).map((row) => ({
      ...serializeProject(row),
      answered: Math.min(answered.get(row.id) ?? 0, total),
      total,
      submitted: submitted.has(row.id),
    })),
  }, 200);
}

async function loadCategories(env: Env, eventId: string): Promise<Category[]> {
  const [categories, questions] = await Promise.all([
    env.DB.prepare('SELECT * FROM tank_categories WHERE event_id = ?1 ORDER BY position, id')
      .bind(eventId).all<CategoryRow>(),
    env.DB.prepare(
      `SELECT q.* FROM tank_questions q JOIN tank_categories c ON c.id = q.category_id
        WHERE c.event_id = ?1 ORDER BY q.position, q.id`,
    ).bind(eventId).all<QuestionRow>(),
  ]);
  return buildCategories(categories.results ?? [], questions.results ?? []);
}

async function loadScorecard(env: Env, judge: JudgeContext, projectId: string, categories: Category[]) {
  const [scoreRows, card] = await Promise.all([
    env.DB.prepare('SELECT question_id, level FROM tank_scores WHERE judge_id = ?1 AND project_id = ?2')
      .bind(judge.judgeId, projectId).all<{ question_id: string; level: number }>(),
    env.DB.prepare('SELECT notes, submitted_at FROM tank_scorecards WHERE judge_id = ?1 AND project_id = ?2')
      .bind(judge.judgeId, projectId).first<{ notes: string; submitted_at: string | null }>(),
  ]);
  const questions = new Map(categories.flatMap((category) => category.questions).map((question) => [question.id, question]));
  const scores: Record<string, number> = {};
  for (const row of scoreRows.results ?? []) {
    const question = questions.get(row.question_id);
    if (question) scores[row.question_id] = Math.min(Number(row.level), question.levels.length - 1);
  }
  return {
    scores,
    notes: card?.notes ?? '',
    submittedAt: card?.submitted_at ?? null,
    answered: Object.keys(scores).length,
    total: questions.size,
  };
}

async function saveScores(request: Request, env: Env, judge: JudgeContext, projectId: string): Promise<Response> {
  if (judge.eventStatus !== 'open') return json({ error: NOT_OPEN }, 403);
  const body = await readBody(request);
  if (body instanceof Response) return body;

  const categories = await loadCategories(env, judge.eventId);
  const questions = new Map(categories.flatMap((category) => category.questions).map((question) => [question.id, question]));

  const statements: D1PreparedStatement[] = [];
  if (body.scores !== undefined) {
    if (!body.scores || typeof body.scores !== 'object' || Array.isArray(body.scores)) {
      return json({ error: 'scores debe ser un objeto { preguntaId: nivel }' }, 400);
    }
    const entries = Object.entries(body.scores as Record<string, unknown>);
    if (entries.length > LIMITS.scores) return json({ error: 'Demasiadas respuestas' }, 400);
    for (const [questionId, level] of entries) {
      const question = questions.get(questionId);
      if (!question) return json({ error: 'Pregunta desconocida, recarga la página' }, 409);
      if (typeof level !== 'number' || !Number.isInteger(level) || level < 0 || level >= question.levels.length) {
        return json({ error: 'Nivel inválido' }, 400);
      }
      statements.push(env.DB.prepare(
        `INSERT INTO tank_scores (judge_id, project_id, question_id, level) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (judge_id, project_id, question_id)
         DO UPDATE SET level = excluded.level, updated_at = datetime('now')`,
      ).bind(judge.judgeId, projectId, questionId, level));
    }
  }

  let notes: string | null = null;
  if (body.notes !== undefined) {
    notes = parseNotes(body.notes);
    if (notes === null) return json({ error: 'Notas: máx. 1000 caracteres' }, 400);
  }
  statements.push(upsertScorecard(env, judge.judgeId, projectId, notes, false));
  await env.DB.batch(statements);

  return json({ scorecard: await loadScorecard(env, judge, projectId, categories) }, 200);
}

async function submitScorecard(request: Request, env: Env, judge: JudgeContext, projectId: string): Promise<Response> {
  if (judge.eventStatus !== 'open') return json({ error: NOT_OPEN }, 403);
  const body = await readBody(request);
  if (body instanceof Response) return body;
  let notes: string | null = null;
  if (body.notes !== undefined) {
    notes = parseNotes(body.notes);
    if (notes === null) return json({ error: 'Notas: máx. 1000 caracteres' }, 400);
  }

  const categories = await loadCategories(env, judge.eventId);
  const current = await loadScorecard(env, judge, projectId, categories);
  if (current.total === 0) return json({ error: 'Este evento aún no tiene preguntas' }, 409);
  const missing = current.total - current.answered;
  if (missing > 0) {
    return json({ error: missing === 1 ? 'Falta 1 pregunta por responder' : `Faltan ${missing} preguntas por responder` }, 409);
  }

  await upsertScorecard(env, judge.judgeId, projectId, notes, true).run();
  return json({ scorecard: await loadScorecard(env, judge, projectId, categories) }, 200);
}

function upsertScorecard(
  env: Env,
  judgeId: string,
  projectId: string,
  notes: string | null,
  submit: boolean,
): D1PreparedStatement {
  const submittedValue = submit ? `datetime('now')` : 'NULL';
  const submittedUpdate = submit ? `datetime('now')` : 'tank_scorecards.submitted_at';
  return env.DB.prepare(
    `INSERT INTO tank_scorecards (judge_id, project_id, notes, submitted_at) VALUES (?1, ?2, coalesce(?3, ''), ${submittedValue})
     ON CONFLICT (judge_id, project_id) DO UPDATE SET
       notes = coalesce(?3, tank_scorecards.notes),
       submitted_at = ${submittedUpdate},
       updated_at = datetime('now')`,
  ).bind(judgeId, projectId, notes);
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const LEVELS_ERROR = 'Cada pregunta necesita de 2 a 5 opciones con puntos enteros de 0 a 1000, en orden ascendente, y etiquetas de máx. 40 caracteres';

function parseLevels(value: unknown): Level[] | null {
  if (!Array.isArray(value) || value.length < 2 || value.length > 5) return null;
  const levels: Level[] = [];
  let previous = -1;
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    const { label: rawLabel = '', points } = item as { label?: unknown; points?: unknown };
    if (typeof rawLabel !== 'string') return null;
    const label = rawLabel.normalize('NFKC').trim();
    if (label.length > 40 || /[\u0000-\u001f\u007f]/.test(label)) return null;
    if (typeof points !== 'number' || !Number.isInteger(points) || points < 0 || points > 1000 || points <= previous) {
      return null;
    }
    previous = points;
    levels.push({ label, points });
  }
  return levels;
}

function readLevels(raw: string): Level[] {
  try {
    return parseLevels(JSON.parse(raw)) ?? DEFAULT_LEVELS;
  } catch {
    return DEFAULT_LEVELS;
  }
}

function maxPoints(levels: Level[]): number {
  return levels.reduce((max, level) => Math.max(max, level.points), 0);
}

function pointsAt(levels: Level[], index: number): number {
  return levels[Math.min(Math.max(index, 0), levels.length - 1)]?.points ?? 0;
}

function parseWeight(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100) return null;
  return value;
}

/** Optional free text: '' allowed. Returns null when invalid. */
function optionalText(value: unknown, maxLength: number, multiline: boolean): string | null | undefined {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const text = value.normalize('NFKC').replace(/\r\n?/g, '\n').trim();
  if (text.length > maxLength) return null;
  const forbidden = multiline ? /[\u0000-\u0008\u000b-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
  if (forbidden.test(text)) return null;
  return text;
}

function parseNotes(value: unknown): string | null {
  const notes = optionalText(value, 1000, true);
  return typeof notes === 'string' ? notes : null;
}

async function readBody(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    return await readBoundedJsonObject(request, TANK_BODY_BYTES);
  } catch (error) {
    return bodyErrorResponse(error);
  }
}

async function eventExists(env: Env, eventId: string): Promise<boolean> {
  return Boolean(await env.DB.prepare('SELECT 1 AS found FROM tank_events WHERE id = ?1').bind(eventId).first());
}

async function countWhere(
  env: Env,
  table: 'tank_categories' | 'tank_questions' | 'tank_projects' | 'tank_judges',
  column: 'event_id' | 'category_id',
  value: string,
): Promise<number> {
  const row = await env.DB.prepare(`SELECT count(*) AS n FROM ${table} WHERE ${column} = ?1`)
    .bind(value).first<{ n: number }>();
  return Number(row?.n ?? 0);
}

function newJudgeToken(): string {
  return randomToken(24); // 24 random bytes -> 32 base64url chars
}

function judgeCookieName(url: URL): string {
  return isLocalDevelopment(url) ? 'tank_judge_dev' : '__Host-tank_judge';
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundRecord(record: Record<string, number | null>): Record<string, number | null> {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, value === null ? null : round1(value)]));
}
