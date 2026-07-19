-- Ultimate Cigar Database — SQLite schema
-- See CLAUDE.md "Data model" for the authoritative field descriptions.

-- A factory is a distinct entity from a brand because one factory commonly
-- rolls cigars for several brands (a real, common pattern with contract
-- manufacturing) — brand.factory_id links to a profiled factory once one
-- exists; brand.factory stays as a plain-text fallback name until then.
-- See CLAUDE.md "Brand & Factory Profiles" for the authoritative description.
CREATE TABLE factory (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  country       TEXT NOT NULL,
  city          TEXT,
  founded_year  INTEGER,
  history_text  TEXT
);

CREATE TABLE brand (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  country       TEXT NOT NULL,
  factory       TEXT,
  factory_id    INTEGER REFERENCES factory(id),
  founded_year  INTEGER,
  story_short   TEXT NOT NULL
);

-- Cited sources for brand/factory facts (founding info, history, etc.) —
-- one row per citation, many rows per parent, same shape as critic_review /
-- lounge_external_rating. NEVER a single fixed source field on the parent:
-- different facts (founding year vs. factory location) are often sourced
-- from different places at different times.
CREATE TABLE brand_source (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_id      INTEGER NOT NULL REFERENCES brand(id),
  source_name   TEXT NOT NULL,
  source_url    TEXT NOT NULL,
  fact_note     TEXT NOT NULL,
  retrieved_at  TEXT NOT NULL
);

