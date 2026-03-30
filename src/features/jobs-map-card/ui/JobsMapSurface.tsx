import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { MAP_STATE, YMAPS_QUERY } from '@shared/config/jobsMap';
import { toSalaryBadge } from '@shared/lib/jobsFilters';
import { type JobPoint } from '@features/jobs-map/model/types';

type JobsMapSurfaceProps = {
  jobs: JobPoint[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  className?: string;
  showSalaryOnMarkers?: boolean;
  useClusterer?: boolean;
};

export const JobsMapSurface = ({
  jobs,
  selectedJobId,
  onSelectJob,
  className = 'h-[340px] w-full overflow-hidden',
  showSalaryOnMarkers = true,
  useClusterer = true,
}: JobsMapSurfaceProps) => {
  const mapPoints = jobs.map((job) => (
    <Placemark
      key={job.id}
      geometry={[job.latitude, job.longitude]}
      onClick={() => onSelectJob(job.id)}
      properties={{
        hintContent: `${job.title} - ${job.salary_from}-${job.salary_to}`,
        ...(showSalaryOnMarkers
          ? { iconContent: toSalaryBadge(job.salary_from, job.salary_to, job.currency) }
          : {}),
      }}
      options={{
        preset: showSalaryOnMarkers
          ? selectedJobId === job.id
            ? 'islands#redStretchyIcon'
            : 'islands#blueStretchyIcon'
          : selectedJobId === job.id
            ? 'islands#redCircleDotIcon'
            : 'islands#blueCircleDotIcon',
      }}
    />
  ));

  return (
    <div className={className}>
      <YMaps query={YMAPS_QUERY}>
        <Map
          state={MAP_STATE}
          width="100%"
          height="100%"
          options={{ suppressMapOpenBlock: true }}
          modules={['control.ZoomControl', 'control.FullscreenControl']}
        >
          {useClusterer ? (
            <Clusterer
              options={{
                preset: 'islands#blueClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: false,
              }}
              modules={['clusterer.addon.balloon', 'clusterer.addon.hint']}
            >
              {mapPoints}
            </Clusterer>
          ) : (
            mapPoints
          )}
        </Map>
      </YMaps>
    </div>
  );
};
