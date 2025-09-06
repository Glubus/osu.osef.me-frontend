import type React from "react";
import { useNavigate } from "react-router-dom";
import { icons} from "lucide-react";
import Button from "@/components/atoms/Button/Button";
import ThemeManager from "@/components/organisms/ThemeManager/ThemeManager";

const Home = icons.MapPin;
const Roadmap = icons.Map;
const Random = icons.Shuffle;
const Stats = icons.TrendingUp;
const Help = icons.CircleQuestionMark;

export interface NavbarTemplateProps {
  brandName?: string;
  navigationItems?: Array<{
    label: string;
    path: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  }>;
}

const Navbar: React.FC<NavbarTemplateProps> = ({
  brandName = "Osef.me",
  navigationItems = [
    { label: "List", path: "/", icon: Home },
    { label: "Roadmap", path: "/roadmap", icon: Roadmap },
    { label: "Random", path: "/random", icon: Random },
    { label: "Stats", path: "/stats", icon: Stats },
    { label: "Help", path: "/help", icon: Help },
  ]
}) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-base-200 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-base-content">{brandName}</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  color="secondary"
                  style="outline"
                  size="md"
                >
                  {IconComponent && <IconComponent size={16} className="mr-2" />}
                  {item.label}
                </Button>
              );
            })}

            {/* Theme Manager */}
            <ThemeManager />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
