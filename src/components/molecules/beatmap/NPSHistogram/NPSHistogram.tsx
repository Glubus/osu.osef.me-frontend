import React, { useRef, useEffect, useMemo } from 'react';
import type { NPSDataPoint } from '../../../../types/beatmap';

interface NPSHistogramProps {
  data: NPSDataPoint[];
  onBarClick?: (time: number) => void;
  currentTime?: number;
  totalTime?: number;
}

const NPSHistogram: React.FC<NPSHistogramProps> = ({ 
  data, 
  onBarClick, 
  currentTime = 0, 
  totalTime = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Memoize expensive calculations
  const { maxDensity, bars, barWidth } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxDensity: 1, bars: [], barWidth: 1 };
    }

    const maxDensity = Math.max(...data.map(d => d.density));
    
    // Limit the number of bars for performance
    const maxBars = 100; // Reduced for wider bars
    const step = Math.max(1, Math.floor(data.length / maxBars));
    const bars = data.filter((_, index) => index % step === 0);

    return { maxDensity, bars, barWidth: 1 };
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bars.length) {
      console.log('NPSHistogram: No canvas or no bars', { canvas: !!canvas, barsLength: bars.length });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('NPSHistogram: No 2D context');
      return;
    }

    // Only log every 30 frames (0.5 seconds) to reduce spam
    if (Math.floor(currentTime * 2) % 1 === 0) {
      console.log('NPSHistogram: Drawing', { bars: bars.length, maxDensity, currentTime, totalTime });
    }

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const barWidth = canvasWidth / bars.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw bars
    bars.forEach((item, index) => {
      const x = index * barWidth;
      const height = Math.max(2, (item.density / maxDensity) * (canvasHeight - 8)); // Minimum 2px height
      const y = canvasHeight - 4 - height; // 4px bottom padding

      // Determine color based on density
      let color = '#10b981'; // green
      if (item.density >= 35) color = '#000000'; // black
      else if (item.density >= 30) color = '#3b82f6'; // blue
      else if (item.density >= 20) color = '#ef4444'; // red
      else if (item.density >= 10) color = '#f59e0b'; // yellow

      // Determine opacity based on time
      const opacity = item.time <= currentTime ? 0.4 : 1.0;

      // Draw bar
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(x, y, barWidth, height); // No gap for better visibility

      // Store click area for interaction
      (item as any).clickArea = { x, y: 0, width: barWidth, height: canvasHeight };
    });

    // Debug info removed for performance

    ctx.globalAlpha = 1.0;

    // Draw current time indicator
    if (totalTime > 0) {
      const progress = currentTime / totalTime;
      const indicatorX = progress * canvasWidth;
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(indicatorX, 0);
      ctx.lineTo(indicatorX, canvasHeight);
      ctx.stroke();
    }

  }, [bars, maxDensity, Math.floor(currentTime), totalTime]); // Only redraw when currentTime changes by 1 second

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onBarClick || !bars.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const canvasWidth = canvas.width;
    const barWidth = canvasWidth / bars.length;
    const barIndex = Math.floor(x / barWidth);

    if (barIndex >= 0 && barIndex < bars.length) {
      onBarClick(bars[barIndex].time);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-20">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm text-base-content/60">Aucune donnée NPS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-20 bg-base-200/20 rounded-lg  my-2 relative" style={{ zIndex: 100 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer rounded"
        onClick={handleClick}
        style={{ 
          display: 'block',
          position: 'relative',
          zIndex: 101
        }}
      />
    </div>
  );
};

export default NPSHistogram;
