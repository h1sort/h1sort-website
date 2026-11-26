// Shared client-side contract for AI Tank (/ai-tank judge view and
// /ai-tank/admin dashboard). Mirrors the JSON returned by worker/tank.ts.
//
// API overview (all JSON, all `cache-control: no-store`):
//
// Admin (uses the existing polls admin session: /api/polls/auth/login,
// /api/polls/auth/logout, /api/polls/auth/session):
//   GET    /api/tank/admin/events                       -> { events: TankEventSummary[] }
//   POST   /api/tank/admin/events  {title, seedRubric?}  -> { event: TankEventDetail }
//   GET    /api/tank/admin/events/:id                   -> { event: TankEventDetail }
//   PATCH  /api/tank/admin/events/:id {title?, status?}  -> { event: TankEventDetail }
//   DELETE /api/tank/admin/events/:id                   -> { ok: true }
//   POST   /api/tank/admin/events/:id/categories {name, weight}         -> { event }
//   PATCH  /api/tank/admin/categories/:id {name?, weight?, move?}       -> { event }
//   DELETE /api/tank/admin/categories/:id                              -> { event }
//   POST   /api/tank/admin/categories/:id/questions {prompt, levels}    -> { event }
//   PATCH  /api/tank/admin/questions/:id {prompt?, levels?, move?}      -> { event }
//   DELETE /api/tank/admin/questions/:id                               -> { event }
//   POST   /api/tank/admin/events/:id/projects {name, team?, summary?}  -> { event }
//   PATCH  /api/tank/admin/projects/:id {name?, team?, summary?, move?} -> { event }
//   DELETE /api/tank/admin/projects/:id                                -> { event }
//   POST   /api/tank/admin/events/:id/judges {name}                    -> { event }
//   PATCH  /api/tank/admin/judges/:id {name?, rotateToken?: true}       -> { event }
//   DELETE /api/tank/admin/judges/:id                                  -> { event }
//   GET    /api/tank/admin/events/:id/leaderboard       -> TankLeaderboard
//   Every admin mutation returns the full, fresh TankEventDetail so the UI can
//   simply re-render. `move` is 'up' | 'down' (swap with the neighbour).
//
// Judge (identity = HttpOnly cookie set by visiting the personal link
// /tank/<token>, which then redirects to /ai-tank/):
//   GET  /api/tank/judge/me                            -> TankJudgeSession   (401 when no judge)
//   GET  /api/tank/judge/projects/:id                  -> { project, scorecard: TankScorecard }
//   PUT  /api/tank/judge/projects/:id/scores {scores: {[questionId]: levelIndex}, notes?}
//                                                      -> { scorecard: TankScorecard }  (autosave, partial ok)
//   POST /api/tank/judge/projects/:id/submit {notes?}  -> { scorecard: TankScorecard }  (409 if incomplete)
//   POST /api/tank/judge/logout                        -> { ok: true }
//   Judge writes return 403 { error: 'event not open' } unless the event is open.
//
// Errors are always { error: string } with a meaningful HTTP status.

export type TankStatus = 'draft' | 'open' | 'closed';
export type TankMove = 'up' | 'down';

/** One stop of a question's slider. `label` may be empty: show points only. */
export interface TankLevel {
  label: string;
  points: number;
}

export interface TankQuestion {
  id: string;
  prompt: string;
  position: number;
  /** 2 to 5 stops, points strictly ascending left to right. */
  levels: TankLevel[];
}

export interface TankCategory {
  id: string;
  name: string;
  /** Raw weight 0-100. Normalized share of the total is `weightPct`. */
  weight: number;
  weightPct: number;
  position: number;
  questions: TankQuestion[];
}

export interface TankProject {
  id: string;
  name: string;
  team: string;
  summary: string;
  position: number;
}

export interface TankJudge {
  id: string;
  name: string;
  token: string;
  /** Absolute personal link, e.g. https://h1sort.com/tank/<token> */
  link: string;
  createdAt: string;
  lastSeenAt: string | null;
  /** Number of projects this judge has submitted. */
  submitted: number;
}

export interface TankEventSummary {
  id: string;
  title: string;
  status: TankStatus;
  createdAt: string;
  projects: number;
  judges: number;
  categories: number;
}

export interface TankEventDetail {
  id: string;
  title: string;
  status: TankStatus;
  createdAt: string;
  categories: TankCategory[];
  projects: TankProject[];
  judges: TankJudge[];
}

export interface TankJudgeBreakdown {
  judgeId: string;
  judgeName: string;
  /** Weighted 0-100 score for this judge's scorecard. */
  score: number;
  points: number;
  /** categoryId -> 0-100, null when the category has no questions. */
  categoryScores: Record<string, number | null>;
  notes: string;
  submittedAt: string | null;
  complete: boolean;
}

export interface TankRankingRow {
  rank: number;
  project: { id: string; name: string; team: string };
  /** Weighted 0-100 score averaged over submitted scorecards; null if none. */
  score: number | null;
  /** categoryId -> average 0-100 across submitted judges, null if none. */
  categoryScores: Record<string, number | null>;
  avgPoints: number | null;
  maxPoints: number;
  judgesSubmitted: number;
  judgesStarted: number;
  /** Submitted scorecards only. */
  perJudge: TankJudgeBreakdown[];
}

export interface TankLeaderboard {
  event: { id: string; title: string; status: TankStatus };
  categories: Array<{ id: string; name: string; weight: number; weightPct: number }>;
  judgesTotal: number;
  ranking: TankRankingRow[];
}

export interface TankProjectProgress extends TankProject {
  answered: number;
  total: number;
  submitted: boolean;
}

export interface TankJudgeSession {
  judge: { id: string; name: string };
  event: { id: string; title: string; status: TankStatus };
  /** Categories with questions. Weights are included but judges need not see them. */
  categories: TankCategory[];
  projects: TankProjectProgress[];
}

export interface TankScorecard {
  /** questionId -> chosen level index */
  scores: Record<string, number>;
  notes: string;
  submittedAt: string | null;
  answered: number;
  total: number;
}

export class TankApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = 'TankApiError';
  }
}

/** Same-origin JSON fetch that throws TankApiError with the server's message. */
export async function tankFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: init?.body
      ? { 'content-type': 'application/json', ...init.headers }
      : init?.headers,
  });
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new TankApiError(response.status, 'Respuesta inesperada del servidor');
  }
  if (!response.ok) {
    const message = (data as { error?: string })?.error ?? 'La solicitud falló';
    throw new TankApiError(response.status, message);
  }
  return data as T;
}

/** Max points of a question (its last, highest stop). */
export const maxPoints = (question: TankQuestion): number =>
  question.levels.reduce((max, level) => Math.max(max, level.points), 0);
