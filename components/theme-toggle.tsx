"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "ozu-theme";

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    (callback) => {
      document.addEventListener("ozu-theme-change", callback);
      return () => document.removeEventListener("ozu-theme-change", callback);
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");
    document.dispatchEvent(new Event("ozu-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} />
      ) : (
        <Moon aria-hidden="true" size={18} />
      )}
    </button>
  );
}
