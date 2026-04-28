import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <span className="toggle-thumb" aria-hidden="true">
        {theme === "dark" ? "☼" : "☾"}
      </span>
    </button>
  );
};

export default ThemeToggle;
