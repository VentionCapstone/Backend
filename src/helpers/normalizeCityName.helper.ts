import { cityNameVariationsMapping } from 'src/common/mappings/cityNameVariations.mapping';

export const normalizeCityName = (input: string): string => {
  const normalizedLocation = cityNameVariationsMapping[input.toLowerCase()] || input;
  return normalizedLocation;
};
