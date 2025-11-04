'use client';

import { TrendingUp, Users, ShoppingCart, Zap, ArrowUp, ArrowDown } from "lucide-react";

const recentTransactions = [
  { id: 1, user: "John Doe", card: "LeBron James", amount: "$150", status: "Completed" },
  { id: 2, user: "Jane Smith", card: "Michael Jordan", amount: "$200", status: "Completed" },
  { id: 3, user: "Bob Johnson", card: "Kobe Bryant", amount: "$120", status: "Pending" },
  { id: 4, user: "Alice Brown", card: "Stephen Curry", amount: "$180", status: "Completed" },
  { id: 5, user: "Charlie Wilson", card: "Tim Duncan", amount: "$95", status: "Failed" },
];

function MetricCard({
                      icon: Icon,
                      label,
                      value,
                      change,
                      positive,
                    }: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
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

function SimpleBarChart({ data, title }: { data: { label: string; value: number }[]; title: string }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-white text-lg font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">{item.label}</span>
              <span className="text-white font-semibold">${item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#CEFE10] to-[#FF5500] rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleLineChart({ data, title }: { data: { label: string; value: number }[]; title: string }) {
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
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-white text-lg font-semibold mb-6">{title}</h3>
      <div className="relative h-64 bg-black/20 rounded-lg overflow-hidden">
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
    </div>
  );
}

function SimplePieChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // ← use local variable instead of useState

  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const isLarge = sliceAngle > 180 ? 1 : 0;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${isLarge} 1 ${x2} ${y2} Z`;

    // eslint-disable-next-line react-hooks/immutability
    currentAngle = endAngle;

    return { path, color: item.color, percentage: ((item.value / total) * 100).toFixed(1) };
  });

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-white text-lg font-semibold mb-6">{title}</h3>
      <div className="flex gap-8 items-center">
        <svg className="w-32 h-32 flex-shrink-0" viewBox="0 0 100 100">
          {slices.map((slice, i) => (
            <path key={i} d={slice.path} fill={slice.color} />
          ))}
        </svg>
        <div className="space-y-3 flex-1">
          {data.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/70 text-sm">{item.label}</span>
                </div>
                <span className="text-white font-semibold text-sm">{slices[i].percentage}%</span>
              </div>
              <p className="text-white/50 text-xs">{item.value.toLocaleString()} items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const revenueData = [
    { label: "January", value: 24000 },
    { label: "February", value: 31000 },
    { label: "March", value: 28000 },
    { label: "April", value: 35000 },
    { label: "May", value: 42000 },
    { label: "June", value: 38000 },
  ];

  const userActivityData = [
    { label: "Jan 1", value: 400 },
    { label: "Jan 2", value: 520 },
    { label: "Jan 3", value: 490 },
    { label: "Jan 4", value: 680 },
    { label: "Jan 5", value: 720 },
    { label: "Jan 6", value: 850 },
    { label: "Jan 7", value: 920 },
  ];

  const cardRarityData = [
    { label: "Grail", value: 2400, color: "#FF5500" },
    { label: "Chase", value: 3800, color: "#FF00FF" },
    { label: "Lineup", value: 8200, color: "#CEFE10" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Analytics Overview</h2>
        <p className="text-white/60">{"Track your platform's performance and activity"}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard icon={Users} label="Total Users" value="12,485" change="8.2%" positive={true} />
        <MetricCard icon={ShoppingCart} label="Total Sales" value="$285,492" change="12.5%" positive={true} />
        <MetricCard icon={Zap} label="Active Sessions" value="3,248" change="3.1%" positive={true} />
        <MetricCard icon={TrendingUp} label="Growth Rate" value="23.5%" change="2.4%" positive={false} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleLineChart data={userActivityData} title="User Activity" />
        </div>
        <div>
          <SimplePieChart data={cardRarityData} title="Card Distribution" />
        </div>
      </div>

      {/* Revenue Chart */}
      <SimpleBarChart data={revenueData} title="Revenue Trend" />

      {/* Recent Transactions Table */}
      <div className="glass p-6 rounded-2xl overflow-hidden">
        <h3 className="text-white text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">User</th>
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Card</th>
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Amount</th>
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Status</th>
            </tr>
            </thead>
            <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                <td className="px-4 py-3 text-white text-sm">{tx.user}</td>
                <td className="px-4 py-3 text-white/70 text-sm">{tx.card}</td>
                <td className="px-4 py-3 text-white text-sm font-semibold">{tx.amount}</td>
                <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : tx.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
