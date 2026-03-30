import { Clock3, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { RESPONSE_STATUS_META } from '@shared/config/responsesMock';
import { type Opportunity } from '@entities/Opportunity';
import { formatOpportunitySalary, getCompanyLabel } from '@shared/lib/opportunityDisplay';
import { type UserResponse } from '@shared/types/response';

type ResponseCardProps = {
  response: UserResponse;
  opportunity: Opportunity;
  onWithdraw: (responseId: string | number) => void;
  withdrawDisabled?: boolean;
};

export const ResponseCard = ({ response, opportunity, onWithdraw, withdrawDisabled }: ResponseCardProps) => {
  const statusMeta = RESPONSE_STATUS_META[response.status];

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/opportunities/${opportunity.id}`}
            className="line-clamp-2 text-lg font-bold tracking-tight text-text transition-colors hover:text-primary"
          >
            {opportunity.title}
          </Link>
          <p className="mt-1 text-base font-semibold text-primary">{formatOpportunitySalary(opportunity)}</p>
          <p className="mt-1 text-sm text-text-secondary">{getCompanyLabel(opportunity.company_id)}</p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          Отклик: {response.appliedAt}
        </span>
        <span>Обновлено: {response.updatedAt}</span>
        {response.note ? <span className="truncate">{response.note}</span> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="sec"
          size="sm"
          rounded="xl"
          onClick={() => onWithdraw(response.id)}
          disabled={withdrawDisabled || response.status === 'offer'}
        >
          Снять отклик
        </Button>
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
        >
          Открыть вакансию
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};
