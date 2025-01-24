import { useEffect, useState } from "react";
import {
  fetchIndicatorData,
  DemographicDataPoint,
} from "../data/fetchIndicatorData";

interface IndicatorPanelProps {
  countryCode: string;
  year: number;
}

export function IndicatorPanel({ countryCode, year }: IndicatorPanelProps) {
  const [data, setData] = useState<DemographicDataPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchIndicatorData(countryCode);
        // Get the data for the selected year
        const yearData = result.data.find((d) => d.year === year);
        if (!yearData) {
          throw new Error(`No data available for year ${year}`);
        }
        setData(yearData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [countryCode, year]);

  if (loading) return <div className="indicator-panel">Loading...</div>;
  if (error) return <div className="indicator-panel">Error: {error}</div>;
  if (!data) return <div className="indicator-panel">No data available</div>;

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "N/A";
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(1);
  };

  const formatValue = (num: number | null | undefined, unit: string) => {
    if (num === null || num === undefined) return "N/A";
    return `${num.toFixed(1)}${unit}`;
  };

  return (
    <div className="indicator-panel">
      <h3>Demographics ({data.year || "N/A"})</h3>
      <div className="indicator-grid">
        <div className="indicator-item">
          <label>Total Population</label>
          <span>{formatNumber(data.totalPopulationJuly)}</span>
        </div>
        <div className="indicator-item">
          <label>Population Growth</label>
          <span>{formatValue(data.populationGrowthRate, "%")}</span>
        </div>
        <div className="indicator-item">
          <label>Median Age</label>
          <span>{formatValue(data.medianAge, " years")}</span>
        </div>
        <div className="indicator-item">
          <label>Mean Childbearing Age</label>
          <span>{formatValue(data.meanAgeChildbearing, " years")}</span>
        </div>
        <div className="indicator-item">
          <label>Life Expectancy</label>
          <span>{formatValue(data.lifeExpectancy, " years")}</span>
        </div>
        <div className="indicator-item">
          <label>Birth Rate</label>
          <span>{formatValue(data.crudeBirthRate, " per 1,000")}</span>
        </div>
        <div className="indicator-item">
          <label>Death Rate</label>
          <span>{formatValue(data.crudeDeathRate, " per 1,000")}</span>
        </div>
        <div className="indicator-item">
          <label>Fertility Rate</label>
          <span>{formatValue(data.totalFertilityRate, " children/woman")}</span>
        </div>
        <div className="indicator-item">
          <label>Sex Ratio</label>
          <span>
            {formatValue(data.populationSexRatio, " males/100 females")}
          </span>
        </div>
        <div className="indicator-item">
          <label>Population Density</label>
          <span>{formatValue(data.populationDensity, " per km²")}</span>
        </div>
        <div className="indicator-item">
          <label>Net Migration Rate</label>
          <span>{formatValue(data.netMigrationRate, " per 1,000")}</span>
        </div>
      </div>
    </div>
  );
}
