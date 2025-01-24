import { useState } from "react";
import countryData from "../data/ISO 3166-1 alpha-3";
import { useTheme } from "../contexts/ThemeContext";

interface CountryDrawerProps {
  onSelectCountry: (code: string) => void;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function CountryDrawer({
  onSelectCountry,
  isOpen,
  onToggle,
}: CountryDrawerProps) {
  const [search, setSearch] = useState("");
  const { theme } = useTheme();

  const filteredCountries = countryData.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div
        className="country-drawer"
        style={{
          position: "fixed",
          left: isOpen ? "0" : "-320px",
          top: 0,
          height: "100vh",
          width: "320px",
          backgroundColor: "var(--background-secondary)",
          borderRight: "1px solid var(--text-secondary)",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "1rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxShadow: theme === "light" ? "2px 0 10px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div style={{ position: "relative", padding: "0 1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              fontSize: "1.2rem",
              fontWeight: "500",
              color: "var(--text-primary)",
            }}
          >
            🌎 Countries
          </div>
          <input
            type="search"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid var(--text-secondary)",
              backgroundColor: "var(--background-primary)",
              color: "var(--text-primary)",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <button
            className="drawer-toggle"
            onClick={() => onToggle(!isOpen)}
            style={{
              position: "absolute",
              right: "-42px",
              top: "0",
              height: "42px",
              width: isOpen ? "42px" : "120px",
              padding: "0",
              borderRadius: "0 8px 8px 0",
              border: "none",
              outline: "none",
              backgroundColor: "var(--background-secondary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              boxShadow:
                theme === "light" ? "2px 0 10px rgba(0,0,0,0.1)" : "none",
              borderLeft: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "width 0.3s ease",
              overflow: "hidden", // Add this to prevent text overflow
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap", // Add this to keep text on one line
              }}
            >
              🌎{!isOpen && "Countries"}
            </span>
          </button>
        </div>
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0 1rem",
          }}
        >
          {filteredCountries.map(([name, _, code]) => (
            <button
              key={code}
              onClick={() => onSelectCountry(code)}
              style={{
                textAlign: "left",
                padding: "0.8rem",
                margin: "0 1px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                ":hover": {
                  backgroundColor: "var(--background-primary)",
                },
              }}
            >
              {name} ({code})
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
