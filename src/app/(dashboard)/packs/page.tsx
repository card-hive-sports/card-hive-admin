'use client'

import { useState, useMemo } from "react";
import Link from "next/link";
import { PackModal } from "@/lib";
import { Search, Plus, Filter, ArrowUpDown, Edit2, Trash2, Eye, Star } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  theme: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legend" | "Grail" | "Lineup" | "Chase";
  cardCount: number;
  status: "draft" | "published";
  createdAt: string;
  releaseDate: string;
  tags: string[];
}

const INITIAL_PACKS: Pack[] = [
  {
    id: "1",
    name: "Golden Era Basketball",
    theme: "Basketball",
    rarity: "Legend",
    cardCount: 50,
    status: "published",
    createdAt: "2024-01-15",
    releaseDate: "2024-02-01",
    tags: ["basketball", "vintage", "iconic"],
  },
  {
    id: "2",
    name: "Modern Athletes",
    theme: "Contemporary Sports",
    rarity: "Rare",
    cardCount: 75,
    status: "published",
    createdAt: "2024-01-10",
    releaseDate: "2024-02-15",
    tags: ["modern", "sports", "trending"],
  },
  {
    id: "3",
    name: "Rookie Edition",
    theme: "New Players",
    rarity: "Uncommon",
    cardCount: 100,
    status: "draft",
    createdAt: "2024-01-20",
    releaseDate: "2024-03-01",
    tags: ["rookies", "upcoming", "draft"],
  },
  {
    id: "4",
    name: "Championship Moments",
    theme: "Historic Wins",
    rarity: "Epic",
    cardCount: 40,
    status: "published",
    createdAt: "2024-01-05",
    releaseDate: "2024-01-25",
    tags: ["championship", "historic", "memorable"],
  },
];

