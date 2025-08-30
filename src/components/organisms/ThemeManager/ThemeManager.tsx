import type React from "react";
import { useState, useEffect } from "react";
import ThemeSwitcher from "@/components/atoms/ThemeSwitcher/ThemeSwitcher";

const ThemeManager: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("dark");

  // Thèmes disponibles
  const themes = [
    "light",
    "dark", 
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter"
  ];

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Si aucun thème sauvegardé, appliquer le thème par défaut
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Changer de thème
  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeSwitcher
      currentTheme={currentTheme}
      onThemeChange={changeTheme}
      themes={themes}
    />
  );
};

export default ThemeManager;
