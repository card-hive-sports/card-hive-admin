import {ArrowDown, ArrowUp} from "lucide-react";
import {FC} from "react";

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
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-[#CEFE10]/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#CEFE10]" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>
          {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-1">{label}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
