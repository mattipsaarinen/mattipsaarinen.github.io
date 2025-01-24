import { useEffect, useState, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  PopulationPyramidData,
  PopulationPyramidRow,
  fetchPopulationPyramidData,
} from "../data/fetchPopulationPyramidData";

interface PopulationData {
  year: number;
  age: number;
  male: number;
  female: number;
  total: number;
}

interface PopulationPyramidProps {
  countryCode: string | null;
  year: number;
}

export function PopulationPyramid({
  countryCode,
  year,
}: PopulationPyramidProps) {
  const [data, setData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    async function fetchData() {
      if (!countryCode) return;

      setLoading(true);
      setError(null);

      try {
        const pyramidData = await fetchPopulationPyramidData(countryCode);
        const processedData = pyramidData
          .filter((d) => d[0] === year)
          .map((d) => ({
            year: d[0],
            age: d[1],
            male: -d[2], // Negative for left side of pyramid
            female: d[3],
            total: d[4],
          }));

        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [countryCode, year]);

  // Add resize handler
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
        setHeight(containerRef.current.clientHeight);
      }
    }

    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!countryCode) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const maxValue = Math.max(
    ...data.map((d) => Math.max(Math.abs(d.male), d.female))
  );

  const padding = { top: 20, right: 60, bottom: 40, left: 60 };
  const barWidth = (height - padding.top - padding.bottom) / data.length;

  const xScale = (value: number) =>
    (Math.abs(value) / maxValue) * ((width - padding.left - padding.right) / 2);

  // Sort data by age in ascending order to ensure proper rendering
  const sortedData = [...data].sort((a, b) => a.age - b.age);

  return (
    <div
      ref={containerRef}
      style={{
        padding: "2rem",
        background: "blue",
        width: "100%",
        height: "100%",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          width: "100%",
        }}
      >
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${width} ${height}`}
          style={{
            backgroundColor: "rgba(255, 200, 200, 0.1)",
            borderRadius: "8px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Center line */}
          <line
            x1={width / 2}
            y1={padding.top}
            x2={width / 2}
            y2={height - padding.bottom}
            stroke="var(--text-secondary)"
            strokeWidth={1}
          />

          {/* Bars */}
          {sortedData.map((d, i) => {
            // Calculate y position from bottom instead of top
            const yPosition = height - padding.bottom - (i + 1) * barWidth;

            return (
              <g key={d.age}>
                {/* Male bar */}
                <rect
                  x={width / 2 - xScale(d.male)}
                  y={yPosition}
                  width={xScale(d.male)}
                  height={barWidth - 1}
                  fill="var(--accent-primary)"
                  opacity={0.7}
                />
                {/* Female bar */}
                <rect
                  x={width / 2}
                  y={yPosition}
                  width={xScale(d.female)}
                  height={barWidth - 1}
                  fill="var(--accent-secondary)"
                  opacity={0.7}
                />
                {/* Age labels */}
                <text
                  x={width / 2 - padding.left / 2}
                  y={yPosition + barWidth / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="var(--text-primary)"
                  fontSize="12"
                >
                  {d.age}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={width / 4}
            y={height - padding.bottom / 2}
            textAnchor="middle"
            fill="var(--text-primary)"
          >
            Male
          </text>
          <text
            x={(width * 3) / 4}
            y={height - padding.bottom / 2}
            textAnchor="middle"
            fill="var(--text-primary)"
          >
            Female
          </text>

          {/* Add axis titles */}
          <text
            x={width / 2}
            y={padding.top - 10}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="12"
          >
            Age
          </text>
        </svg>
      </div>
    </div>
  );
}
