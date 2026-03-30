import { Building2, Clock3, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import {
  formatOpportunitySalary,
  getCompanyLabel,
  getEmploymentLabel,
  getLevelLabel,
  getOpportunityTagNames,
  getWorkFormatLabel,
} from '@shared/lib/opportunityDisplay';
import { type Opportunity } from '../types';

type OpportunityCardProps = {
  opportunity: Opportunity;
  selected?: boolean;
  isFavorite?: boolean;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  onRespond?: () => void;
  detailsHref?: string;
  showRespondButton?: boolean;
};

export const OpportunityCard = ({
  opportunity,
  selected = false,
  isFavorite = false,
  onClick,
  onToggleFavorite,
  onRespond,
  detailsHref,
  showRespondButton = true,
}: OpportunityCardProps) => {
  const companyLabel = getCompanyLabel(opportunity.company_id);
  const companyInitials = companyLabel
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

  return (
    
    <article
      onClick={onClick}
      className={`rounded-2xl border bg-surface p-4 shadow-sm transition-all duration-200 ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:-translate-y-0.5 hover:shadow-md'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {detailsHref ? (
            <Link
              to={detailsHref}
              onClick={(event) => event.stopPropagation()}
              className="line-clamp-2 text-lg font-bold tracking-tight text-text transition-colors hover:text-primary"
            >
              {opportunity.title}
            </Link>
          ) : (
            <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-text">{opportunity.title}</h3>
          )}
          <p className="mt-1 text-xl font-extrabold text-primary">{formatOpportunitySalary(opportunity)}</p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite?.();
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
            isFavorite
              ? 'border-favorite/40 bg-favorite/10 text-favorite'
              : 'border-border bg-background/70 text-text-secondary hover:text-favorite'
          }`}
          aria-label="Добавить в избранное"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} strokeWidth={2.2} />
        </button>
      </div>

      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <p className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {companyInitials || 'CO'}
          </span>
          <span className="truncate font-semibold text-text">{companyLabel}</span>
          <Building2 className="h-4 w-4 text-accent" strokeWidth={2.2} />
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" strokeWidth={2.2} />
          <span>
            {opportunity.location} · {getWorkFormatLabel(opportunity.work_format)}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-accent" strokeWidth={2.2} />
          <span>
            {getEmploymentLabel(opportunity.employment)} · {getLevelLabel(opportunity.level)}
          </span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {getOpportunityTagNames(opportunity).map((tag) => (
          <span
            key={`${opportunity.id}-${tag}`}
            className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{opportunity.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-text-secondary">{opportunity.publication_date}</span>
        {showRespondButton ? (
          <Button
            size="sm"
            rounded="xl"
            onClick={(event) => {
              event.stopPropagation();
              onRespond?.();
            }}
          >
            Откликнуться
          </Button>
        ) : null}
      </div>
    </article>
  );
};
