import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{ position: "fixed", top: "1rem", right: "1rem" }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
