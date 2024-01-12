import { locationNameVariationsMapping } from 'src/common/mappings/locationNameVariations.mapping';

export const normalizeLocationName = (input: string): string => {
  const normalizedCountry = locationNameVariationsMapping[input.toLowerCase()] || input;
  return normalizedCountry;
};
