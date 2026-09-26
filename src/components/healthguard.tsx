import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, ChartNoAxesColumnIncreasing, House, Salad, UserRound } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ActionButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition active:scale-[.98] disabled:opacity-50 ${className}`} {...props} />;
}

const nav = [
  { to: "/today", label: "Сегодня", icon: House },
  { to: "/nutrition", label: "Питание", icon: Salad },
  { to: "/activity", label: "Активность", icon: Activity },
  { to: "/progress", label: "Прогресс", icon: ChartNoAxesColumnIncreasing },
  { to: "/profile", label: "Профиль", icon: UserRound },
] as const;

export function AppShell({ title, eyebrow, children, action }: { title: string; eyebrow?: string; children: ReactNode; action?: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-background pb-28">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 pb-5 pt-7">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{eyebrow}</p>}
          <h1 className="truncate text-2xl font-bold text-foreground">{title}</h1>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="px-5">{children}</div>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto grid w-full max-w-md grid-cols-5 border-t border-border bg-card px-2 pt-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = path === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex min-w-0 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 1.8} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}

export function DemoBadge() {
  return <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase text-secondary-foreground">Демо</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function ScreenCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-card p-4 health-shadow ${className}`}>{children}</section>;
}