import {FC} from "react";
import {GameCard} from "@/lib/ui";

interface SimpleBarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
}

export const SimpleBarChart: FC<SimpleBarChartProps> = ({ data, title }) =>  {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <GameCard className="p-6">
      <h3 className="text-white text-lg font-semibold mb-6 tracking-wide">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">{item.label}</span>
              <span className="text-white font-semibold">${item.value.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#CEFE10] via-[#FF8A00] to-[#FF00FF] rounded-full transition-all duration-500 shadow-[0_5px_15px_rgba(206,254,16,0.5)]"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GameCard>
  );
}
