import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/healthguard";
import { ACTIVITY, DIETS, GOALS, profileQuery, saveOnboarding } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [
    { title: "Анкета — HealthGuard" }, { name: "description", content: "Настройка персонального профиля HealthGuard." },
    { property: "og:title", content: "Анкета — HealthGuard" }, { property: "og:description", content: "Настройте цели и предпочтения в HealthGuard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Onboarding,
});

const steps = ["О вас", "Цель", "Активность", "Питание"];
const limits = { age: [10, 120, "Возраст"], height: [80, 250, "Рост"], weight: [25, 350, "Вес"] } as const;

function Onboarding() {
  const navigate = useNavigate(); const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const { data, isLoading, error: loadError } = useQuery(profileQuery(user.id));
  const [step, setStep] = useState(0);
  const [nums, setNums] = useState({ age: "", height: "", weight: "" });
  const [goal, setGoal] = useState<string>(GOALS[0]!);
  const [activity, setActivity] = useState<string>(ACTIVITY[1]!);
  const [diet, setDiet] = useState<string>(DIETS[0]!);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.profile?.onboarding_completed) { navigate({ to: "/today", replace: true }); return; }
    const a = data.answers;
    if (a) {
      setNums({ age: a.age?.toString() ?? "", height: a.height_cm?.toString() ?? "", weight: a.weight_kg?.toString() ?? "" });
      setGoal(a.goal); setActivity(a.activity_level); setDiet(a.diet_preference);
    }
  }, [data, navigate]);

  function validateNums() {
    for (const key of ["age", "height", "weight"] as const) {
      const raw = nums[key].replace(",", ".").trim();
      if (!raw) continue;
      const n = Number(raw); const [min, max, label] = limits[key];
      if (!Number.isFinite(n) || n < min || n > max) return `${label}: укажите значение от ${min} до ${max}`;
    }
    return null;
  }
  const toNum = (s: string) => { const t = s.replace(",", ".").trim(); return t ? Number(t) : null; };

  async function next() {
    setError(null);
    if (step === 0) { const v = validateNums(); if (v) return setError(v); }
    if (step < 3) return setStep(step + 1);
    setSaving(true);
    try {
      const age = toNum(nums.age);
      await saveOnboarding(user.id, {
        name: (user.user_metadata?.["name"] as string | undefined)?.slice(0, 100) ?? "",
        age: age === null ? null : Math.round(age), height_cm: toNum(nums.height), weight_kg: toNum(nums.weight),
        goal, activity_level: activity, diet_preference: diet,
      });
      await qc.invalidateQueries({ queryKey: ["profile", user.id] });
      navigate({ to: "/today", replace: true });
    } catch {
      setError("Не удалось сохранить анкету. Проверьте соединение и попробуйте ещё раз.");
    } finally { setSaving(false); }
  }

  if (isLoading) return <main className="grid min-h-dvh place-items-center bg-background text-muted-foreground"><Loader2 className="size-8 animate-spin text-primary" /></main>;

  return <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background px-5 py-7">
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
      <button aria-label="Назад" onClick={() => step ? setStep(step - 1) : history.back()} className="grid size-10 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></button>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step + 1) * 25}%` }} /></div>
      <span className="text-xs font-semibold text-muted-foreground">{step + 1}/4</span>
    </header>
    <section className="flex-1 pt-12"><p className="text-sm font-semibold text-primary">{steps[step]}</p>
      {step === 0 && <><h1 className="mt-2 text-3xl font-bold">Расскажите о себе</h1><p className="mt-2 text-muted-foreground">Эти параметры помогут настроить ориентиры. Можно оставить пустыми.</p><div className="mt-8 grid grid-cols-2 gap-3">
        <Field label="Возраст" unit="лет" value={nums.age} onChange={(v) => setNums({ ...nums, age: v })} />
        <Field label="Рост" unit="см" value={nums.height} onChange={(v) => setNums({ ...nums, height: v })} />
        <Field label="Вес" unit="кг" value={nums.weight} onChange={(v) => setNums({ ...nums, weight: v })} />
      </div></>}
      {step === 1 && <ChoiceStep title="Какая у вас цель?" choices={GOALS} selected={goal} onSelect={setGoal} />}
      {step === 2 && <ChoiceStep title="Ваш уровень активности" choices={ACTIVITY} selected={activity} onSelect={setActivity} />}
      {step === 3 && <ChoiceStep title="Предпочтения в питании" choices={DIETS} selected={diet} onSelect={setDiet} />}
    </section>
    {(error || loadError) && <p role="alert" className="mb-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error ?? "Не удалось загрузить сохранённые ответы."}</p>}
    <ActionButton onClick={next} disabled={saving} className="w-full">{saving ? <><Loader2 className="size-5 animate-spin" />Сохраняем…</> : step === 3 ? <><Check className="size-5" />Завершить</> : <>Продолжить<ChevronRight className="size-5" /></>}</ActionButton>
  </main>;
}
function Field({ label, unit, value, onChange }: { label: string; unit: string; value: string; onChange: (v: string) => void }) { return <label className="grid gap-2 text-sm font-semibold">{label}<span className="flex items-center rounded-2xl bg-card px-4 health-shadow"><input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="—" className="h-16 min-w-0 flex-1 bg-transparent text-xl font-bold outline-none" /><span className="text-sm text-muted-foreground">{unit}</span></span></label>; }
function ChoiceStep({ title, choices, selected, onSelect }: { title: string; choices: string[]; selected: string; onSelect: (c: string) => void }) { return <><h1 className="mt-2 text-3xl font-bold">{title}</h1><div className="mt-8 grid gap-3">{choices.map((choice) => <button key={choice} onClick={() => onSelect(choice)} className={`grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center rounded-2xl border px-5 text-left font-semibold ${selected === choice ? "border-primary bg-secondary text-primary" : "border-border bg-card"}`}><span>{choice}</span>{selected === choice && <Check className="size-5" />}</button>)}</div></>; }
