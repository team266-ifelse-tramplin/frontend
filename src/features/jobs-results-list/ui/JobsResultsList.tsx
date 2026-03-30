import { OpportunityCard } from '@entities/Opportunity';
import { VISIBLE_JOBS_LIMIT } from '@shared/config/jobsMap';
import { type JobPoint } from '@features/jobs-map/model/types';

type JobsResultsListProps = {
  jobs: JobPoint[];
  selectedJobId: string | null;
  favoriteIds: string[];
  onSelectJob: (jobId: string) => void;
  onToggleFavorite: (jobId: string) => void;
};

export const JobsResultsList = ({
  jobs,
  selectedJobId,
  favoriteIds,
  onSelectJob,
  onToggleFavorite,
}: JobsResultsListProps) => {
  return (
    <section className="rounded-xl border border-border bg-background/60 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Вакансии ({jobs.length})</span>
      </div>
      <div className="space-y-3">
        {jobs.slice(0, VISIBLE_JOBS_LIMIT).map((job) => (
          <OpportunityCard
            key={job.id}
            opportunity={job}
            selected={selectedJobId === job.id}
            isFavorite={favoriteIds.includes(job.id)}
            detailsHref={`/opportunities/${job.id}`}
            onClick={() => onSelectJob(job.id)}
            onToggleFavorite={() => onToggleFavorite(job.id)}
          />
        ))}
      </div>
    </section>
  );
};