CREATE TABLE factory_source (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  factory_id    INTEGER NOT NULL REFERENCES factory(id),
  source_name   TEXT NOT NULL,
  source_url    TEXT NOT NULL,
  fact_note     TEXT NOT NULL,
  retrieved_at  TEXT NOT NULL
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

-- Cited pairing recommendations from a real critic/publication — auto-publish
-- tier (a citation on an existing entity, like critic_review), NOT queue-gated.
-- Keyed to line_id, not vitola_id: a real "pair this with X" recommendation is
-- almost always about the blend as a whole, not one specific size — unlike a
-- numeric score, which genuinely varies by ring gauge/burn time.
-- See CLAUDE.md "Cigar Pairings" for the authoritative description.
CREATE TABLE cigar_pairing_citation (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  line_id        INTEGER NOT NULL REFERENCES line(id),
  pairing_text   TEXT NOT NULL,
  category       TEXT,
  source_name    TEXT NOT NULL,
  source_url     TEXT NOT NULL,
  published_date TEXT NOT NULL
);

-- Community-submitted pairings. No "pending" status column: exactly like
-- brand/lounge/factory rows, nothing is ever inserted without a human having
-- already read it for appropriateness first — see CLAUDE.md "Cigar Pairings".
CREATE TABLE cigar_pairing_community (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  line_id         INTEGER NOT NULL REFERENCES line(id),
  submitter_name  TEXT NOT NULL,
  pairing_text    TEXT NOT NULL,
  submitted_date  TEXT NOT NULL
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

-- First-hand, user-submitted reviews — never conflated with critic_review or
-- vitola.stick_score. Keyed to vitola_id (not line_id) for the same reason
-- critic_review is: burn/draw/construction are real per-physical-stick
-- properties. Rows only ever arrive via scripts/sync-community-reviews.mjs,
-- which only inserts submissions the owner has already approved in the
-- Vercel Blob moderation queue — see CLAUDE.md "Community Reviews".
CREATE TABLE cigar_community_review (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  vitola_id             INTEGER NOT NULL REFERENCES vitola(id),
  external_id           TEXT NOT NULL UNIQUE,
  reviewer_name         TEXT NOT NULL,
  star_rating           INTEGER NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  strength_experienced  TEXT CHECK (strength_experienced IN ('mild','mild-medium','medium','medium-full','full')),
  draw_experienced      TEXT CHECK (draw_experienced IN ('tight','ideal','loose')),
  burn_experienced      TEXT CHECK (burn_experienced IN ('poor','average','excellent')),
  tasting_notes_user    TEXT NOT NULL DEFAULT '[]',
  review_text           TEXT,
  submitted_date        TEXT NOT NULL,
  report_count          INTEGER NOT NULL DEFAULT 0,
  hidden                INTEGER NOT NULL DEFAULT 0
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

-- Cigar Release Calendar — pairs with news_item but tracks a release's own
-- lifecycle (announced -> released) separately from ad-hoc news briefs.
-- See CLAUDE.md "Cigar Release Calendar" for the authoritative field
-- descriptions. Same auto-publish tier as news_item: a real source_name/
-- source_url is required, but this is not a new catalog entity so it does
-- NOT go through the queue-add review flow the way new brands/lines do.
CREATE TABLE cigar_release (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                  TEXT NOT NULL UNIQUE,
  brand_name            TEXT NOT NULL,
  brand_slug            TEXT REFERENCES brand(slug),
  line_name             TEXT NOT NULL,
  announced_date        TEXT NOT NULL,
  release_month         TEXT,
  release_date_text     TEXT,
  summary_text          TEXT NOT NULL,
  source_name           TEXT NOT NULL,
  source_url            TEXT NOT NULL,
  related_vitola_id     INTEGER REFERENCES vitola(id),
  related_news_item_id  INTEGER REFERENCES news_item(id)
);

-- Accessories Expansion (non-tobacco: humidors, cutters, lighters, etc.) —
-- see CLAUDE.md "Accessories Expansion" for the authoritative field descriptions.

CREATE TABLE accessory_category (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  slug  TEXT NOT NULL UNIQUE
);

CREATE TABLE accessory (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id     INTEGER NOT NULL REFERENCES accessory_category(id),
  brand           TEXT NOT NULL,
  model           TEXT NOT NULL,
  slug            TEXT NOT NULL,
  specs           TEXT NOT NULL DEFAULT '{}',
  acc_score       REAL,
  summary_review  TEXT NOT NULL,
  pros            TEXT NOT NULL DEFAULT '[]',
  cons            TEXT NOT NULL DEFAULT '[]',
  UNIQUE (category_id, slug)
);

CREATE TABLE accessory_review (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  accessory_id   INTEGER NOT NULL REFERENCES accessory(id),
  source_name    TEXT NOT NULL,
  source_type    TEXT NOT NULL DEFAULT 'critic' CHECK (source_type IN ('critic','community')),
  score          REAL NOT NULL,
  score_scale    REAL NOT NULL,
  review_date    TEXT NOT NULL,
  url            TEXT NOT NULL,
  key_notes_text TEXT
);

CREATE TABLE accessory_price_point (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  accessory_id   INTEGER NOT NULL REFERENCES accessory(id),
  retailer       TEXT NOT NULL,
  price_single   REAL,
  price_box      REAL,
  box_count      INTEGER,
  affiliate_url  TEXT,
  checked_at     TEXT NOT NULL
);

-- Lounge Directory Expansion (factual directory, no first-hand ratings) —
-- see CLAUDE.md "Lounge Directory Expansion" for the authoritative field descriptions.

CREATE TABLE lounge (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  name                    TEXT NOT NULL,
  slug                    TEXT NOT NULL,
  city                    TEXT NOT NULL,
  city_slug               TEXT NOT NULL,
  state                   TEXT,
  country                 TEXT NOT NULL DEFAULT 'USA',
  address                 TEXT NOT NULL,
  phone                   TEXT,
  website                 TEXT,
  hours_text              TEXT,
  walk_in_or_membership   TEXT CHECK (walk_in_or_membership IN ('walk-in','membership','both')),
  membership_details      TEXT,
  indoor_smoking_status   TEXT CHECK (indoor_smoking_status IN ('allowed','not-allowed','allowed-with-restrictions')),
  indoor_smoking_note     TEXT,
  amenities               TEXT NOT NULL DEFAULT '[]',
  overview_text           TEXT NOT NULL,
  lounge_score            REAL,
  facts_source_url        TEXT,
  facts_checked_at        TEXT,
  UNIQUE (city_slug, slug)
);

-- Populated only from Phase C onward — schema exists from day one so ratings
-- slot in without a migration, but stays empty through the Phase A/B factual
-- directory. Never a first-hand rating: only cited external platforms
-- (Google/Yelp/TripAdvisor-style aggregates) or genuine dated editorial
-- rankings, aggregated the same way as StickScore/AccScore.
CREATE TABLE lounge_external_rating (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  lounge_id      INTEGER NOT NULL REFERENCES lounge(id),
  source_name    TEXT NOT NULL,
  source_type    TEXT NOT NULL DEFAULT 'platform' CHECK (source_type IN ('critic','platform')),
  score          REAL NOT NULL,
  score_scale    REAL NOT NULL,
  review_count   INTEGER,
  rating_date    TEXT NOT NULL,
  url            TEXT NOT NULL,
  key_notes_text TEXT
);

CREATE INDEX idx_line_brand ON line(brand_id);
CREATE INDEX idx_vitola_line ON vitola(line_id);
CREATE INDEX idx_critic_review_vitola ON critic_review(vitola_id);
CREATE INDEX idx_price_point_vitola ON price_point(vitola_id);
CREATE INDEX idx_accessory_category ON accessory(category_id);
CREATE INDEX idx_accessory_review_accessory ON accessory_review(accessory_id);
CREATE INDEX idx_accessory_price_point_accessory ON accessory_price_point(accessory_id);
CREATE INDEX idx_lounge_city ON lounge(city_slug);
CREATE INDEX idx_lounge_external_rating_lounge ON lounge_external_rating(lounge_id);
CREATE INDEX idx_cigar_release_brand ON cigar_release(brand_slug);
CREATE INDEX idx_cigar_release_vitola ON cigar_release(related_vitola_id);
CREATE INDEX idx_brand_factory ON brand(factory_id);
CREATE INDEX idx_brand_source_brand ON brand_source(brand_id);
CREATE INDEX idx_factory_source_factory ON factory_source(factory_id);
CREATE INDEX idx_cigar_pairing_citation_line ON cigar_pairing_citation(line_id);
CREATE INDEX idx_cigar_pairing_community_line ON cigar_pairing_community(line_id);
CREATE INDEX idx_cigar_community_review_vitola ON cigar_community_review(vitola_id);
