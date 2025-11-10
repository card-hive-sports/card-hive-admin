import {GameCard} from "@/lib/ui";

export interface AccountMetric {
  label: string;
  value: string;
  helper?: string;
  accent?: string;
}

interface AccountMetricsCardProps {
  stats: AccountMetric[];
}

export const AccountMetricsCard = ({ stats }: AccountMetricsCardProps) => (
  <GameCard className="p-6">
    <h3 className="text-white text-lg font-semibold mb-6">Account Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ label, value, helper, accent }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 shadow-inner"
        >
          <p className="text-white/60 text-xs uppercase tracking-wide mb-2">{label}</p>
          <p className={`text-white text-2xl font-bold ${accent ?? ""}`}>{value}</p>
          {helper && <p className="text-white/50 text-xs mt-1">{helper}</p>}
        </div>
      ))}
    </div>
  </GameCard>
);
