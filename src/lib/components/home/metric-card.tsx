import {ArrowDown, ArrowUp} from "lucide-react";
import {FC} from "react";
import {GameCard} from "@/lib/ui";

interface MetricCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export const MetricCard: FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  positive,
}) => {
  return (
    <GameCard className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CEFE10]/30 to-[#ff8a00]/40 flex items-center justify-center shadow-[0_10px_25px_rgba(206,254,16,0.25)]">
          <Icon className="w-6 h-6 text-[#CEFE10]" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            positive ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-white/70 text-sm font-medium">{label}</h3>
        <p className="text-white text-2xl font-bold mt-1 tracking-wide">{value}</p>
      </div>
    </GameCard>
  );
}
