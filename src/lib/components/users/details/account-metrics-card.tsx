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
  <div className="glass p-6 rounded-2xl">
    <h3 className="text-white text-lg font-semibold mb-6">Account Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ label, value, helper, accent }) => (
        <div key={label} className="bg-black/30 p-4 rounded-lg">
          <p className="text-white/60 text-sm mb-2">{label}</p>
          <p className={`text-white text-2xl font-bold ${accent ?? ""}`}>{value}</p>
          {helper && <p className="text-white/50 text-xs mt-1">{helper}</p>}
        </div>
      ))}
    </div>
  </div>
);
