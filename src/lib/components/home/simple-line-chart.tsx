import {FC} from "react";
import {GameCard} from "@/lib/ui";

interface SimpleLineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
}

export const SimpleLineChart: FC<SimpleLineChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, value: item.value };
  });

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <GameCard className="p-6">
      <h3 className="text-white text-lg font-semibold mb-6 tracking-wide">{title}</h3>
      <div className="relative h-64 bg-gradient-to-b from-white/5 to-transparent rounded-2xl overflow-hidden border border-white/10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

          {/* Area under curve */}
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#CEFE10", stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: "#CEFE10", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={`${pathData} L 100 100 L 0 100 Z`} fill="url(#grad)" />

          {/* Line */}
          <path d={pathData} stroke="#CEFE10" strokeWidth="1.5" fill="none" />

          {/* Points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#CEFE10" />
          ))}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-white/60 text-xs mb-1">Highest</p>
          <p className="text-white font-bold">${maxValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-xs mb-1">Lowest</p>
          <p className="text-white font-bold">${minValue.toLocaleString()}</p>
        </div>
      </div>
    </GameCard>
  );
}
