"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TimeTheme = "morning" | "afternoon" | "sunset" | "night";

function getTimeTheme(hour?: number): TimeTheme {
  const h = hour ?? new Date().getHours();
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "sunset";
  return "night";
}

const TimeThemeContext = createContext<TimeTheme>("afternoon");

export function useTimeTheme() {
  return useContext(TimeThemeContext);
}

export function TimeThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<TimeTheme>("afternoon");

  useEffect(() => {
    // Set initial theme
    setTheme(getTimeTheme());

    // Update every minute
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // Apply data attribute to html element for CSS
  useEffect(() => {
    document.documentElement.setAttribute("data-time-theme", theme);
  }, [theme]);

  return (
    <TimeThemeContext.Provider value={theme}>
      {children}
    </TimeThemeContext.Provider>
  );
}
