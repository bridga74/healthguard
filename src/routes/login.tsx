import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/healthguard";
import { supabase } from "@/integrations/supabase/client";
import { homeFor, translateAuthError, validateEmail } from "@/lib/auth-messages";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Вход — HealthGuard" }, { name: "description", content: "Вход в аккаунт HealthGuard." },
    { property: "og:title", content: "Вход — HealthGuard" }, { property: "og:description", content: "Войдите, чтобы продолжить следить за привычками." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Login,
});

const inputCls = "h-13 rounded-xl border border-input bg-card px-4 font-normal outline-none focus:ring-2 focus:ring-ring";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Also handles return from the email confirmation link.
    supabase.auth.getUser().then(({ data }) => { if (data.user) homeFor(data.user).then((to) => navigate({ to, replace: true })); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) homeFor(session.user).then((to) => navigate({ to, replace: true }));
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validateEmail(email) ?? (password ? null : "Введите пароль");
    if (v) return setError(v);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setError(translateAuthError(error.message));
    navigate({ to: await homeFor(data.user), replace: true });
  }

  return <main className="mx-auto min-h-dvh w-full max-w-md bg-background px-5 py-7">
    <Link to="/" aria-label="Назад" className="grid size-10 place-items-center rounded-full bg-card text-foreground"><ArrowLeft className="size-5" /></Link>
    <div className="mt-10 flex items-center gap-2 text-primary"><ShieldCheck className="size-7" /><span className="font-bold">HealthGuard</span></div>
    <h1 className="mt-6 text-3xl font-bold">С возвращением</h1><p className="mt-2 text-muted-foreground">Войдите, чтобы продолжить.</p>
    <form noValidate className="mt-9 grid gap-5" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-semibold">Электронная почта<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.ru" autoComplete="email" className={inputCls} /></label>
      <label className="grid gap-2 text-sm font-semibold">Пароль<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ваш пароль" autoComplete="current-password" className={inputCls} /></label>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}
      <ActionButton type="submit" disabled={loading} className="mt-3 w-full">{loading ? "Входим…" : "Войти"}</ActionButton>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">Нет аккаунта? <Link to="/register" className="font-semibold text-primary">Зарегистрироваться</Link></p>
  </main>;
}
