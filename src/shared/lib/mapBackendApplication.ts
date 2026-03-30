import { type BackendApplication } from '@shared/api/usersApi';
import {
  type EmployerApplicationRow,
  type EmployerDecisionStatus,
} from '@shared/types/employerApplication';
import { type ResponseStatus, type UserResponse } from '@shared/types/response';

/** Статусы заявки в БД -> вкладки и бейджи UI соискателя */
const statusToUi: Record<BackendApplication['status'], ResponseStatus> = {
  pending: 'pending',
  accepted: 'offer',
  rejected: 'rejected',
  reserved: 'review',
};

export const mapBackendApplicationToUserResponse = (app: BackendApplication): UserResponse => ({
  id: app.id,
  opportunityId: app.opportunity_id,
  status: statusToUi[app.status],
  appliedAt: app.applied_at,
  updatedAt: app.updated_at,
  note: app.cover_letter ?? undefined,
});

const statusToEmployer: Record<BackendApplication['status'], EmployerDecisionStatus> = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  reserved: 'reserve',
};

export const mapBackendApplicationToEmployerRow = (
  app: BackendApplication,
  opportunityTitle: string,
): EmployerApplicationRow => ({
  id: app.id,
  opportunityId: app.opportunity_id,
  opportunityTitle,
  applicantUserId: app.applicant_id,
  applicantDisplayName: `Соискатель ${app.applicant_id.slice(0, 8)}`,
  appliedAt: app.applied_at,
  employerStatus: statusToEmployer[app.status],
});
