import { useMemo, useState } from 'react';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined;
const YMAPS_QUERY = API_KEY
  ? ({ lang: 'ru_RU', apikey: API_KEY } as const)
  : ({ lang: 'ru_RU' } as const);

type JobPoint = {
  id: number;
  title: string;
  salary: string;
  coordinates: [number, number];
};

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [55.64643968296968, 37.04589485003568],
  [55.887394146569505, 38.147400739278915],
];

const TITLES = [
  'Frontend Developer',
  'React Engineer',
  'TypeScript Developer',
  'Middle Frontend',
  'Senior Frontend',
  'Frontend Team Lead',
  'UI Engineer',
  'Web Platform Engineer',
];

const SALARIES = [
  '150 000 ₽',
  '180 000 ₽',
  '210 000 ₽',
  '240 000 ₽',
  '270 000 ₽',
  '300 000 ₽',
  '350 000 ₽',
];

const toSalaryBadge = (salary: string) => salary.replace(' 000 ₽', 'k');

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const generateMockJobs = (count: number): JobPoint[] => {
  const minLat = MAP_BOUNDS[0][0];
  const maxLat = MAP_BOUNDS[1][0];
  const minLng = MAP_BOUNDS[0][1];
  const maxLng = MAP_BOUNDS[1][1];

  return Array.from({ length: count }, (_, index) => {
    const lat = minLat + pseudoRandom(index + 1) * (maxLat - minLat);
    const lng = minLng + pseudoRandom((index + 1) * 97) * (maxLng - minLng);

    return {
      id: index + 1,
      title: TITLES[index % TITLES.length],
      salary: SALARIES[index % SALARIES.length],
      coordinates: [Number(lat.toFixed(6)), Number(lng.toFixed(6))],
    };
  });
};

const MOCK_JOBS: JobPoint[] = generateMockJobs(120);

const MAP_STATE = {
  center: [55.751244, 37.618423] as [number, number],
  zoom: 10,
  controls: ['zoomControl', 'fullscreenControl'],
};

export const JobsMap = () => {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const selectedJob = useMemo(
    () => MOCK_JOBS.find((job) => job.id === selectedJobId) ?? null,
    [selectedJobId],
  );

  return (
    <section className="w-full rounded-2xl border border-border bg-surface p-3 shadow-sm md:p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-text">Карта вакансий (Яндекс)</h2>
        <span className="text-sm text-text-secondary">{MOCK_JOBS.length} точек</span>
      </div>

      {!API_KEY ? (
        <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Добавь ключ в `VITE_YANDEX_MAPS_API_KEY`, чтобы карта стабильно работала.
        </p>
      ) : null}

      <div className="h-[560px] w-full overflow-hidden rounded-xl border border-border">
        <YMaps query={YMAPS_QUERY}>
          <Map
            state={MAP_STATE}
            width="100%"
            height="100%"
            options={{ suppressMapOpenBlock: true }}
            modules={['control.ZoomControl', 'control.FullscreenControl']}
          >
            <Clusterer
              options={{
                preset: 'islands#blueClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: false,
              }}
              modules={['clusterer.addon.balloon', 'clusterer.addon.hint']}
            >
              {MOCK_JOBS.map((job) => (
                <Placemark
                  key={job.id}
                  geometry={job.coordinates}
                  onClick={() => setSelectedJobId((prevId) => (prevId === job.id ? null : job.id))}
                  properties={{
                    balloonContentHeader: job.title,
                    balloonContentBody: `<strong>${job.salary}</strong><br/>Москва`,
                    hintContent: `${job.title} - ${job.salary}`,
                    iconContent: toSalaryBadge(job.salary),
                  }}
                  options={{
                    preset: selectedJobId === job.id ? 'islands#redStretchyIcon' : 'islands#blueStretchyIcon',
                  }}
                />
              ))}
            </Clusterer>
          </Map>
        </YMaps>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-background/70 px-3 py-2 text-sm">
        {selectedJob ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-text">
              Выбрано: <strong>{selectedJob.title}</strong> — {selectedJob.salary}
            </span>
            <button
              type="button"
              onClick={() => setSelectedJobId(null)}
              className="rounded-lg border border-border px-2 py-1 text-text-secondary transition-colors hover:text-text"
            >
              Сбросить
            </button>
          </div>
        ) : (
          <span className="text-text-secondary">
            Нажми на плашку на карте или выбери вакансию ниже.
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MOCK_JOBS.slice(0, 16).map((job) => (
          <button
            key={`selector-${job.id}`}
            type="button"
            onClick={() => setSelectedJobId(job.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedJobId === job.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {job.title} · {toSalaryBadge(job.salary)}
          </button>
        ))}
      </div>
    </section>
  );
};
