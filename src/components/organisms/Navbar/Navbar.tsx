import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button/Button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Osef.me</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
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
              🎲 Random
            </Button>
            {!isHomePage && (
              <Button
                onClick={() => navigate("/")}
                color="secondary"
                style="outline"
                size="md"
              >
                ← Back to list
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
