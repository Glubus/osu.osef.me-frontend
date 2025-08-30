import type React from "react";
import { Palette } from "lucide-react";

export interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  themes: string[];
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  currentTheme, 
  onThemeChange, 
  themes 
}) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <Palette size={20} />
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto">
        {themes.map((theme) => (
          <li key={theme}>
            <button
              onClick={() => onThemeChange(theme)}
              className={`text-left capitalize ${
                currentTheme === theme ? "bg-primary text-primary-content" : ""
              }`}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
