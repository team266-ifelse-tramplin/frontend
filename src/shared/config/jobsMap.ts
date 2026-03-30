export const API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined;

export const YMAPS_QUERY = API_KEY
  ? ({ lang: 'ru_RU', apikey: API_KEY } as const)
  : ({ lang: 'ru_RU' } as const);

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [55.64643968296968, 37.04589485003568],
  [55.887394146569505, 38.147400739278915],
];

export const MAP_STATE = {
  center: [55.751244, 37.618423] as [number, number],
  zoom: 10,
  controls: ['zoomControl', 'fullscreenControl'],
};

export const VISIBLE_JOBS_LIMIT = 70;
