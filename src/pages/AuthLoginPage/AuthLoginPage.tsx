import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService, CodeVerificationStep } from '@features/auth';
import { useAuth } from '@app/providers';
import { isBackendAuthEnabled } from '@shared/config/features';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';

type LoginStep = 'request' | 'verify';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getRedirectPath = (role: 'applicant' | 'company') => {
  return role === 'company' ? '/my-opportunities' : '/opportunities';
};

export const AuthLoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [step, setStep] = useState<LoginStep>('request');
  const [email, setEmail] = useState('');
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
    if (!emailRegex.test(normalizedEmail)) {
      setError('Укажи корректный email.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.send_email_code({ email: normalizedEmail, purpose: 'sign_in' });
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
      const session = await authService.sign_in({ email: normalizedEmail, code });
      setSession(session);
      navigate(returnTo ?? getRedirectPath(session.role), { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось подтвердить код.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[560px] px-5 py-10 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-text">Вход по email</h1>
          <p className="mt-1 text-sm text-text-secondary">Введи email, получи код и подтверди вход.</p>

          {step === 'request' ? (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                />
              </label>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex items-center justify-between gap-3">
                <Link to="/auth/register" className="text-sm font-semibold text-primary hover:text-primary-hover">
                  Нет аккаунта? Регистрация
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
                helperText={
                  demoCode
                    ? `Demo-код для мока: ${demoCode}`
                    : isBackendAuthEnabled()
                      ? 'Код из письма.'
                      : undefined
                }
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
