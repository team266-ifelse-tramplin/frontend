import { type RefObject } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type JobPoint } from '@features/jobs-map/model/types';
import { JobsMapSurface } from './JobsMapSurface';

type JobsMapCardProps = {
  jobs: JobPoint[];
  selectedJobId: string | null;
  mapSectionRef: RefObject<HTMLDivElement | null>;
  onSelectJob: (jobId: string) => void;
};

export const JobsMapCard = ({
  jobs,
  selectedJobId,
  mapSectionRef,
  onSelectJob,
}: JobsMapCardProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border/70 bg-background/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-text">Карта вакансий</span>
        </div>
        <Link
          to="/map"
          className="btn sec sm r-lg inline-flex items-center gap-1"
        >
          Перейти к карте
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div ref={mapSectionRef}>
        <JobsMapSurface jobs={jobs} selectedJobId={selectedJobId} onSelectJob={onSelectJob} />
      </div>
    </div>
  );
};
