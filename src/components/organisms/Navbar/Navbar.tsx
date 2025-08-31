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

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-base-200 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-base-content">Osef.me</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/")}
              color="secondary"
              style="outline"
              size="md"
            >
              <Home size={16} className="mr-2" />
              List
            </Button>
            <Button
              onClick={() => navigate("/roadmap")}
              color="secondary"
              style="outline"
              size="md"
            >
              Roadmap
            </Button>
            <Button
              onClick={() => navigate("/random")}
              color="secondary"
              style="outline"
              size="md"
            >
              <Random size={16} className="mr-2" />
              Random
            </Button>
            <Button
              onClick={() => navigate("/stats")}
              color="secondary"
              style="outline"
              size="md"
            >
              <Stats size={16} className="mr-2" />
              Stats
            </Button>
            <Button
              onClick={() => navigate("/help")}
              color="secondary"
              style="outline"
              size="md"
            >
              <Help size={16} className="mr-2" />
              Help
            </Button>

            {/* Theme Manager */}
            <ThemeManager />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
