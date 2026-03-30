import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapFormToCreatePayload, opportunitiesApi } from '../api';
import { useAuth } from '@app/providers';
import { resolveOpportunityActorIds } from '@shared/config/opportunities';
import { Button } from '@shared/ui/Button';

export type OpportunityCreateFormState = {
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
  contact_info: string;
  tags: string;
};

export const createEmptyOpportunityFormState = (): OpportunityCreateFormState => ({
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
  contact_info: '',
  tags: '',
});

type OpportunityCreateFormProps = {
  embedded?: boolean;
  onSuccess?: (createdId: string | null) => void;
};

export const OpportunityCreateForm = ({ embedded = false, onSuccess }: OpportunityCreateFormProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [form, setForm] = useState(createEmptyOpportunityFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const actorIds = resolveOpportunityActorIds(session);
      const payload = mapFormToCreatePayload({
        ...form,
        company_id: actorIds.companyId,
        created_by: actorIds.userId,
      });
      const response = await opportunitiesApi.createOne(payload);
      const createdId = typeof response.data.id === 'string' ? response.data.id : null;
      onSuccess?.(createdId);
      if (embedded) {
        setForm(createEmptyOpportunityFormState());
      } else {
        navigate(createdId ? `/opportunities/${createdId}` : '/my-opportunities');
      }
    } catch {
      setError('Не удалось создать вакансию. Проверь заполнение полей и доступность API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          required
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

      <div className="grid gap-3 md:grid-cols-2">
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
            className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm uppercase"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-text-secondary">Зарплата от</span>
          <input
            value={form.salary_from}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, salary_from: event.target.value.replace(/[^\d]/g, '') }))
            }
            className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-text-secondary">Зарплата до</span>
          <input
            value={form.salary_to}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, salary_to: event.target.value.replace(/[^\d]/g, '') }))
            }
            className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-text-secondary">Контакт</span>
        <input
          value={form.contact_info}
          onChange={(event) => setForm((prev) => ({ ...prev, contact_info: event.target.value }))}
          className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-text-secondary">Теги (через запятую)</span>
        <input
          value={form.tags}
          onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
          className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm"
        />
      </label>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className={`flex ${embedded ? 'justify-end' : 'justify-end gap-2'}`}>
        {embedded ? null : (
          <Button type="button" variant="sec" onClick={() => navigate(-1)}>
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Сохраняем...' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
