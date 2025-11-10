'use client';

import { TrendingUp, Users, ShoppingCart, Zap } from "lucide-react";
import {GameCard, MetricCard, SimpleBarChart, SimpleLineChart, SimplePieChart} from "@/lib";

const recentTransactions = [
  { id: 1, user: "John Doe", card: "LeBron James", amount: "$150", status: "Completed" },
  { id: 2, user: "Jane Smith", card: "Michael Jordan", amount: "$200", status: "Completed" },
  { id: 3, user: "Bob Johnson", card: "Kobe Bryant", amount: "$120", status: "Pending" },
  { id: 4, user: "Alice Brown", card: "Stephen Curry", amount: "$180", status: "Completed" },
  { id: 5, user: "Charlie Wilson", card: "Tim Duncan", amount: "$95", status: "Failed" },
];

const formatCurrency = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  return numberValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const Home = () => {
  const revenueData = [
    { label: "January", value: 24000 },
    { label: "February", value: 31000 },
    { label: "March", value: 28000 },
    { label: "April", value: 35000 },
    { label: "May", value: 42000 },
    // { label: "June", value: 38000 },
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
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">Analytics Overview</h2>
        <p className="text-white/60">{"Track your platform's performance and activity"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard icon={Users} label="Total Users" value="12,485" change="8.2%" positive={true} />
        <MetricCard icon={ShoppingCart} label="Total Sales" value="$285,492" change="12.5%" positive={true} />
        <MetricCard icon={Zap} label="Active Sessions" value="3,248" change="3.1%" positive={true} />
        <MetricCard icon={TrendingUp} label="Growth Rate" value="23.5%" change="2.4%" positive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-6">
        <div className="flex flex-col h-full">
          <SimpleLineChart data={userActivityData} title="User Activity" />
        </div>
        <div className="flex flex-col h-full">
          <SimplePieChart data={cardRarityData} title="Card Distribution" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart data={revenueData} title="Revenue Trend" />

        <GameCard className="p-6 overflow-hidden">
          <h3 className="text-white text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/70">
                  <th className="text-left px-0 sm:px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-0 sm:px-4 py-3 font-semibold">Card</th>
                  <th className="text-left px-0 sm:px-4 py-3 font-semibold">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold hidden xl:block">Status</th>
                </tr>
              </thead>
              <tbody>
              {recentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-white/5 transition-all duration-200 hover:bg-[#CEFE10]/5 hover:shadow-[0_10px_20px_rgba(206,254,16,0.15)]"
                >
                  <td className="px-0 sm:px-4 py-3 text-white">{tx.user}</td>
                  <td className="px-0 sm:px-4 py-3 text-white/70">{tx.card}</td>
                  <td className="px-0 sm:px-4 py-3 text-white font-semibold">{formatCurrency(tx.amount)}</td>
                  <td className="px-4 py-3 hidden xl:block">
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
        </GameCard>
      </div>
    </div>
  );
}

export default Home;
