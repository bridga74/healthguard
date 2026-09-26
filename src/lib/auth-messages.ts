export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email: string) {
  if (!email.trim()) return "Введите электронную почту";
  if (!EMAIL_RE.test(email.trim())) return "Проверьте адрес почты — например, name@example.ru";
  return null;
}

export function validatePassword(password: string) {
  if (password.length < 8) return "Пароль должен содержать не менее 8 символов";
  if (!/[A-Za-zА-Яа-я]/.test(password) || !/\d/.test(password)) return "Пароль должен содержать буквы и цифры";
  return null;
}

export function translateAuthError(message?: string) {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Неверная почта или пароль";
  if (m.includes("email not confirmed")) return "Почта ещё не подтверждена. Откройте письмо и перейдите по ссылке";
  if (m.includes("already registered") || m.includes("already exists")) return "Пользователь с такой почтой уже зарегистрирован. Попробуйте войти";
  if (m.includes("rate limit") || m.includes("too many")) return "Слишком много попыток. Подождите немного и попробуйте снова";
  if (m.includes("weak") || m.includes("pwned") || m.includes("password")) return "Пароль слишком простой. Придумайте более надёжный";
  if (m.includes("invalid") && m.includes("email")) return "Некорректный адрес электронной почты";
  if (m.includes("fetch") || m.includes("network")) return "Нет соединения. Проверьте интернет и попробуйте снова";
  return "Что-то пошло не так. Попробуйте ещё раз";
}

export function homeFor(user: { user_metadata?: Record<string, unknown> } | null) {
  return user?.user_metadata?.onboarding_completed ? "/today" : "/onboarding";
}
