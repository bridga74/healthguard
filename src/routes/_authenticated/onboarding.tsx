import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/healthguard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [
    { title: "Анкета — HealthGuard" }, { name: "description", content: "Настройка персонального профиля HealthGuard." },
    { property: "og:title", content: "Анкета — HealthGuard" }, { property: "og:description", content: "Настройте цели и предпочтения в HealthGuard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Onboarding,
});

const steps = ["О вас", "Цель", "Активность", "Питание"];
function Onboarding() {
  const navigate = useNavigate(); const [step, setStep] = useState(0);
  const next = async () => { if (step < 3) return setStep(step + 1); await supabase.auth.updateUser({ data: { onboarding_completed: true } }); navigate({ to: "/today", replace: true }); };
  return <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background px-5 py-7">
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
      <button aria-label="Назад" onClick={() => step ? setStep(step - 1) : history.back()} className="grid size-10 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></button>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step + 1) * 25}%` }} /></div>
      <span className="text-xs font-semibold text-muted-foreground">{step + 1}/4</span>
    </header>
    <section className="flex-1 pt-12"><p className="text-sm font-semibold text-primary">{steps[step]}</p>
      {step === 0 && <><h1 className="mt-2 text-3xl font-bold">Расскажите о себе</h1><p className="mt-2 text-muted-foreground">Эти параметры помогут настроить ориентиры.</p><div className="mt-8 grid grid-cols-2 gap-3"><Field label="Возраст" unit="лет" /><Field label="Рост" unit="см" /><Field label="Вес" unit="кг" /></div></>}
      {step === 1 && <ChoiceStep title="Какая у вас цель?" choices={["Поддерживать форму", "Снизить вес", "Набрать вес", "Больше энергии"]} />}
      {step === 2 && <ChoiceStep title="Ваш уровень активности" choices={["Низкий", "Умеренный", "Активный", "Очень активный"]} />}
      {step === 3 && <ChoiceStep title="Предпочтения в питании" choices={["Без ограничений", "Вегетарианство", "Веганство", "Без лактозы"]} />}
    </section>
    <ActionButton onClick={next} className="w-full">{step === 3 ? <><Check className="size-5" />Завершить</> : <>Продолжить<ChevronRight className="size-5" /></>}</ActionButton>
  </main>;
}
function Field({ label, unit }: { label: string; unit: string }) { return <label className="grid gap-2 text-sm font-semibold">{label}<span className="flex items-center rounded-2xl bg-card px-4 health-shadow"><input inputMode="numeric" placeholder="—" className="h-16 min-w-0 flex-1 bg-transparent text-xl font-bold outline-none" /><span className="text-sm text-muted-foreground">{unit}</span></span></label>; }
function ChoiceStep({ title, choices }: { title: string; choices: string[] }) { const [selected, setSelected] = useState(choices[0]); return <><h1 className="mt-2 text-3xl font-bold">{title}</h1><div className="mt-8 grid gap-3">{choices.map((choice) => <button key={choice} onClick={() => setSelected(choice)} className={`grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center rounded-2xl border px-5 text-left font-semibold ${selected === choice ? "border-primary bg-secondary text-primary" : "border-border bg-card"}`}><span>{choice}</span>{selected === choice && <Check className="size-5" />}</button>)}</div></>; }