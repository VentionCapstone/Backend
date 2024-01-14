import { countryNameVariationsMapping } from 'src/common/mappings/countryNameVariations.mapping';

export const normalizeCountryName = (input: string): string => {
  const normalizedLocation = countryNameVariationsMapping[input.toLowerCase()] || input;
  return normalizedLocation;
};
