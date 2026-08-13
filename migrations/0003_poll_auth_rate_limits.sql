CREATE TABLE poll_auth_attempts (
  id TEXT PRIMARY KEY,
  identifier_hash TEXT NOT NULL CHECK (length(identifier_hash) = 43),
  attempted_at INTEGER NOT NULL
);

CREATE INDEX idx_poll_auth_attempts_identifier_time
  ON poll_auth_attempts (identifier_hash, attempted_at);
