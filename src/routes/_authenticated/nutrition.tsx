import { createFileRoute } from "@tanstack/react-router";
import { Apple, Coffee, Moon, Plus, Sun } from "lucide-react";
import { useState } from "react";
import { ActionButton, AppShell, DemoBadge, ProgressBar, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/_authenticated/nutrition")({ head: () => ({ meta: [
  { title: "Питание — HealthGuard" }, { name: "description", content: "Дневник питания и приёмов пищи." }, { property: "og:title", content: "Питание — HealthGuard" }, { property: "og:description", content: "Удобный дневник питания." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: Nutrition });

const meals = [
  { name: "Завтрак", detail: "Овсяная каша, яблоко", kcal: "410 ккал", icon: Coffee },
  { name: "Обед", detail: "Пока ничего не добавлено", kcal: "—", icon: Sun },
  { name: "Ужин", detail: "Пока ничего не добавлено", kcal: "—", icon: Moon },
  { name: "Перекус", detail: "Йогурт", kcal: "120 ккал", icon: Apple },
];
function Nutrition() { const [message, setMessage] = useState(""); return <AppShell title="Питание" eyebrow="Сегодня" action={<DemoBadge />}>
  <ScreenCard className="bg-secondary"><div className="flex items-end justify-between"><div><p className="text-sm text-muted-foreground">Дневной баланс</p><p className="mt-1 text-2xl font-bold">1 240 ккал</p></div><p className="text-sm font-semibold text-primary">62%</p></div><div className="mt-4"><ProgressBar value={62} /></div><p className="mt-2 text-xs text-muted-foreground">Пример заполнения дневника</p></ScreenCard>
  <div className="mt-6 grid gap-3">{meals.map((meal) => { const Icon = meal.icon; return <ScreenCard key={meal.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div className="min-w-0"><h2 className="font-bold">{meal.name}</h2><p className="truncate text-xs text-muted-foreground">{meal.detail}</p></div><div className="text-right"><p className="text-xs font-semibold">{meal.kcal}</p><button aria-label={`Добавить в ${meal.name.toLowerCase()}`} onClick={() => setMessage(`Добавление: ${meal.name}`)} className="mt-1 inline-grid size-7 place-items-center rounded-full bg-secondary text-primary"><Plus className="size-4" /></button></div></ScreenCard>; })}</div>
  <ActionButton onClick={() => setMessage("Открыт поиск продуктов")} className="mt-6 w-full"><Plus className="size-5" />Добавить продукт</ActionButton>
  {message && <p role="status" className="mt-3 text-center text-sm font-medium text-primary">{message}</p>}
  </AppShell>; }