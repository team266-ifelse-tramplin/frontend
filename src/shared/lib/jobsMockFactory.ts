type MapBounds = [[number, number], [number, number]];

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const generateMockMapPoints = <T>(
  count: number,
  bounds: MapBounds,
  buildItem: (index: number) => T,
): Array<T & { coordinates: [number, number] }> => {
  const minLat = bounds[0][0];
  const maxLat = bounds[1][0];
  const minLng = bounds[0][1];
  const maxLng = bounds[1][1];

  return Array.from({ length: count }, (_, index) => {
    const lat = minLat + pseudoRandom(index + 1) * (maxLat - minLat);
    const lng = minLng + pseudoRandom((index + 1) * 97) * (maxLng - minLng);

    return {
      ...buildItem(index),
      coordinates: [Number(lat.toFixed(6)), Number(lng.toFixed(6))] as [number, number],
    };
  });
};
