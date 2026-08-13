ALTER TABLE poll_groups ADD COLUMN code TEXT;

UPDATE poll_groups
SET code = upper(substr(replace(id, '-', ''), 1, 10));

CREATE UNIQUE INDEX idx_poll_groups_code
  ON poll_groups (code);
