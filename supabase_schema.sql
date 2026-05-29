-- ─────────────────────────────────────────────
--  OPBASE — Supabase SQL Schema
--  Run this entire file in the Supabase SQL Editor
--  (Project → SQL Editor → New query → Paste → Run)
-- ─────────────────────────────────────────────

-- Players
CREATE TABLE IF NOT EXISTS players (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online','busy','offline')),
  bio         TEXT DEFAULT '',
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  datetime    TIMESTAMPTZ NOT NULL,
  game        TEXT DEFAULT '',
  note        TEXT DEFAULT '',
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs (one per player per session)
CREATE TABLE IF NOT EXISTS rsvps (
  id          BIGSERIAL PRIMARY KEY,
  session_id  BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  answer      TEXT NOT NULL CHECK (answer IN ('yes','no')),
  UNIQUE (session_id, player_name)
);

-- Polls
CREATE TABLE IF NOT EXISTS polls (
  id          BIGSERIAL PRIMARY KEY,
  question    TEXT NOT NULL,
  options     TEXT[] NOT NULL,
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes (one per player per poll)
CREATE TABLE IF NOT EXISTS poll_votes (
  id           BIGSERIAL PRIMARY KEY,
  poll_id      BIGINT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  player_name  TEXT NOT NULL,
  option_index INTEGER NOT NULL,
  UNIQUE (poll_id, player_name)
);

-- Games
CREATE TABLE IF NOT EXISTS games (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  genre       TEXT DEFAULT 'Sonstiges',
  max_players INTEGER,
  platform    TEXT DEFAULT '',
  added_by    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
--  Row Level Security (RLS)
--  Allow all reads and writes for anyone with
--  the anon key (public group, no login needed)
-- ─────────────────────────────────────────────

ALTER TABLE players    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps      ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls      ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE games      ENABLE ROW LEVEL SECURITY;

-- Players
CREATE POLICY "public_read_players"  ON players  FOR SELECT USING (true);
CREATE POLICY "public_write_players" ON players  FOR ALL    USING (true) WITH CHECK (true);

-- Sessions
CREATE POLICY "public_read_sessions"  ON sessions  FOR SELECT USING (true);
CREATE POLICY "public_write_sessions" ON sessions  FOR ALL    USING (true) WITH CHECK (true);

-- RSVPs
CREATE POLICY "public_read_rsvps"  ON rsvps  FOR SELECT USING (true);
CREATE POLICY "public_write_rsvps" ON rsvps  FOR ALL    USING (true) WITH CHECK (true);

-- Polls
CREATE POLICY "public_read_polls"  ON polls  FOR SELECT USING (true);
CREATE POLICY "public_write_polls" ON polls  FOR ALL    USING (true) WITH CHECK (true);

-- Poll Votes
CREATE POLICY "public_read_votes"  ON poll_votes  FOR SELECT USING (true);
CREATE POLICY "public_write_votes" ON poll_votes  FOR ALL    USING (true) WITH CHECK (true);

-- Games
CREATE POLICY "public_read_games"  ON games  FOR SELECT USING (true);
CREATE POLICY "public_write_games" ON games  FOR ALL    USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
--  Realtime
--  Enable realtime on all tables
-- ─────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE polls;
ALTER PUBLICATION supabase_realtime ADD TABLE poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- ─────────────────────────────────────────────
--  Auto-cleanup: sessions older than 3 days
--  (Optional — run as a cron job in Supabase)
-- ─────────────────────────────────────────────
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule(
--   'cleanup-old-sessions',
--   '0 3 * * *',  -- every day at 3am
--   $$
--     DELETE FROM sessions WHERE datetime < NOW() - INTERVAL '3 days';
--     DELETE FROM polls WHERE created_at < NOW() - INTERVAL '3 days';
--   $$
-- );
