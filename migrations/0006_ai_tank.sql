-- AI Tank: a Shark Tank style judging room for AI project pitches.
-- An event (edition) has weighted categories with questions; each question
-- carries 2 to 5 point stops (JSON levels, e.g. 0 / 10 / 15) that judges pick
-- with a snapping slider. Judges enter through a personal link (token) and
-- keep one scorecard per project. Scores store the chosen stop index, so the
-- leaderboard always uses the current point values of each stop.
PRAGMA foreign_keys = ON;

CREATE TABLE tank_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE tank_categories (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES tank_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  weight INTEGER NOT NULL DEFAULT 25 CHECK (weight BETWEEN 0 AND 100),
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tank_questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES tank_categories(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL CHECK (length(prompt) BETWEEN 1 AND 300),
  levels TEXT NOT NULL CHECK (json_valid(levels)),
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tank_projects (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES tank_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  team TEXT NOT NULL DEFAULT '' CHECK (length(team) <= 120),
  summary TEXT NOT NULL DEFAULT '' CHECK (length(summary) <= 1000),
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tank_judges (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES tank_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  token TEXT NOT NULL UNIQUE CHECK (length(token) = 32),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT
);

CREATE TABLE tank_scores (
  judge_id TEXT NOT NULL REFERENCES tank_judges(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES tank_projects(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES tank_questions(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 4),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (judge_id, project_id, question_id)
);

CREATE TABLE tank_scorecards (
  judge_id TEXT NOT NULL REFERENCES tank_judges(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES tank_projects(id) ON DELETE CASCADE,
  notes TEXT NOT NULL DEFAULT '' CHECK (length(notes) <= 1000),
  submitted_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (judge_id, project_id)
);

CREATE INDEX idx_tank_categories_event ON tank_categories (event_id, position);
CREATE INDEX idx_tank_questions_category ON tank_questions (category_id, position);
CREATE INDEX idx_tank_projects_event ON tank_projects (event_id, position);
CREATE INDEX idx_tank_judges_event ON tank_judges (event_id, created_at);
CREATE INDEX idx_tank_scores_project ON tank_scores (project_id);
CREATE INDEX idx_tank_scorecards_project ON tank_scorecards (project_id);
