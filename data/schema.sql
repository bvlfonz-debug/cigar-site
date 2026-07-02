-- Ultimate Cigar Database — SQLite schema
-- See CLAUDE.md "Data model" for the authoritative field descriptions.

CREATE TABLE brand (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  country       TEXT NOT NULL,
  factory       TEXT,
  founded_year  INTEGER,
  story_short   TEXT NOT NULL
);

CREATE TABLE line (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_id         INTEGER NOT NULL REFERENCES brand(id),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  wrapper          TEXT NOT NULL,
  binder           TEXT NOT NULL,
  filler           TEXT NOT NULL,
  strength         TEXT NOT NULL CHECK (strength IN ('mild','mild-medium','medium','medium-full','full')),
  release_year     INTEGER,
  background_text  TEXT NOT NULL,
  UNIQUE (brand_id, slug)
);

CREATE TABLE vitola (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  line_id             INTEGER NOT NULL REFERENCES line(id),
  size_name           TEXT NOT NULL,
  slug                TEXT NOT NULL,
  length_in           REAL NOT NULL,
  ring_gauge          INTEGER NOT NULL,
  vitola_type         TEXT NOT NULL,
  stick_score         REAL,
  score_flavor        REAL,
  score_construction  REAL,
  score_complexity    REAL,
  score_value         REAL,
  tasting_notes       TEXT NOT NULL DEFAULT '[]',
  summary_review      TEXT NOT NULL,
  smoke_time_min      INTEGER,
  box_counts          TEXT NOT NULL DEFAULT '[]',
  UNIQUE (line_id, slug)
);

CREATE TABLE critic_review (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  vitola_id      INTEGER NOT NULL REFERENCES vitola(id),
  source_name    TEXT NOT NULL,
  source_type    TEXT NOT NULL DEFAULT 'critic' CHECK (source_type IN ('critic','retailer')),
  score          REAL NOT NULL,
  score_scale    REAL NOT NULL,
  review_count   INTEGER,
  review_date    TEXT NOT NULL,
  url            TEXT NOT NULL,
  key_notes_text TEXT
);

CREATE TABLE price_point (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  vitola_id      INTEGER NOT NULL REFERENCES vitola(id),
  retailer       TEXT NOT NULL,
  price_single   REAL,
  price_box      REAL,
  box_count      INTEGER,
  affiliate_url  TEXT,
  checked_at     TEXT NOT NULL
);

CREATE TABLE news_item (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  title               TEXT NOT NULL,
  summary             TEXT NOT NULL,
  source_name         TEXT NOT NULL,
  source_url          TEXT NOT NULL,
  published_at        TEXT NOT NULL,
  related_vitola_ids  TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_line_brand ON line(brand_id);
CREATE INDEX idx_vitola_line ON vitola(line_id);
CREATE INDEX idx_critic_review_vitola ON critic_review(vitola_id);
CREATE INDEX idx_price_point_vitola ON price_point(vitola_id);
