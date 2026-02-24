// Historical population data (in millions) for major countries
export const HISTORICAL_DATA: Record<string, { year: number; population: number }[]> = {
  WORLD: [
    { year: 1950, population: 2536 },
    { year: 1960, population: 3032 },
    { year: 1970, population: 3700 },
    { year: 1980, population: 4453 },
    { year: 1990, population: 5321 },
    { year: 2000, population: 6149 },
    { year: 2010, population: 6957 },
    { year: 2020, population: 7795 },
    { year: 2024, population: 8100 },
  ],
  IN: [
    { year: 1950, population: 376 },
    { year: 1960, population: 450 },
    { year: 1970, population: 553 },
    { year: 1980, population: 696 },
    { year: 1990, population: 870 },
    { year: 2000, population: 1059 },
    { year: 2010, population: 1234 },
    { year: 2020, population: 1380 },
    { year: 2024, population: 1464 },
  ],
  CN: [
    { year: 1950, population: 554 },
    { year: 1960, population: 667 },
    { year: 1970, population: 818 },
    { year: 1980, population: 981 },
    { year: 1990, population: 1135 },
    { year: 2000, population: 1262 },
    { year: 2010, population: 1340 },
    { year: 2020, population: 1402 },
    { year: 2024, population: 1416 },
  ],
  US: [
    { year: 1950, population: 151 },
    { year: 1960, population: 179 },
    { year: 1970, population: 205 },
    { year: 1980, population: 227 },
    { year: 1990, population: 249 },
    { year: 2000, population: 282 },
    { year: 2010, population: 309 },
    { year: 2020, population: 331 },
    { year: 2024, population: 347 },
  ],
  ID: [
    { year: 1950, population: 70 },
    { year: 1960, population: 87 },
    { year: 1970, population: 114 },
    { year: 1980, population: 147 },
    { year: 1990, population: 181 },
    { year: 2000, population: 213 },
    { year: 2010, population: 241 },
    { year: 2020, population: 273 },
    { year: 2024, population: 286 },
  ],
  BR: [
    { year: 1950, population: 54 },
    { year: 1960, population: 72 },
    { year: 1970, population: 94 },
    { year: 1980, population: 121 },
    { year: 1990, population: 149 },
    { year: 2000, population: 175 },
    { year: 2010, population: 195 },
    { year: 2020, population: 213 },
    { year: 2024, population: 213 },
  ],
};

export const getHistoricalData = (code: string) => {
  return HISTORICAL_DATA[code] || HISTORICAL_DATA['WORLD'];
};

export default HISTORICAL_DATA;
