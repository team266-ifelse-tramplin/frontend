import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '@shared/ui/Header';
import { readApplicantProfileDraft } from '@shared/lib/profileDraftStorage';

const lineClass = 'mt-1 text-sm text-text';

export const ApplicantEmployerViewPage = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  if (!userId) {
    return <Navigate to="/applicants" replace />;
  }
  const draft = readApplicantProfileDraft(userId);

  const displayName =
    draft.fullName.trim() || `Пользователь ${userId.slice(0, 8)}`;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-text">Профиль соискателя</h1>
            <Link
              to="/applicants"
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              К откликам
            </Link>
          </div>
          <p className="text-lg font-semibold text-text">{displayName}</p>
          <p className={lineClass}>Вуз: {draft.university || '—'}</p>
          <p className={lineClass}>Курс / год выпуска: {draft.courseOrGraduationYear || '—'}</p>
          <p className={lineClass}>Телефон: {draft.phone || '—'}</p>
          <div className="mt-4 border-t border-border pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary">Навыки</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-text">
              {draft.skills || 'Не указано'}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary">
              Опыт проектов
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-text">
              {draft.projectsExperience || 'Не указано'}
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-secondary">
              Репозитории
            </h2>
            <p className="mt-2 whitespace-pre-wrap font-mono text-sm text-text">
              {draft.repoLinks || '—'}
            </p>
          </div>
          <p className="mt-6 text-xs text-text-secondary">
            Данные читаются из локального черновика кандидата. После подключения API список полей может
            расшириться.
          </p>
        </section>
      </main>
    </>
  );
};
