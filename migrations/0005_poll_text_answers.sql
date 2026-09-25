-- Free-text poll questions: a poll can now be a 'choice' question (existing
-- behavior, options + poll_votes) or a 'text' question (a short free-text
-- answer per voter, capped at max_length). Existing rows default to
-- 'choice' and poll_votes/poll_options are untouched.

ALTER TABLE polls ADD COLUMN kind TEXT NOT NULL DEFAULT 'choice' CHECK (kind IN ('choice', 'text'));
ALTER TABLE polls ADD COLUMN max_length INTEGER CHECK (max_length IS NULL OR max_length BETWEEN 1 AND 500);

CREATE TABLE poll_text_answers (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL CHECK (length(voter_hash) = 43),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 500),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (poll_id, voter_hash)
);

CREATE INDEX idx_poll_text_answers_poll_created
  ON poll_text_answers (poll_id, created_at);
