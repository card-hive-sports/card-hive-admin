'use client'

import { ArrowLeft, Mail, Phone, Wallet, Calendar, CreditCard } from "lucide-react";
import {useParams, useRouter} from "next/navigation";

export default function UserDetail() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  // Mock data - in real app this would come from API
  const user = {
    id: parseInt(id || "1"),
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    wallet: "$1,250.00",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-12-19 14:32:00",
    cardsOwned: 42,
    totalSpent: "$3,450.00",
    accountVerified: true,
    location: "New York, USA",
  };

  const recentCards = [
    { id: 1, name: "LeBron James", rarity: "Grail", acquiredDate: "2024-12-18", value: "$450" },
    { id: 2, name: "Michael Jordan", rarity: "Chase", acquiredDate: "2024-12-16", value: "$320" },
    { id: 3, name: "Kobe Bryant", rarity: "Lineup", acquiredDate: "2024-12-14", value: "$180" },
  ];

  const loginActivity = [
    { date: "2024-12-19", time: "14:32:00", device: "Chrome - Windows", status: "Success" },
    { date: "2024-12-18", time: "10:15:22", device: "Safari - iPhone", status: "Success" },
    { date: "2024-12-17", time: "18:45:10", device: "Chrome - Windows", status: "Success" },
    { date: "2024-12-16", time: "09:22:34", device: "Firefox - Mac", status: "Success" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/users")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-white text-3xl font-bold">{user.name}</h2>
          <p className="text-white/60">User ID: #{user.id}</p>
        </div>
      </div>

      {/* User Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Info Card */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-white text-lg font-semibold mb-6">Account Information</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#CEFE10]" />
              <div>
                <p className="text-white/60 text-sm">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#CEFE10]" />
              <div>
                <p className="text-white/60 text-sm">Phone</p>
                <p className="text-white font-semibold">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#CEFE10]" />
              <div>
                <p className="text-white/60 text-sm">Joined</p>
                <p className="text-white font-semibold">{user.joinDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[#CEFE10]" />
              <div>
                <p className="text-white/60 text-sm">Location</p>
                <p className="text-white font-semibold">{user.location}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm">Account Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Email Verified</span>
                <span className="text-green-400 font-semibold">Yes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-white text-lg font-semibold mb-6">Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-white/60 text-sm mb-2">Total Cards</p>
              <p className="text-white text-3xl font-bold">{user.cardsOwned}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-white/60 text-sm mb-2">Total Spent</p>
              <p className="text-white text-2xl font-bold">{user.totalSpent}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-white/60 text-sm mb-2">Wallet Balance</p>
              <p className="text-white text-2xl font-bold">{user.wallet}</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-white/60 text-sm mb-2">Last Login</p>
              <p className="text-white/90 text-xs font-semibold">
                {user.lastLogin}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cards */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-white text-lg font-semibold mb-6">Recent Cards Acquired</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Card Name</th>
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Rarity</th>
              <th className="text-left px-4 py-3 text-white/70 font-semibold text-sm">Acquired</th>
              <th className="text-right px-4 py-3 text-white/70 font-semibold text-sm">Value</th>
            </tr>
            </thead>
            <tbody>
            {recentCards.map((card) => (
              <tr key={card.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#CEFE10]" />
                  {card.name}
                </td>
                <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          card.rarity === "Grail"
                            ? "bg-orange-500/20 text-orange-400"
                            : card.rarity === "Chase"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-lime-500/20 text-lime-400"
                        }`}
                      >
                        {card.rarity}
                      </span>
                </td>
                <td className="px-4 py-3 text-white/70 text-sm">{card.acquiredDate}</td>
                <td className="px-4 py-3 text-white font-semibold text-right">{card.value}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login Activity */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-white text-lg font-semibold mb-6">Login Activity</h3>

        <div className="space-y-3">
          {loginActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div>
                <p className="text-white font-semibold text-sm">{activity.device}</p>
                <p className="text-white/60 text-xs">
                  {activity.date} at {activity.time}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  {activity.status}
                </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