export default function Packs() {
  const [packs, setPacks] = useState<Pack[]>(INITIAL_PACKS);
  const [search, setSearch] = useState("");
  const [showPackModal, setShowPackModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Pack | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "cardCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({ rarity: "", status: "" });

  const filteredAndSortedPacks = useMemo(() => {
    let result = packs;

    if (search) {
      result = result.filter((pack) =>
        pack.name.toLowerCase().includes(search.toLowerCase()) ||
        pack.theme.toLowerCase().includes(search.toLowerCase()) ||
        pack.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((pack) => (pack as any)[key] === value);
      }
    });

    result.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [packs, search, activeFilters, sortBy, sortOrder]);

  const handleCreatePack = (formData: any) => {
    const newPack: Pack = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
      cardCount: 0,
    };
    setPacks([...packs, newPack]);
    setShowPackModal(false);
  };

  const handleEditPack = (formData: any) => {
    if (!editingPack) return;
    setPacks(packs.map((p) => (p.id === editingPack.id ? { ...p, ...formData } : p)));
    setEditingPack(null);
    setShowPackModal(false);
  };

  const handleDeletePack = (pack: Pack) => {
    setPacks(packs.filter((p) => p.id !== pack.id));
    setShowDeleteModal(null);
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "bg-gray-500/20 text-gray-400",
      uncommon: "bg-green-500/20 text-green-400",
      rare: "bg-blue-500/20 text-blue-400",
      epic: "bg-purple-500/20 text-purple-400",
      legend: "bg-yellow-500/20 text-yellow-400",
      grail: "bg-[#CEFE10]/20 text-[#CEFE10]",
      lineup: "bg-orange-500/20 text-orange-400",
      chase: "bg-cyan-500/20 text-cyan-400",
    };
    return colors[rarity.toLowerCase()] || colors.common;
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">Card Packs</h2>
            <p className="text-white/60">Manage card packs and their content</p>
          </div>
          <button
            onClick={() => {
              setEditingPack(null);
              setShowPackModal(true);
            }}
            className="flex items-center gap-2 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            New Pack
          </button>
        </div>

        {/* Search and Controls */}
        <div className="glass p-4 rounded-2xl space-y-4 relative z-0">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search packs by name, theme, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full md:w-auto justify-center"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-72 glass rounded-lg p-4 z-50 space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Rarity</label>
                    <select
                      value={activeFilters.rarity || ""}
                      onChange={(e) => setActiveFilters({ ...activeFilters, rarity: e.target.value })}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All Rarities</option>
                      <option value="Common">Common</option>
                      <option value="Uncommon">Uncommon</option>
                      <option value="Rare">Rare</option>
                      <option value="Epic">Epic</option>
                      <option value="Legend">Legend</option>
                      <option value="Grail">Grail</option>
                      <option value="Lineup">Lineup</option>
                      <option value="Chase">Chase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                    <select
                      value={activeFilters.status || ""}
                      onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <button
                      onClick={() => setActiveFilters({ rarity: "", status: "" })}
                      className="w-full text-white/60 hover:text-white text-xs font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full md:w-auto justify-center"
              >
                <ArrowUpDown className="w-5 h-5" />
                Sort
              </button>

              {showSort && (
                <div className="absolute top-full right-0 mt-2 w-48 glass rounded-lg p-4 z-50 space-y-3">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="name">Name</option>
                      <option value="createdAt">Created Date</option>
                      <option value="cardCount">Card Count</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Order</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortOrder("asc")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                          sortOrder === "asc"
                            ? "bg-[#CEFE10] text-black"
                            : "bg-black/30 border border-white/20 text-white hover:bg-black/40"
                        }`}
                      >
                        Asc
                      </button>
                      <button
                        onClick={() => setSortOrder("desc")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                          sortOrder === "desc"
                            ? "bg-[#CEFE10] text-black"
                            : "bg-black/30 border border-white/20 text-white hover:bg-black/40"
                        }`}
                      >
                        Desc
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Pack Name</th>
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Theme</th>
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Rarity</th>
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Cards</th>
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Status</th>
                  <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Created</th>
                  <th className="text-right px-6 py-4 text-white/70 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPacks.map((pack) => (
                  <tr key={pack.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-semibold">{pack.name}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{pack.theme}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRarityColor(pack.rarity)}`}>
                        <Star className="w-3 h-3" fill="currentColor" />
                        {pack.rarity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">{pack.cardCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pack.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {pack.status.charAt(0).toUpperCase() + pack.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{pack.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/packs/${pack.id}`}
                          className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingPack(pack);
                            setShowPackModal(true);
                          }}
                          className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(pack)}
                          className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredAndSortedPacks.map((pack) => (
            <div key={pack.id} className="glass p-4 rounded-2xl">
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg mb-2">{pack.name}</h3>
                <p className="text-white/60 text-sm mb-3">{pack.theme}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-white/50 text-xs">Rarity</p>
                    <p className={`text-xs font-semibold ${getRarityColor(pack.rarity)}`}>{pack.rarity}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Cards</p>
                    <p className="text-white font-semibold">{pack.cardCount}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      pack.status === "published"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {pack.status.charAt(0).toUpperCase() + pack.status.slice(1)}
                    </span>
                  </div>
                </div>

                {pack.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pack.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/packs/${pack.id}`}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors text-center"
                >
                  View
                </Link>
                <button
                  onClick={() => {
                    setEditingPack(pack);
                    setShowPackModal(true);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(pack)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <PackModal
        isOpen={showPackModal}
        onClose={() => {
          setShowPackModal(false);
          setEditingPack(null);
        }}
        onSubmit={editingPack ? handleEditPack : handleCreatePack}
        initialData={editingPack}
        title={editingPack ? "Edit Pack" : "Create New Pack"}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-white text-xl font-bold">Delete Pack</h2>
              </div>

              <p className="text-white/70 mb-6">
                Are you sure you want to delete <strong>{showDeleteModal.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePack(showDeleteModal)}
                  className="flex-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
