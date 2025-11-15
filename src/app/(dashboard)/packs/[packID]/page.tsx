'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { PackModal, PackPreview, ActivityLog, ActivityLogEntry } from "@/lib";
import { ArrowLeft, Edit2, Plus, Trash2, Tag, Calendar, Layers } from "lucide-react";

interface PackCard {
  id: string;
  name: string;
  rarity: string;
}

interface PackDetail {
  id: string;
  name: string;
  theme: string;
  rarity: string;
  releaseDate: string;
  releaseType: string;
  status: "draft" | "published";
  tags: string[];
  cards: PackCard[];
  createdAt: string;
  updatedAt: string;
}

const PACK_DATA: Record<string, PackDetail> = {
  "1": {
    id: "1",
    name: "Golden Era Basketball",
    theme: "Basketball",
    rarity: "Legend",
    releaseDate: "2024-02-01",
    releaseType: "standard",
    status: "published",
    tags: ["basketball", "vintage", "iconic"],
    cards: [
      { id: "1", name: "Michael Jordan", rarity: "Legend" },
      { id: "2", name: "LeBron James", rarity: "Legend" },
      { id: "3", name: "Kobe Bryant", rarity: "Epic" },
      { id: "4", name: "Magic Johnson", rarity: "Epic" },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  "2": {
    id: "2",
    name: "Modern Athletes",
    theme: "Contemporary Sports",
    rarity: "Rare",
    releaseDate: "2024-02-15",
    releaseType: "limited",
    status: "published",
    tags: ["modern", "sports", "trending"],
    cards: [
      { id: "5", name: "Stephen Curry", rarity: "Rare" },
      { id: "6", name: "Kevin Durant", rarity: "Rare" },
      { id: "7", name: "Giannis Antetokounmpo", rarity: "Rare" },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
};

const ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: "1",
    type: "publish",
    title: "Pack Published",
    description: "Golden Era Basketball pack was published to production",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "Admin User",
  },
  {
    id: "2",
    type: "update",
    title: "Pack Updated",
    description: "Updated metadata and tags for the pack",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: "Admin User",
  },
  {
    id: "3",
    type: "create",
    title: "Pack Created",
    description: "Golden Era Basketball pack was created",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    user: "Admin User",
  },
];

export default function PackDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [pack, setPack] = useState<PackDetail | null>(PACK_DATA[id as string || "1"] || null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!pack) {
    return (
      <>
        <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-2">Pack not found</h2>
            <Link href="/packs" className="text-[#CEFE10] hover:underline">
              Back to Packs
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleEditPack = (formData: any) => {
    setPack({ ...pack, ...formData, updatedAt: new Date().toISOString().split("T")[0] });
    setShowEditModal(false);
  };

  const handleDeletePack = () => {
    router.push("/packs");
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
        {/* Back Button */}
        <button
          onClick={() => router.push("/packs")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packs
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">{pack.name}</h2>
            <p className="text-white/60">{pack.theme}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors border border-red-500/30"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pack Details and Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pack Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Status</p>
                <p className={`text-sm font-bold ${
                  pack.status === "published"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}>
                  {pack.status.charAt(0).toUpperCase() + pack.status.slice(1)}
                </p>
              </div>

              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Rarity</p>
                <p className={`text-sm font-bold ${getRarityColor(pack.rarity)}`}>{pack.rarity}</p>
              </div>

              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Cards</p>
                <p className="text-white text-sm font-bold">{pack.cards.length}</p>
              </div>

              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Release Type</p>
                <p className="text-white text-sm font-bold capitalize">{pack.releaseType}</p>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <h3 className="text-white text-lg font-bold">Metadata</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Release Date
                  </p>
                  <p className="text-white font-semibold">{pack.releaseDate}</p>
                </div>

                <div>
                  <p className="text-white/60 text-sm font-medium mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Pack Type
                  </p>
                  <p className="text-white font-semibold capitalize">{pack.releaseType}</p>
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </p>
                {pack.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pack.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm">No tags assigned</p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-white/50 space-y-1">
                <p>Created: {pack.createdAt}</p>
                <p>Last Updated: {pack.updatedAt}</p>
              </div>
            </div>

            {/* Cards Section */}
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">Cards in Pack ({pack.cards.length})</h3>
                <Link
                  href="/cards"
                  className="flex items-center gap-1 text-[#CEFE10] hover:text-[#b8e80d] text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </Link>
              </div>

              {pack.cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pack.cards.map((card) => (
                    <div key={card.id} className="bg-black/30 p-4 rounded-lg border border-white/10 hover:border-[#CEFE10]/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1">{card.name}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRarityColor(card.rarity)}`}>
                            {card.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 mb-4">No cards in this pack yet</p>
                  <Link
                    href="/cards"
                    className="inline-flex items-center gap-2 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Card
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pack Preview and Activity Log */}
          <div className="space-y-6">
            {/* Pack Preview */}
            <PackPreview
              name={pack.name}
              theme={pack.theme}
              rarity={pack.rarity}
              releaseDate={pack.releaseDate}
              cardCount={pack.cards.length}
              cards={pack.cards}
            />

            {/* Activity Log */}
            <ActivityLog entries={ACTIVITY_LOG} maxHeight="max-h-72" />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <PackModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditPack}
        initialData={pack}
        title="Edit Pack"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDeleteModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-white text-xl font-bold">Delete Pack</h2>
              </div>

              <p className="text-white/70 mb-6">
                Are you sure you want to delete <strong>{pack.name}</strong>? All cards in this pack will be permanently removed. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePack}
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
