CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  age smallint,
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  target_weight_kg numeric(5,1),
  goal text,
  activity_level text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_age_chk CHECK (age IS NULL OR age BETWEEN 10 AND 120),
  CONSTRAINT profiles_height_chk CHECK (height_cm IS NULL OR height_cm BETWEEN 80 AND 250),
  CONSTRAINT profiles_weight_chk CHECK (weight_kg IS NULL OR weight_kg BETWEEN 25 AND 350),
  CONSTRAINT profiles_target_chk CHECK (target_weight_kg IS NULL OR target_weight_kg BETWEEN 25 AND 350),
  CONSTRAINT profiles_name_len CHECK (char_length(name) <= 100)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own profile delete" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.onboarding_answers (
  user_id uuid PRIMARY KEY,
  age smallint,
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  goal text NOT NULL,
  activity_level text NOT NULL,
  diet_preference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT oa_goal_chk CHECK (goal IN ('Поддерживать форму','Снизить вес','Набрать вес','Больше энергии')),
  CONSTRAINT oa_activity_chk CHECK (activity_level IN ('Низкий','Умеренный','Активный','Очень активный')),
  CONSTRAINT oa_diet_chk CHECK (diet_preference IN ('Без ограничений','Вегетарианство','Веганство','Без лактозы')),
  CONSTRAINT oa_age_chk CHECK (age IS NULL OR age BETWEEN 10 AND 120),
  CONSTRAINT oa_height_chk CHECK (height_cm IS NULL OR height_cm BETWEEN 80 AND 250),
  CONSTRAINT oa_weight_chk CHECK (weight_kg IS NULL OR weight_kg BETWEEN 25 AND 350)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_answers TO authenticated;
GRANT ALL ON public.onboarding_answers TO service_role;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own answers select" ON public.onboarding_answers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own answers insert" ON public.onboarding_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own answers update" ON public.onboarding_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own answers delete" ON public.onboarding_answers FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER onboarding_answers_updated_at BEFORE UPDATE ON public.onboarding_answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();