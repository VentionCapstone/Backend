import { countryNameVariationsMapping } from 'src/common/mappings/countryNameVariations.mapping';

export const normalizeCountryName = (input: string): string | undefined => {
  if (!input) return;
  const normalizedLocation = countryNameVariationsMapping[input.toLowerCase()] || input;
  return normalizedLocation;
};
