-- ==========================================================
-- VidyaMitra – Full Schema (safe to re-run)
-- ==========================================================

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resume Data
CREATE TABLE IF NOT EXISTS resume_data (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  skills         JSONB  DEFAULT '[]',
  score          INTEGER,
  full_name      TEXT,
  email          TEXT,
  phone          TEXT,
  experience     JSONB  DEFAULT '[]',
  gaps           JSONB  DEFAULT '[]',
  gemini_summary TEXT,
  raw_analysis   JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Progress
CREATE TABLE IF NOT EXISTS user_progress (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  courses_started           TEXT[]  DEFAULT '{}',
  quizzes_completed         TEXT[]  DEFAULT '{}',
  interview_sessions        JSONB   DEFAULT '[]',
  courses_started_count     INTEGER DEFAULT 0,
  quizzes_completed_count   INTEGER DEFAULT 0,
  interview_sessions_count  INTEGER DEFAULT 0,
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  rating           INTEGER CHECK (rating BETWEEN 1 AND 5),
  message          TEXT NOT NULL,
  sentiment        TEXT,
  sentiment_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- Row Level Security
-- ==========================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_data    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback       ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Own profile"        ON user_profiles;
DROP POLICY IF EXISTS "Own resume"         ON resume_data;
DROP POLICY IF EXISTS "Own progress"       ON user_progress;
DROP POLICY IF EXISTS "Insert feedback"    ON feedback;
DROP POLICY IF EXISTS "Own feedback"       ON feedback;

CREATE POLICY "Own profile"     ON user_profiles FOR ALL   USING (auth.uid() = id);
CREATE POLICY "Own resume"      ON resume_data   FOR ALL   USING (auth.uid() = user_id);
CREATE POLICY "Own progress"    ON user_progress FOR ALL   USING (auth.uid() = user_id);
-- Any logged-in user can submit feedback; can only read their own
CREATE POLICY "Insert feedback" ON feedback      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Own feedback"    ON feedback      FOR SELECT USING (auth.uid() = user_id);

-- ==========================================================
-- Trigger: auto-create profile on signup (exception-safe)
-- ==========================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

--
