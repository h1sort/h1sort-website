PRAGMA foreign_keys = ON;

CREATE TABLE poll_groups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE polls (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES poll_groups(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE
    CHECK (length(code) = 7 AND code NOT GLOB '*[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]*'),
  question TEXT NOT NULL CHECK (length(question) BETWEEN 1 AND 500),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  opened_at TEXT,
  closed_at TEXT,
  CHECK (
    (status = 'draft' AND opened_at IS NULL AND closed_at IS NULL) OR
    (status = 'open' AND opened_at IS NOT NULL AND closed_at IS NULL) OR
    (status = 'closed' AND opened_at IS NOT NULL AND closed_at IS NOT NULL)
  )
);

CREATE TABLE poll_options (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (length(label) BETWEEN 1 AND 120),
  position INTEGER NOT NULL CHECK (position BETWEEN 0 AND 7),
  UNIQUE (poll_id, id),
  UNIQUE (poll_id, position),
  UNIQUE (poll_id, label COLLATE NOCASE)
);

CREATE TABLE poll_votes (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL CHECK (length(voter_hash) = 43),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (poll_id, option_id) REFERENCES poll_options(poll_id, id) ON DELETE CASCADE,
  UNIQUE (poll_id, voter_hash)
);

CREATE INDEX idx_polls_group_created
  ON polls (group_id, created_at DESC);

CREATE INDEX idx_poll_options_poll_position
  ON poll_options (poll_id, position);

CREATE INDEX idx_poll_votes_poll_option
  ON poll_votes (poll_id, option_id);
