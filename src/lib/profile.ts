import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const GOALS = ["Поддерживать форму", "Снизить вес", "Набрать вес", "Больше энергии"];
export const ACTIVITY = ["Низкий", "Умеренный", "Активный", "Очень активный"];
export const DIETS = ["Без ограничений", "Вегетарианство", "Веганство", "Без лактозы"];

export const profileQuery = (userId: string) => queryOptions({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const [p, a] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("onboarding_answers").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    if (p.error) throw p.error;
    if (a.error) throw a.error;
    return { profile: p.data, answers: a.data };
  },
});

export type OnboardingInput = {
  name: string; age: number | null; height_cm: number | null; weight_kg: number | null;
  goal: string; activity_level: string; diet_preference: string;
};

export async function saveOnboarding(userId: string, v: OnboardingInput) {
  const { name, diet_preference, ...common } = v;
  const a = await supabase.from("onboarding_answers").upsert({ user_id: userId, ...common, diet_preference });
  if (a.error) throw a.error;
  const p = await supabase.from("profiles").upsert({ user_id: userId, name, ...common, onboarding_completed: true });
  if (p.error) throw p.error;
}
