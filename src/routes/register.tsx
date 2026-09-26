import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/healthguard";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Регистрация — HealthGuard" }, { name: "description", content: "Создание профиля HealthGuard." },
    { property: "og:title", content: "Регистрация — HealthGuard" }, { property: "og:description", content: "Создайте персональный профиль здоровых привычек." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Register,
});

function Register() {
  const navigate = useNavigate({ from: "/register" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return <main className="mx-auto min-h-dvh w-full max-w-md bg-background px-5 py-7">
    <Link to="/" aria-label="Назад" className="grid size-10 place-items-center rounded-full bg-card text-foreground"><ArrowLeft className="size-5" /></Link>
    <div className="mt-10 flex items-center gap-2 text-primary"><ShieldCheck className="size-7" /><span className="font-bold">HealthGuard</span></div>
    <h1 className="mt-6 text-3xl font-bold">Создайте профиль</h1><p className="mt-2 text-muted-foreground">Это займёт всего пару минут.</p>
    <form className="mt-9 grid gap-5" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/onboarding" }); }}>
      <label className="grid gap-2 text-sm font-semibold">Имя<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" className="h-13 rounded-xl border border-input bg-card px-4 font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
      <label className="grid gap-2 text-sm font-semibold">Электронная почта<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.ru" className="h-13 rounded-xl border border-input bg-card px-4 font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
      <label className="grid gap-2 text-sm font-semibold">Пароль<input required type="password" minLength={6} placeholder="Не менее 6 символов" className="h-13 rounded-xl border border-input bg-card px-4 font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
      <ActionButton type="submit" className="mt-3 w-full">Продолжить</ActionButton>
    </form>
    <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности.</p>
  </main>;
}