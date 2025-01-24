import { useState } from "react";
import "./App.css";
import { ThemeToggle } from "./components/ThemeToggle";
import { CountryDrawer } from "./components/CountryDrawer";
import { PopulationPyramid } from "./components/PopulationPyramid";
import { IndicatorPanel } from "./components/IndicatorPanel";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2023);

  // Calculate years from 1950 to 2100
  const years = Array.from({ length: 2100 - 1950 + 1 }, (_, i) => 2100 - i);

  return (
    <div className={!isDrawerOpen ? "drawer-closed" : ""}>
      <ThemeToggle />
      <CountryDrawer
        onSelectCountry={setSelectedCountry}
        isOpen={isDrawerOpen}
        onToggle={setIsDrawerOpen}
      />
      <main
        style={{
          height: "100vh",
          marginLeft: isDrawerOpen ? "320px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "2rem 2rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "white",
            }}
          >
            Population Pyramid Viewer
          </h1>
          {selectedCountry && (
            <div style={{ color: "white" }}>
              <label style={{ marginRight: "1rem" }}>Year: </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  backgroundColor: "var(--background-primary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--text-secondary)",
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {selectedCountry ? (
          <div style={{ display: "flex", padding: "1rem" }}>
            <IndicatorPanel countryCode={selectedCountry} year={selectedYear} />
            <PopulationPyramid
              countryCode={selectedCountry}
              year={selectedYear}
            />
          </div>
        ) : (
          <p style={{ padding: "2rem", color: "white" }}>
            Select a country from the drawer to view its population pyramid
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
