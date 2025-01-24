// Define enum or constants for indicator indices
export const IndicatorIndex = {
  ISO3_CODE: 0,
  SDMX_CODE: 1,
  LOC_TYPE_ID: 2,
  LOC_TYPE_NAME: 3,
  PARENT_ID: 4,
  LOCATION: 5,
  VARIANT_ID: 6,
  VARIANT: 7,
  YEAR: 8,
  TOTAL_POPULATION_JAN: 9,
  TOTAL_POPULATION_JULY: 10,
  MALE_POPULATION_JULY: 11,
  FEMALE_POPULATION_JULY: 12,
  POPULATION_DENSITY: 13,
  POPULATION_SEX_RATIO: 14,
  MEDIAN_AGE: 15,
  NATURAL_CHANGE: 16,
  NATURAL_CHANGE_RATE: 17,
  POPULATION_CHANGE: 18,
  POPULATION_GROWTH_RATE: 19,
  DOUBLING_TIME: 20,
  BIRTHS: 21,
  BIRTHS_15_19: 22,
  CRUDE_BIRTH_RATE: 23,
  TOTAL_FERTILITY_RATE: 24,
  NET_REPRODUCTION_RATE: 25,
  MEAN_AGE_CHILDBEARING: 26,
  SEX_RATIO_AT_BIRTH: 27,
  DEATHS: 28,
  DEATHS_MALE: 29,
  DEATHS_FEMALE: 30,
  CRUDE_DEATH_RATE: 31,
  LIFE_EXPECTANCY: 32,
  LIFE_EXPECTANCY_MALE: 33,
  LIFE_EXPECTANCY_FEMALE: 34,
  LIFE_EXPECTANCY_15: 35,
  LIFE_EXPECTANCY_15_MALE: 36,
  LIFE_EXPECTANCY_15_FEMALE: 37,
  LIFE_EXPECTANCY_65: 38,
  LIFE_EXPECTANCY_65_MALE: 39,
  LIFE_EXPECTANCY_65_FEMALE: 40,
  LIFE_EXPECTANCY_80: 41,
  LIFE_EXPECTANCY_80_MALE: 42,
  LIFE_EXPECTANCY_80_FEMALE: 43,
  INFANT_DEATHS: 44,
  INFANT_MORTALITY_RATE: 45,
  LIVE_BIRTHS_SURVIVING_AGE_1: 46,
  UNDER_5_DEATHS: 47,
  UNDER_5_MORTALITY_RATE: 48,
  MORTALITY_UNDER_40: 49,
  MORTALITY_UNDER_40_MALE: 50,
  MORTALITY_UNDER_40_FEMALE: 51,
  MORTALITY_UNDER_60: 52,
  MORTALITY_UNDER_60_MALE: 53,
  MORTALITY_UNDER_60_FEMALE: 54,
  MORTALITY_15_50: 55,
  MORTALITY_15_50_MALE: 56,
  MORTALITY_15_50_FEMALE: 57,
  MORTALITY_15_60: 58,
  MORTALITY_15_60_MALE: 59,
  MORTALITY_15_60_FEMALE: 60,
  NET_MIGRATIONS: 61,
  NET_MIGRATION_RATE: 62,
} as const;

export interface DemographicDataPoint {
  year: number;
  totalPopulationJan: number;
  totalPopulationJuly: number;
  malePopulationJuly: number;
  femalePopulationJuly: number;
  populationDensity: number;
  populationSexRatio: number;
  medianAge: number;
  naturalChange: number;
  naturalChangeRate: number;
  populationChange: number;
  populationGrowthRate: number;
  doublingTime: number;
  births: number;
  births1519: number;
  crudeBirthRate: number;
  totalFertilityRate: number;
  netReproductionRate: number;
  meanAgeChildbearing: number;
  sexRatioAtBirth: number;
  deaths: number;
  deathsMale: number;
  deathsFemale: number;
  crudeDeathRate: number;
  lifeExpectancy: number;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  lifeExpectancy15: number;
  lifeExpectancy15Male: number;
  lifeExpectancy15Female: number;
  lifeExpectancy65: number;
  lifeExpectancy65Male: number;
  lifeExpectancy65Female: number;
  lifeExpectancy80: number;
  lifeExpectancy80Male: number;
  lifeExpectancy80Female: number;
  infantDeaths: number;
  infantMortalityRate: number;
  liveBirthsSurvivingAge1: number;
  under5Deaths: number;
  under5MortalityRate: number;
  mortalityUnder40: number;
  mortalityUnder40Male: number;
  mortalityUnder40Female: number;
  mortalityUnder60: number;
  mortalityUnder60Male: number;
  mortalityUnder60Female: number;
  mortality1550: number;
  mortality1550Male: number;
  mortality1550Female: number;
  mortality1560: number;
  mortality1560Male: number;
  mortality1560Female: number;
  netMigrations: number;
  netMigrationRate: number;
}

export interface CountryDemographicData {
  countryCode: string;
  data: DemographicDataPoint[];
}

