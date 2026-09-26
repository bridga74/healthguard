import { createFileRoute } from "@tanstack/react-router";
import { Bell, Droplets, Footprints, Plus, Utensils, Zap } from "lucide-react";
import { useState } from "react";
import { ActionButton, AppShell, DemoBadge, ProgressBar, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/_authenticated/today")({
  head: () => ({ meta: [
    { title: "Сегодня — HealthGuard" }, { name: "description", content: "Дневная сводка питания, воды и активности." },
    { property: "og:title", content: "Сегодня — HealthGuard" }, { property: "og:description", content: "Дневная сводка здоровых привычек." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Today,
});

function Today() {
  const [water, setWater] = useState(3); const [notice, setNotice] = useState("");
  const announce = (value: string) => { setNotice(value); window.setTimeout(() => setNotice(""), 1800); };
  return <AppShell title="Добрый день, Анна" eyebrow="Суббота, 26 сентября" action={<button aria-label="Уведомления" className="grid size-10 place-items-center rounded-full bg-card"><Bell className="size-5" /></button>}>
    <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">Ваш обзор на сегодня</p><DemoBadge /></div>
    <ScreenCard className="bg-secondary">
      <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-secondary-foreground">Калории</p><p className="mt-2 text-3xl font-bold">1 240 <span className="text-sm font-medium">из 2 000 ккал</span></p></div><div className="grid size-11 place-items-center rounded-full bg-card text-primary"><Zap className="size-5" /></div></div>
      <div className="mt-5"><ProgressBar value={62} /></div><p className="mt-2 text-xs text-muted-foreground">Демонстрационные данные</p>
    </ScreenCard>
    <div className="mt-3 grid grid-cols-3 gap-2">
      {[['Белки','68 / 100 г',68],['Жиры','42 / 70 г',60],['Углеводы','145 / 250 г',58]].map(([label,value,progress]) => <ScreenCard key={String(label)} className="p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold">{value}</p><div className="mt-3"><ProgressBar value={Number(progress)} /></div></ScreenCard>)}
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ScreenCard><Droplets className="size-6 text-primary" /><p className="mt-3 text-xs text-muted-foreground">Вода</p><p className="mt-1 text-xl font-bold">{water} из 8</p><p className="text-xs text-muted-foreground">стаканов · демо</p></ScreenCard>
      <ScreenCard><Footprints className="size-6 text-primary" /><p className="mt-3 text-xs text-muted-foreground">Шаги</p><p className="mt-1 text-xl font-bold">6 420</p><p className="text-xs text-muted-foreground">из 10 000 · демо</p></ScreenCard>
    </div>
    <h2 className="mb-3 mt-7 text-lg font-bold">Быстрые действия</h2>
    <div className="grid gap-2">
      <ActionButton onClick={() => announce("Открыт поиск продуктов")}><Utensils className="size-5" />Добавить еду</ActionButton>
      <div className="grid grid-cols-2 gap-2"><button onClick={() => { setWater(Math.min(8, water + 1)); announce("Стакан воды добавлен"); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground"><Droplets className="size-5" />Добавить воду</button><button onClick={() => announce("Открыт выбор активности")} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-card text-sm font-semibold text-foreground health-shadow"><Plus className="size-5" />Активность</button></div>
    </div>
    {notice && <div role="status" className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background health-shadow">{notice}</div>}
  </AppShell>;
}