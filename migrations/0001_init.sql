CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cat TEXT NOT NULL,
  ptype TEXT NOT NULL,
  make TEXT NOT NULL,
  makes TEXT NOT NULL,
  veh TEXT,
  eng TEXT,
  gbx TEXT,
  side TEXT,
  pop INTEGER NOT NULL DEFAULT 0,
  search TEXT NOT NULL,
  oem TEXT,
  image TEXT,
  note TEXT
);
CREATE INDEX products_cat ON products (cat, pop DESC);
CREATE INDEX products_make ON products (make, pop DESC);
CREATE INDEX products_veh ON products (veh);
CREATE INDEX products_eng ON products (eng);
CREATE INDEX products_ptype ON products (ptype);
CREATE INDEX products_pop ON products (pop DESC, name);

CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  country TEXT,
  destination TEXT,
  buyer_type TEXT,
  notes TEXT,
  items TEXT NOT NULL,
  trade_account_id TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX quotes_created ON quotes (created_at DESC);
CREATE INDEX quotes_trade ON quotes (trade_account_id);

CREATE TABLE part_requests (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  make TEXT,
  model TEXT,
  year TEXT,
  vin TEXT,
  engine TEXT,
  part_name TEXT NOT NULL,
  oem TEXT,
  condition TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  trade_account_id TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX part_requests_created ON part_requests (created_at DESC);

CREATE TABLE trade_accounts (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  business_type TEXT NOT NULL,
  website TEXT,
  monthly_volume TEXT,
  brands TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  decided_at TEXT
);

CREATE TABLE login_tokens (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  body TEXT NOT NULL
);

CREATE TABLE rate_limits (
  bucket TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX rate_limits_bucket ON rate_limits (bucket, created_at);
