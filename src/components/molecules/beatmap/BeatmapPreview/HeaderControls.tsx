import React from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import Button from "../../../atom/Button/Button";

interface HeaderControlsProps {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleSettings: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const HeaderControls: React.FC<HeaderControlsProps> = ({
  currentTime,
  totalTime,
  isPlaying,
  onPlayPause,
  onReset,
  onToggleSettings,
}) => (
  <div className="p-3 border-b border-base-300">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <p className="text-sm text-base-content/60">{formatTime(currentTime)} / {formatTime(totalTime)}</p>
        <div className="flex gap-2">
          <Button onClick={onPlayPause} variant="primary" size="sm">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Button onClick={onToggleSettings} variant="outline" size="sm">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default HeaderControls;
