import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, HeartPulse, Leaf, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "HealthGuard — ваш помощник по здоровым привычкам" },
    { name: "description", content: "Персональный помощник для питания, активности и полезных привычек." },
    { property: "og:title", content: "HealthGuard — здоровые привычки каждый день" },
    { property: "og:description", content: "Следите за питанием, водой и активностью в одном приложении." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Welcome,
});

function Welcome() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-background px-6 pb-8 pt-8">
      <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-7" /><span className="text-lg font-bold">HealthGuard</span></div>
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="relative mx-auto mb-10 grid size-52 place-items-center rounded-full bg-secondary">
          <div className="grid size-32 place-items-center rounded-full bg-card health-shadow"><HeartPulse className="size-16 text-primary" strokeWidth={1.5} /></div>
          <Leaf className="absolute right-5 top-6 size-8 text-primary" />
          <Activity className="absolute bottom-6 left-3 size-8 text-primary" />
        </div>
        <p className="mb-3 text-sm font-semibold text-primary">Здоровье начинается с малого</p>
        <h1 className="text-4xl font-extrabold leading-tight text-foreground">Ваш ритм.<br />Ваши привычки.<br />Ваш прогресс.</h1>
        <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">Спокойный и понятный помощник для ежедневной заботы о себе.</p>
      </div>
      <div className="grid gap-3">
        <Link to="/register" className="flex min-h-14 items-center justify-center rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground">Начать</Link>
        <Link to="/today" className="flex min-h-12 items-center justify-center text-sm font-semibold text-primary">Посмотреть демо</Link>
      </div>
    </main>
  );
}