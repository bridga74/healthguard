import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, CircleHelp, LogOut, Settings, Target, UserRound } from "lucide-react";
import { AppShell, DemoBadge, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/profile")({ head: () => ({ meta: [
  { title: "Профиль — HealthGuard" }, { name: "description", content: "Параметры, цель и настройки профиля HealthGuard." }, { property: "og:title", content: "Профиль — HealthGuard" }, { property: "og:description", content: "Настройки персонального профиля." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: Profile });

function Profile() { return <AppShell title="Профиль" action={<DemoBadge />}>
  <ScreenCard className="flex items-center gap-4"><div className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary text-primary"><UserRound className="size-8" /></div><div className="min-w-0"><h2 className="truncate text-xl font-bold">Анна</h2><p className="text-sm text-muted-foreground">Демонстрационный профиль</p></div></ScreenCard>
  <h2 className="mb-3 mt-7 text-sm font-semibold text-muted-foreground">Параметры</h2><ScreenCard className="grid grid-cols-3 divide-x divide-border p-0 py-4">{[['Возраст','29 лет'],['Рост','168 см'],['Вес','64 кг']].map(([key,value]) => <div key={key} className="px-2 text-center"><p className="text-xs text-muted-foreground">{key}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</ScreenCard>
  <h2 className="mb-3 mt-7 text-sm font-semibold text-muted-foreground">Цель и настройки</h2><div className="overflow-hidden rounded-2xl bg-card health-shadow">
    <Menu icon={Target} label="Моя цель" value="Поддерживать форму" /><Menu icon={Bell} label="Напоминания" value="Включены" /><Menu icon={Settings} label="Настройки" /><Menu icon={CircleHelp} label="Помощь" />
  </div>
  <Link to="/" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground"><LogOut className="size-5" />Выйти из демо</Link>
  </AppShell>; }
function Menu({ icon: Icon, label, value }: { icon: typeof Target; label: string; value?: string }) { return <button className="grid min-h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border px-4 text-left last:border-0"><Icon className="size-5 text-primary" /><span className="font-medium">{label}</span>{value && <span className="truncate text-xs text-muted-foreground">{value}</span>}<ChevronRight className="size-4 text-muted-foreground" /></button>; }