import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService, CodeVerificationStep } from '@features/auth';
import { useAuth } from '@app/providers';
import { isBackendAuthEnabled } from '@shared/config/features';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';
import { type AuthRole } from '@shared/types/auth';

type RegisterStep = 'request' | 'verify';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getRedirectPath = (role: AuthRole) => {
  return role === 'company' ? '/my-opportunities' : '/opportunities';
};

export const AuthRegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [step, setStep] = useState<RegisterStep>('request');
  const [login, setLogin] = useState('');
  const [role, setRole] = useState<AuthRole>('applicant');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryAfterSec, setRetryAfterSec] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  useEffect(() => {
    if (retryAfterSec <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRetryAfterSec((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [retryAfterSec]);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const requestCode = async () => {
    if (!login.trim()) {
      setError('Укажите логин');
      return;
    }
    if (!emailRegex.test(normalizedEmail)) {
      setError('Укажите корректный email');
      return;
    }
    if (isBackendAuthEnabled() && !phone.trim()) {
      setError('Укажите телефон');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = isBackendAuthEnabled()
        ? await authService.register_backend({
            email: normalizedEmail,
            phone,
            displayName: login.trim(),
            role,
          })
        : await authService.send_email_code({
            email: normalizedEmail,
            purpose: 'sign_up',
          });
      setRetryAfterSec(response.retryAfterSec);
      setDemoCode(response.demoCode);
      setStep('verify');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось отправить код.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const session = isBackendAuthEnabled()
        ? await authService.sign_in({ email: normalizedEmail, code, login })
        : await authService.sign_up({
            email: normalizedEmail,
            code,
            login,
            role,
          });
      setSession(session);
      navigate(returnTo ?? getRedirectPath(session.role), { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось подтвердить код.');
    } finally {
      setLoading(false);
    }
  };

  const verifyHelperText = demoCode
    ? `Demo-код для мока: ${demoCode}`
    : isBackendAuthEnabled()
      ? 'Введи код из письма.'
      : undefined;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[560px] px-5 py-10 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-text">Регистрация</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Укажи логин, роль и email. Затем подтверди код из письма.
          </p>

          {step === 'request' ? (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Логин</span>
                <input
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  placeholder="danila"
                  className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Роль</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as AuthRole)}
                  className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                >
                  <option value="applicant">Соискатель</option>
                  <option value="company">Работодатель</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                />
              </label>
              {isBackendAuthEnabled() ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Телефон</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+79001234567"
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
              ) : null}
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/auth/login"
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Уже есть аккаунт? Войти
                </Link>
                <Button type="button" onClick={requestCode} disabled={loading}>
                  {loading ? 'Отправляем...' : 'Получить код'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <CodeVerificationStep
                email={normalizedEmail}
                loading={loading}
                error={error}
                helperText={verifyHelperText}
                retryAfterSec={retryAfterSec}
                onBack={() => {
                  setStep('request');
                  setError(null);
                }}
                onResend={requestCode}
                onSubmitCode={verifyCode}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
};
