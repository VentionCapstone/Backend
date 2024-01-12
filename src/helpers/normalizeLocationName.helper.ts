import { locationNameVariationsMapping } from 'src/common/mappings/locationNameVariations.mapping';

export const normalizeLocationName = (input: string): string => {
  const normalizedLocation = locationNameVariationsMapping[input.toLowerCase()] || input;
  return normalizedLocation;
};
