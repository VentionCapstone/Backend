import { countryAbbreviationsMapping } from 'src/common/mappings/countryAbbreviations.mapping';

export const normalizeCountryName = (input: string): string => {
  const normalizedCountry = countryAbbreviationsMapping[input.toUpperCase()] || input;
  return normalizedCountry;
};
