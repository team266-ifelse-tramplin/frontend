import { useState } from 'react';
import { AUTH_CODE_LENGTH } from '@shared/config/auth';
import { Button } from '@shared/ui/Button';

type CodeVerificationStepProps = {
  email: string;
  loading: boolean;
  error: string | null;
  helperText?: string;
  retryAfterSec: number;
  onBack: () => void;
  onResend: () => void;
  onSubmitCode: (code: string) => void;
};

export const CodeVerificationStep = ({
  email,
  loading,
  error,
  helperText,
  retryAfterSec,
  onBack,
  onResend,
  onSubmitCode,
}: CodeVerificationStepProps) => {
  const [code, setCode] = useState('');

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Код отправлен на <span className="font-semibold text-text">{email}</span>.
      </p>
      {helperText ? <p className="rounded-xl border border-border/80 bg-background/60 p-2 text-xs text-text-secondary">{helperText}</p> : null}
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-text-secondary">Код из письма</span>
        <input
          value={code}
          inputMode="numeric"
          maxLength={AUTH_CODE_LENGTH}
          onChange={(event) => setCode(event.target.value.replace(/[^\d]/g, ''))}
          placeholder="111111"
          className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm tracking-[0.3em]"
        />
      </label>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="sec" type="button" onClick={onBack} disabled={loading}>
          Назад
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="sec" onClick={onResend} disabled={loading || retryAfterSec > 0}>
            {retryAfterSec > 0 ? `Повтор через ${retryAfterSec}с` : 'Отправить код снова'}
          </Button>
          <Button type="button" onClick={() => onSubmitCode(code)} disabled={loading}>
            {loading ? 'Проверяем...' : 'Подтвердить'}
          </Button>
        </div>
      </div>
    </div>
  );
};
