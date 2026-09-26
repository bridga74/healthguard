import { createFileRoute } from "@tanstack/react-router";
import { Bike, Clock3, Footprints, Plus, Timer, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ActionButton, AppShell, DemoBadge, ProgressBar, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/activity")({ head: () => ({ meta: [
  { title: "Активность — HealthGuard" }, { name: "description", content: "Шаги, тренировки и активные минуты." }, { property: "og:title", content: "Активность — HealthGuard" }, { property: "og:description", content: "Контроль ежедневной активности." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: ActivityPage });

function ActivityPage() { const [added, setAdded] = useState(false); return <AppShell title="Активность" eyebrow="Сегодня" action={<DemoBadge />}>
  <ScreenCard className="bg-secondary"><div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-full bg-card text-primary"><Footprints className="size-7" /></div><div><p className="text-sm text-muted-foreground">Шаги</p><p className="text-3xl font-bold">6 420</p><p className="text-xs text-muted-foreground">из 10 000 · демо</p></div></div><div className="mt-5"><ProgressBar value={64} /></div></ScreenCard>
  <div className="mt-3 grid grid-cols-2 gap-3"><ScreenCard><Timer className="size-6 text-primary" /><p className="mt-3 text-2xl font-bold">38 мин</p><p className="text-xs text-muted-foreground">Активность · демо</p></ScreenCard><ScreenCard><TrendingUp className="size-6 text-primary" /><p className="mt-3 text-2xl font-bold">2</p><p className="text-xs text-muted-foreground">Тренировки · демо</p></ScreenCard></div>
  <div className="mb-3 mt-7 flex items-center justify-between"><h2 className="text-lg font-bold">Тренировки</h2><span className="text-xs text-muted-foreground">Эта неделя</span></div>
  <ScreenCard className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Bike className="size-5" /></div><div><p className="font-bold">Велосипед</p><p className="text-xs text-muted-foreground">Демонстрационная запись</p></div><div className="text-right"><p className="text-sm font-bold">25 мин</p><p className="text-xs text-muted-foreground">22 сен.</p></div></ScreenCard>
  {added && <ScreenCard className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Clock3 className="size-5" /></div><div><p className="font-bold">Новая активность</p><p className="text-xs text-muted-foreground">Добавлено в демо</p></div><p className="text-sm font-bold">30 мин</p></ScreenCard>}
  <ActionButton onClick={() => setAdded(true)} className="mt-6 w-full"><Plus className="size-5" />Добавить активность</ActionButton>
  </AppShell>; }