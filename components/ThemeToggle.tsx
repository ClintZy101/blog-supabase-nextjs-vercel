"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      <Sun className={`h-6 w-6 text-gray-500 ${isDark ? "hidden" : "block"}`} />
      <Moon className={`h-6 w-6 text-gray-500 ${isDark ? "block" : "hidden"}`} />
    </button>
  );
}
