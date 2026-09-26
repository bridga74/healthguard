import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/healthguard";
import { supabase } from "@/integrations/supabase/client";
import { homeFor, translateAuthError, validateEmail, validatePassword } from "@/lib/auth-messages";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Регистрация — HealthGuard" }, { name: "description", content: "Создание профиля HealthGuard." },
    { property: "og:title", content: "Регистрация — HealthGuard" }, { property: "og:description", content: "Создайте персональный профиль здоровых привычек." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: Register,
});

const inputCls = "h-13 rounded-xl border border-input bg-card px-4 font-normal outline-none focus:ring-2 focus:ring-ring";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: homeFor(data.user), replace: true }); });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Введите имя");
    const v = validateEmail(email) ?? validatePassword(password);
    if (v) return setError(v);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { name: name.trim() }, emailRedirectTo: `${window.location.origin}/login` },
    });
    setLoading(false);
    if (error) return setError(translateAuthError(error.message));
    if (data.user && data.user.identities?.length === 0) return setError("Пользователь с такой почтой уже зарегистрирован. Попробуйте войти");
    if (data.session) navigate({ to: "/onboarding", replace: true });
    else setSentTo(email.trim());
  }

  if (sentTo) return <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-background px-5 py-7 text-center">
    <div className="mx-auto grid size-20 place-items-center rounded-full bg-secondary text-primary"><MailCheck className="size-10" /></div>
    <h1 className="mt-6 text-2xl font-bold">Подтвердите почту</h1>
    <p className="mt-3 text-muted-foreground">Мы отправили письмо на <b className="text-foreground">{sentTo}</b>. Перейдите по ссылке в письме — после этого откроется анкета.</p>
    <Link to="/login" className="mt-8 flex min-h-12 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">Перейти ко входу</Link>
  </main>;

  return <main className="mx-auto min-h-dvh w-full max-w-md bg-background px-5 py-7">
    <Link to="/" aria-label="Назад" className="grid size-10 place-items-center rounded-full bg-card text-foreground"><ArrowLeft className="size-5" /></Link>
    <div className="mt-10 flex items-center gap-2 text-primary"><ShieldCheck className="size-7" /><span className="font-bold">HealthGuard</span></div>
    <h1 className="mt-6 text-3xl font-bold">Создайте профиль</h1><p className="mt-2 text-muted-foreground">Это займёт всего пару минут.</p>
    <form noValidate className="mt-9 grid gap-5" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-semibold">Имя<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" autoComplete="given-name" className={inputCls} /></label>
      <label className="grid gap-2 text-sm font-semibold">Электронная почта<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.ru" autoComplete="email" className={inputCls} /></label>
      <label className="grid gap-2 text-sm font-semibold">Пароль<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Не менее 8 символов, буквы и цифры" autoComplete="new-password" className={inputCls} /></label>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}
      <ActionButton type="submit" disabled={loading} className="mt-3 w-full">{loading ? "Создаём профиль…" : "Продолжить"}</ActionButton>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">Уже есть аккаунт? <Link to="/login" className="font-semibold text-primary">Войти</Link></p>
    <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности.</p>
  </main>;
}
