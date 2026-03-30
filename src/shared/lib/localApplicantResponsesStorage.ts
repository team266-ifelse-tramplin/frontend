import { type UserResponse } from '@shared/types/response';

export const APPLICANT_LOCAL_RESPONSES_CHANGED_EVENT = 'applicant-local-responses:changed';

const storageKey = (userId: string) => `applicant:local-responses:${userId}`;

export const readLocalApplicantResponses = (userId: string): UserResponse[] => {
  const raw = window.localStorage.getItem(storageKey(userId));
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as UserResponse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Уже есть отклик на эту возможность — обновляем запись, иначе добавляем. */
export const upsertLocalApplicantResponse = (userId: string, row: UserResponse) => {
  const prev = readLocalApplicantResponses(userId);
  const rest = prev.filter((r) => r.opportunityId !== row.opportunityId);
  const next = [...rest, row];
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
  window.dispatchEvent(new Event(APPLICANT_LOCAL_RESPONSES_CHANGED_EVENT));
};
