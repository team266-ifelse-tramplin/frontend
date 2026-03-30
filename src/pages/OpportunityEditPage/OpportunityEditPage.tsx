import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  mapBackendOpportunityToUi,
  mapFormToEditPayload,
  opportunitiesApi,
} from '@entities/Opportunity';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';

type EditFormState = {
  title: string;
  description: string;
  opportunity_type: string;
  work_format: string;
  employment: string;
  level: string;
  location: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  status: string;
};

export const OpportunityEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>({
    title: '',
    description: '',
    opportunity_type: 'vacancy',
    work_format: 'office',
    employment: 'full',
    level: 'junior',
    location: '',
    salary_from: '',
    salary_to: '',
    currency: 'RUB',
    status: 'active',
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const response = await opportunitiesApi.getOne(id);
        if (!isActive) {
          return;
        }
        const normalized = mapBackendOpportunityToUi(response);
        setForm({
          title: normalized.title,
          description: normalized.description,
          opportunity_type: normalized.opportunity_type,
          work_format: normalized.work_format,
          employment: normalized.employment,
          level: normalized.level,
          location: normalized.location,
          salary_from: normalized.salary_from ? String(normalized.salary_from) : '',
          salary_to: normalized.salary_to ? String(normalized.salary_to) : '',
          currency: normalized.currency.toUpperCase(),
          status: normalized.status,
        });
      } catch {
        if (!isActive) {
          return;
        }
        setError('Не удалось загрузить вакансию для редактирования.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [id]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await opportunitiesApi.editOne(id, mapFormToEditPayload(form));
      navigate(`/opportunities/${id}`);
    } catch {
      setError('Не удалось сохранить изменения.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[980px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-text">Редактировать вакансию</h1>
            <Link to={`/opportunities/${id}`} className="text-sm font-semibold text-primary hover:text-primary-hover">
              К карточке
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-text-secondary">Загружаем данные...</p>
          ) : (
            <form className="space-y-3" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Название</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                  className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-secondary">Описание</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  rows={5}
                  className="w-full rounded-xl border border-border/80 bg-background/70 px-3 py-2 text-sm"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Тип</span>
                  <select
                    value={form.opportunity_type}
                    onChange={(event) => setForm((prev) => ({ ...prev, opportunity_type: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  >
                    <option value="vacancy">vacancy</option>
                    <option value="internship">internship</option>
                    <option value="mentoring">mentoring</option>
                    <option value="event">event</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Формат</span>
                  <select
                    value={form.work_format}
                    onChange={(event) => setForm((prev) => ({ ...prev, work_format: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  >
                    <option value="office">office</option>
                    <option value="hybrid">hybrid</option>
                    <option value="remote">remote</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Занятость</span>
                  <select
                    value={form.employment}
                    onChange={(event) => setForm((prev) => ({ ...prev, employment: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  >
                    <option value="full">full</option>
                    <option value="part">part (API to partial)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Уровень</span>
                  <select
                    value={form.level}
                    onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  >
                    <option value="intern">intern</option>
                    <option value="junior">junior</option>
                    <option value="middle">middle</option>
                    <option value="senior">senior</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Статус</span>
                  <input
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="block md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Локация</span>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Валюта</span>
                  <input
                    value={form.currency}
                    onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Зарплата от</span>
                  <input
                    value={form.salary_from}
                    onChange={(event) => setForm((prev) => ({ ...prev, salary_from: event.target.value.replace(/[^\d]/g, '') }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-text-secondary">Зарплата до</span>
                  <input
                    value={form.salary_to}
                    onChange={(event) => setForm((prev) => ({ ...prev, salary_to: event.target.value.replace(/[^\d]/g, '') }))}
                    className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
                  />
                </label>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="sec" onClick={() => navigate(-1)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Сохраняем...' : 'Сохранить'}
                </Button>
              </div>
            </form>
          )}
        </section>
      </main>
    </>
  );
};
