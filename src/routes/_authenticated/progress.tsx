import { createFileRoute } from "@tanstack/react-router";
import { Award, CalendarDays, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AppShell, DemoBadge, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/_authenticated/progress")({ head: () => ({ meta: [
  { title: "Прогресс — HealthGuard" }, { name: "description", content: "Статистика здоровых привычек за 7 и 30 дней." }, { property: "og:title", content: "Прогресс — HealthGuard" }, { property: "og:description", content: "Наглядная статистика здоровых привычек." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: Progress });

const week = [45, 68, 56, 82, 64, 91, 73]; const month = [52, 61, 73, 58, 80, 67, 86];
function Progress() { const [period, setPeriod] = useState<7 | 30>(7); const values = period === 7 ? week : month; return <AppShell title="Прогресс" eyebrow="Статистика" action={<DemoBadge />}>
  <div className="grid grid-cols-2 rounded-xl bg-muted p-1"><button onClick={() => setPeriod(7)} className={`h-10 rounded-lg text-sm font-semibold ${period === 7 ? "bg-card text-foreground health-shadow" : "text-muted-foreground"}`}>7 дней</button><button onClick={() => setPeriod(30)} className={`h-10 rounded-lg text-sm font-semibold ${period === 30 ? "bg-card text-foreground health-shadow" : "text-muted-foreground"}`}>30 дней</button></div>
  <ScreenCard className="mt-4"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Выполнение целей</p><p className="mt-1 text-2xl font-bold">74%</p></div><TrendingUp className="size-6 text-primary" /></div><div className="mt-8 flex h-36 items-end justify-between gap-2">{values.map((value, i) => <div key={i} className="flex h-full flex-1 flex-col justify-end"><div className="rounded-t-md bg-primary" style={{ height: `${value}%` }} /><span className="mt-2 text-center text-[10px] text-muted-foreground">{period === 7 ? ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i] : `${i + 1}`}</span></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Демонстрационная статистика</p></ScreenCard>
  <h2 className="mb-3 mt-7 text-lg font-bold">Сводка</h2><div className="grid grid-cols-2 gap-3"><ScreenCard><CalendarDays className="size-6 text-primary" /><p className="mt-3 text-2xl font-bold">5 из 7</p><p className="text-xs text-muted-foreground">Активных дней · демо</p></ScreenCard><ScreenCard><Award className="size-6 text-primary" /><p className="mt-3 text-2xl font-bold">4 дня</p><p className="text-xs text-muted-foreground">Серия · демо</p></ScreenCard></div>
  </AppShell>; }