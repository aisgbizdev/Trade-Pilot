import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProgressionEmblemProps {
  level: number;
  masteryLevel: number;
  className?: string;
}

interface BandStyle {
  name: string;
  color1: string;
  color2: string;
  stroke: string;
  shape: "circle" | "hexagon" | "octagon" | "star" | "diamond" | "cross" | "shield" | "wings" | "crest" | "crown" | "radiant";
}

const BANDS: BandStyle[] = [
  { name: "Seedling", color1: "#8fc286", color2: "#4a7a43", stroke: "#a6d69e", shape: "circle" },
  { name: "Observer", color1: "#7a8a99", color2: "#4a5a6a", stroke: "#9cb0c2", shape: "hexagon" },
  { name: "Planner", color1: "#8cabc4", color2: "#3b5c78", stroke: "#b4d3ec", shape: "octagon" },
  { name: "Guardian", color1: "#a68865", color2: "#5c4024", stroke: "#cfa97d", shape: "shield" },
  { name: "Navigator", color1: "#e0ad5c", color2: "#8a6121", stroke: "#fcd181", shape: "star" },
  { name: "Strategist", color1: "#b587d1", color2: "#5e3478", stroke: "#d8a3fa", shape: "cross" },
  { name: "Sentinel", color1: "#d66767", color2: "#7a2525", stroke: "#f28585", shape: "crest" },
  { name: "Vanguard", color1: "#3fa3b5", color2: "#195d6b", stroke: "#6bd2e6", shape: "wings" },
  { name: "Steward", color1: "#e0d9b4", color2: "#827a4d", stroke: "#fff8d6", shape: "diamond" },
  { name: "Apex", color1: "#1c2833", color2: "#000000", stroke: "#f5b800", shape: "crown" },
];

const MASTERY_BAND: BandStyle = {
  name: "Mastery", color1: "#f5b800", color2: "#ff3366", stroke: "#ffffff", shape: "radiant"
};

export function ProgressionEmblem({ level, masteryLevel, className }: ProgressionEmblemProps) {
  const isMastery = masteryLevel > 0 || level > 100;
  
  const bandIndex = isMastery ? -1 : Math.min(Math.max(Math.ceil(level / 10) - 1, 0), 9);
  const band = isMastery ? MASTERY_BAND : BANDS[bandIndex]!;
  
  // Intra-band progress 1-10
  const intraLevel = isMastery ? masteryLevel : ((level - 1) % 10) + 1;
  const complexity = Math.ceil(intraLevel / 3); // 1 to 4 scaling of details

  // Create an SVG based on the shape
  const renderShape = () => {
    const fillUrl = `url(#grad-${band.name})`;
    const s = band.stroke;
    const w = 2 + (complexity * 0.5); // Stroke width increases with intraLevel

    switch (band.shape) {
      case "circle":
        return <circle cx="50" cy="50" r="40" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "hexagon":
        return <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "octagon":
        return <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "star":
        return <polygon points="50,10 62,35 90,40 68,60 75,88 50,75 25,88 32,60 10,40 38,35" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "diamond":
        return <polygon points="50,10 90,50 50,90 10,50" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "cross":
        return <polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "shield":
        return <path d="M 15,20 L 50,10 L 85,20 L 85,50 C 85,75 50,90 50,90 C 50,90 15,75 15,50 Z" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "wings":
        return <path d="M 50,20 L 90,10 L 75,45 L 90,80 L 50,60 L 10,80 L 25,45 L 10,10 Z" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "crest":
        return <path d="M 50,10 L 90,30 L 70,90 L 30,90 L 10,30 Z" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "crown":
        return <path d="M 10,30 L 30,50 L 50,15 L 70,50 L 90,30 L 80,85 L 20,85 Z" fill={fillUrl} stroke={s} strokeWidth={w} />;
      case "radiant":
        return (
          <>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f5b800" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="50,5 60,35 95,50 60,65 50,95 40,65 5,50 40,35" fill={fillUrl} stroke={s} strokeWidth={3} />
            <circle cx="50" cy="50" r="20" fill="#000" stroke="#f5b800" strokeWidth="2" />
          </>
        );
      default:
        return <circle cx="50" cy="50" r="40" fill={fillUrl} stroke={s} strokeWidth={w} />;
    }
  };

  const renderDetails = () => {
    if (complexity < 2) return null;
    const s = band.stroke;
    return (
      <g stroke={s} strokeWidth="1" opacity="0.5">
        {complexity >= 2 && <circle cx="50" cy="50" r="30" fill="none" />}
        {complexity >= 3 && <circle cx="50" cy="50" r="20" fill="none" strokeDasharray="2 2" />}
        {complexity >= 4 && <path d="M 50,15 L 50,85 M 15,50 L 85,50" strokeDasharray="4 4" />}
      </g>
    );
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id={`grad-${band.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={band.color1} />
            <stop offset="100%" stopColor={band.color2} />
          </linearGradient>
        </defs>
        {renderShape()}
        {renderDetails()}
        
        <text 
          x="50" 
          y="58" 
          textAnchor="middle" 
          fill="#ffffff" 
          className="font-bold font-sans drop-shadow-md"
          style={{ fontSize: isMastery ? "24px" : "32px", textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}
        >
          {isMastery ? `M${masteryLevel}` : level}
        </text>
      </svg>
    </div>
  );
}