export async function fetchIndicatorData(
  countryCode: string
): Promise<CountryDemographicData> {
  try {
    const response = await fetch(
      `/data/snapshots/indicators/${countryCode}.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch demographic data for ${countryCode}`);
    }

    const rawData: number[][] = await response.json();

    // Transform the raw array data into structured format
    const transformedData: DemographicDataPoint[] = rawData
      .map((record) => {
        // First, check if the record exists and has the expected length
        if (!record || record.length < Object.keys(IndicatorIndex).length) {
          console.warn("Invalid record format:", record);
          return null;
        }

        return {
          year: Number(record[IndicatorIndex.YEAR]) || 0,
          totalPopulationJan:
            Number(record[IndicatorIndex.TOTAL_POPULATION_JAN]) || 0,
          totalPopulationJuly:
            Number(record[IndicatorIndex.TOTAL_POPULATION_JULY]) || 0,
          malePopulationJuly:
            Number(record[IndicatorIndex.MALE_POPULATION_JULY]) || 0,
          femalePopulationJuly:
            Number(record[IndicatorIndex.FEMALE_POPULATION_JULY]) || 0,
          populationDensity:
            Number(record[IndicatorIndex.POPULATION_DENSITY]) || 0,
          populationSexRatio:
            Number(record[IndicatorIndex.POPULATION_SEX_RATIO]) || 0,
          medianAge: Number(record[IndicatorIndex.MEDIAN_AGE]) || 0,
          naturalChange: Number(record[IndicatorIndex.NATURAL_CHANGE]) || 0,
          naturalChangeRate:
            Number(record[IndicatorIndex.NATURAL_CHANGE_RATE]) || 0,
          populationChange:
            Number(record[IndicatorIndex.POPULATION_CHANGE]) || 0,
          populationGrowthRate:
            Number(record[IndicatorIndex.POPULATION_GROWTH_RATE]) || 0,
          doublingTime: Number(record[IndicatorIndex.DOUBLING_TIME]) || 0,
          births: Number(record[IndicatorIndex.BIRTHS]) || 0,
          births1519: Number(record[IndicatorIndex.BIRTHS_15_19]) || 0,
          crudeBirthRate: Number(record[IndicatorIndex.CRUDE_BIRTH_RATE]) || 0,
          totalFertilityRate:
            Number(record[IndicatorIndex.TOTAL_FERTILITY_RATE]) || 0,
          netReproductionRate:
            Number(record[IndicatorIndex.NET_REPRODUCTION_RATE]) || 0,
          meanAgeChildbearing:
            Number(record[IndicatorIndex.MEAN_AGE_CHILDBEARING]) || 0,
          sexRatioAtBirth:
            Number(record[IndicatorIndex.SEX_RATIO_AT_BIRTH]) || 0,
          deaths: Number(record[IndicatorIndex.DEATHS]) || 0,
          deathsMale: Number(record[IndicatorIndex.DEATHS_MALE]) || 0,
          deathsFemale: Number(record[IndicatorIndex.DEATHS_FEMALE]) || 0,
          crudeDeathRate: Number(record[IndicatorIndex.CRUDE_DEATH_RATE]) || 0,
          lifeExpectancy: Number(record[IndicatorIndex.LIFE_EXPECTANCY]) || 0,
          lifeExpectancyMale:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_MALE]) || 0,
          lifeExpectancyFemale:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_FEMALE]) || 0,
          lifeExpectancy15:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_15]) || 0,
          lifeExpectancy15Male:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_15_MALE]) || 0,
          lifeExpectancy15Female:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_15_FEMALE]) || 0,
          lifeExpectancy65:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_65]) || 0,
          lifeExpectancy65Male:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_65_MALE]) || 0,
          lifeExpectancy65Female:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_65_FEMALE]) || 0,
          lifeExpectancy80:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_80]) || 0,
          lifeExpectancy80Male:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_80_MALE]) || 0,
          lifeExpectancy80Female:
            Number(record[IndicatorIndex.LIFE_EXPECTANCY_80_FEMALE]) || 0,
          infantDeaths: Number(record[IndicatorIndex.INFANT_DEATHS]) || 0,
          infantMortalityRate:
            Number(record[IndicatorIndex.INFANT_MORTALITY_RATE]) || 0,
          liveBirthsSurvivingAge1:
            Number(record[IndicatorIndex.LIVE_BIRTHS_SURVIVING_AGE_1]) || 0,
          under5Deaths: Number(record[IndicatorIndex.UNDER_5_DEATHS]) || 0,
          under5MortalityRate:
            Number(record[IndicatorIndex.UNDER_5_MORTALITY_RATE]) || 0,
          mortalityUnder40:
            Number(record[IndicatorIndex.MORTALITY_UNDER_40]) || 0,
          mortalityUnder40Male:
            Number(record[IndicatorIndex.MORTALITY_UNDER_40_MALE]) || 0,
          mortalityUnder40Female:
            Number(record[IndicatorIndex.MORTALITY_UNDER_40_FEMALE]) || 0,
          mortalityUnder60:
            Number(record[IndicatorIndex.MORTALITY_UNDER_60]) || 0,
          mortalityUnder60Male:
            Number(record[IndicatorIndex.MORTALITY_UNDER_60_MALE]) || 0,
          mortalityUnder60Female:
            Number(record[IndicatorIndex.MORTALITY_UNDER_60_FEMALE]) || 0,
          mortality1550: Number(record[IndicatorIndex.MORTALITY_15_50]) || 0,
          mortality1550Male:
            Number(record[IndicatorIndex.MORTALITY_15_50_MALE]) || 0,
          mortality1550Female:
            Number(record[IndicatorIndex.MORTALITY_15_50_FEMALE]) || 0,
          mortality1560: Number(record[IndicatorIndex.MORTALITY_15_60]) || 0,
          mortality1560Male:
            Number(record[IndicatorIndex.MORTALITY_15_60_MALE]) || 0,
          mortality1560Female:
            Number(record[IndicatorIndex.MORTALITY_15_60_FEMALE]) || 0,
          netMigrations: Number(record[IndicatorIndex.NET_MIGRATIONS]) || 0,
          netMigrationRate:
            Number(record[IndicatorIndex.NET_MIGRATION_RATE]) || 0,
        };
      })
      .filter(Boolean) as DemographicDataPoint[]; // Remove any null values

    return {
      countryCode,
      data: transformedData,
    };
  } catch (error) {
    console.error(`Error fetching demographic data for ${countryCode}:`, error);
    throw error;
  }
}
