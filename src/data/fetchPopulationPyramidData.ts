export type PopulationPyramidRow = [
  year: number,
  age: number,
  male: number,
  female: number,
  total: number
];

export type PopulationPyramidData = PopulationPyramidRow[];

export async function fetchPopulationPyramidData(
  countryCode: string
): Promise<PopulationPyramidData> {
  try {
    const response = await fetch(
      `/data/snapshots/population/${countryCode}.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch population data for ${countryCode}`);
    }
    const data: PopulationPyramidData = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching population data for ${countryCode}:`, error);
    throw error;
  }
}
