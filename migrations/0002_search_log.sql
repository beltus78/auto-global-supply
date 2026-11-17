-- What visitors search for in the catalogue, with how many results they got.
-- Read weekly to find parts customers want that the catalogue does not list yet.
CREATE TABLE search_log (
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  q TEXT,
  make TEXT,
  model TEXT,
  gen TEXT,
  engine TEXT,
  category TEXT,
  part TEXT,
  results INTEGER NOT NULL,
  path TEXT,
  country TEXT
);
CREATE INDEX search_log_created ON search_log (created_at);
