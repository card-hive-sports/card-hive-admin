'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PackModal, PackPreview, ActivityLog, ActivityLogEntry } from "@/lib";
import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";
import { GameButton } from "@/lib/ui";
import type { Pack, PackFormData, PackType, SportType } from "@/lib/types/pack";

const packTypeLabels: Record<PackType, string> = {
  DRAFT: "Draft",
  PRO: "Pro",
  ALL_STARS: "All Stars",
  HALL_OF_FAME: "Hall of Fame",
  LEGENDS: "Legends",
};

const sportTypeLabels: Record<SportType, string> = {
  FOOTBALL: "Football",
  BASEBALL: "Baseball",
  BASKETBALL: "Basketball",
  MULTISPORT: "Multisport",
};

const formatCurrency = (value?: string) => {
  if (!value || Number.isNaN(Number(value))) return "-";
  return `$${Number(value).toFixed(2)}`;
};

const PACK_DATA: Record<string, Pack> = {
  "pack-1": {
    id: "pack-1",
    packType: "LEGENDS",
    sportType: "FOOTBALL",
    description: "High-end football talent featuring legendary rookies and veterans with premium parallels.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1505842465776-3d8f0d5f4f6a",
    price: "79.99",
    cards: 32,
    isActive: true,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-15",
  },
  "pack-2": {
    id: "pack-2",
    packType: "ALL_STARS",
    sportType: "BASEBALL",
    description: "A carefully curated mix of baseball greats and rising stars ready for collectors.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    price: "59.50",
    cards: 28,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-12",
  },
};

const ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: "1",
    type: "publish",
    title: "Pack Published",
    description: "Legendary football pack was published to production",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "Admin User",
  },
  {
    id: "2",
    type: "update",
    title: "Pack Updated",
    description: "Updated metadata for the pack",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: "Admin User",
  },
  {
    id: "3",
    type: "create",
    title: "Pack Created",
    description: "Pack was created in the system",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    user: "Admin User",
  },
];

const packToFormData = (pack: Pack): PackFormData => ({
  name: pack.name ?? "",
  packType: pack.packType,
  sportType: pack.sportType,
  description: pack.description,
  imageUrl: pack.imageUrl,
  bannerUrl: pack.bannerUrl,
  price: pack.price,
  isActive: pack.isActive,
});

export default function PackDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [pack, setPack] = useState<Pack | null>(PACK_DATA[id as string || "pack-1"] || null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!pack) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Pack not found</h2>
          <Link href="/packs" className="text-[#CEFE10] hover:underline">
            Back to Packs
          </Link>
        </div>
      </div>
    );
  }

  const handleEditPack = (formData: PackFormData) => {
    setPack((current) =>
      current
        ? { ...current, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
        : current
    );
    setShowEditModal(false);
  };

  const handleDeletePack = () => {
    router.push("/packs");
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        <button
          onClick={() => router.push("/packs")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packs
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">{packTypeLabels[pack.packType]}</h2>
            <p className="text-white/60">{sportTypeLabels[pack.sportType]}</p>
          </div>
          <div className="flex gap-2">
            <GameButton
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setShowEditModal(true)}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </GameButton>
            <GameButton
              size="sm"
              variant="danger"
              className="flex-1 gap-2"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </GameButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Status</p>
                <p
                  className={`text-sm font-bold ${
                    pack.isActive ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {pack.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Pack Type</p>
                <p className="text-white font-semibold">{packTypeLabels[pack.packType]}</p>
              </div>
              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Sport</p>
                <p className="text-white font-semibold">{sportTypeLabels[pack.sportType]}</p>
              </div>
              <div className="glass p-4 rounded-2xl">
                <p className="text-white/60 text-xs font-medium mb-1">Cards</p>
                <p className="text-white text-sm font-bold">{pack.cards}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl space-y-4">
              <h3 className="text-white text-lg font-bold">Metadata</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {pack.description || "No extra description has been provided for this pack yet."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Price</p>
                  <p className="text-white font-semibold">{formatCurrency(pack.price)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Created</p>
                  <p className="text-white/80 text-sm">{pack.createdAt}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Last Updated</p>
                  <p className="text-white/80 text-sm">{pack.updatedAt}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Cover Image</p>
                  {pack.imageUrl ? (
                    <div className="relative h-24 w-full overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={pack.imageUrl}
                        alt={`${packTypeLabels[pack.packType]} cover`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm">No cover image</p>
                  )}
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">Cards</h3>
                <span className="text-white/60 text-sm">{pack.cards} card{pack.cards === 1 ? "" : "s"}</span>
              </div>
              <p className="text-white/70 text-sm">
                The API only returns the total number of cards inside a pack — the actual card data is managed
                through the Cards section.
              </p>
              <GameButton asChild>
                <Link
                  href="/cards"
                  className="inline-flex items-center gap-2 text-black font-semibold py-2 px-4 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Manage Cards
                </Link>
              </GameButton>
            </div>
          </div>

          <div className="space-y-6">
            <PackPreview
              packType={pack.packType}
              sportType={pack.sportType}
              price={pack.price}
              bannerUrl={pack.bannerUrl}
            />
            <ActivityLog entries={ACTIVITY_LOG} maxHeight="max-h-72" />
          </div>
        </div>
      </div>

      <PackModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditPack}
        initialData={pack ? packToFormData(pack) : null}
        title="Edit Pack"
      />

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
                Are you sure you want to delete the{" "}
                <strong>
                  {packTypeLabels[pack.packType]} · {sportTypeLabels[pack.sportType]}
                </strong>{" "}
                pack? This action cannot be undone.
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
