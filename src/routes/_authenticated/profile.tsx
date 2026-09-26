import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQuery } from "@/lib/profile";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ChevronRight, CircleHelp, LogOut, Settings, Target, UserRound } from "lucide-react";
import { AppShell, ScreenCard } from "@/components/healthguard";

export const Route = createFileRoute("/_authenticated/profile")({ head: () => ({ meta: [
  { title: "Профиль — HealthGuard" }, { name: "description", content: "Параметры, цель и настройки профиля HealthGuard." }, { property: "og:title", content: "Профиль — HealthGuard" }, { property: "og:description", content: "Настройки персонального профиля." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: Profile });

function Profile() {
  const navigate = useNavigate(); const queryClient = useQueryClient(); const { user } = Route.useRouteContext();
  const { data, isLoading, error } = useQuery(profileQuery(user.id));
  const p = data?.profile; const a = data?.answers;
  const name = p?.name || (user.user_metadata?.['name'] as string | undefined) || "Пользователь";
  const dash = isLoading ? "…" : "—";
  const params: [string, string][] = [["Возраст", p?.age ? `${p.age} лет` : dash], ["Рост", p?.height_cm ? `${p.height_cm} см` : dash], ["Вес", p?.weight_kg ? `${p.weight_kg} кг` : dash]];
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); navigate({ to: "/login", replace: true }); }
  return <AppShell title="Профиль">
  {error && <p role="alert" className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">Не удалось загрузить профиль. Обновите страницу.</p>}
  <ScreenCard className="flex items-center gap-4"><div className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary text-primary"><UserRound className="size-8" /></div><div className="min-w-0"><h2 className="truncate text-xl font-bold">{name}</h2><p className="truncate text-sm text-muted-foreground">{user.email}</p></div></ScreenCard>
  <h2 className="mb-3 mt-7 text-sm font-semibold text-muted-foreground">Параметры</h2><ScreenCard className="grid grid-cols-3 divide-x divide-border p-0 py-4">{params.map(([key,value]) => <div key={key} className="px-2 text-center"><p className="text-xs text-muted-foreground">{key}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</ScreenCard>
  <h2 className="mb-3 mt-7 text-sm font-semibold text-muted-foreground">Цель и настройки</h2><div className="overflow-hidden rounded-2xl bg-card health-shadow">
    <Menu icon={Target} label="Моя цель" value={p?.goal ?? dash} /><Menu icon={Target} label="Активность" value={p?.activity_level ?? dash} /><Menu icon={Target} label="Питание" value={a?.diet_preference ?? dash} /><Menu icon={Bell} label="Напоминания" /><Menu icon={Settings} label="Настройки" /><Menu icon={CircleHelp} label="Помощь" />
  </div>
  <button onClick={signOut} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground w-full"><LogOut className="size-5" />Выйти из аккаунта</button>
  </AppShell>; }
function Menu({ icon: Icon, label, value }: { icon: typeof Target; label: string; value?: string }) { return <button className="grid min-h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border px-4 text-left last:border-0"><Icon className="size-5 text-primary" /><span className="font-medium">{label}</span>{value && <span className="truncate text-xs text-muted-foreground">{value}</span>}<ChevronRight className="size-4 text-muted-foreground" /></button>; }