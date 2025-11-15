'use client'

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PackModal,
  DataTable,
  DataTableColumn,
  DataTableMobileCardLayout,
  Pagination,
} from "@/lib";
import { Search, Plus, Filter, ArrowUpDown, Edit2, Trash2, Eye } from "lucide-react";
import { GameButton } from "@/lib/ui";
import {
  PACK_TYPE_OPTIONS,
  SPORT_TYPE_OPTIONS,
  type Pack,
  type PackFormData,
  type PackType,
  type SportType,
} from "@/lib/types/pack";

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

type PackFilterKey = "packType" | "sportType" | "isActive";

const formatCurrency = (value?: string) => {
  if (!value || Number.isNaN(Number(value))) return "-";
  return `$${Number(value).toFixed(2)}`;
};

const PACKS_PER_PAGE = 5;

const INITIAL_PACKS: Pack[] = [
  {
    id: "pack-1",
    name: "Legends of the Gridiron",
    packType: "LEGENDS",
    sportType: "FOOTBALL",
    description: "High-end football talent with a focus on legendary rookies and veterans.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1505842465776-3d8f0d5f4f6a",
    price: "79.99",
    cards: 32,
    isActive: true,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-15",
  },
  {
    id: "pack-2",
    name: "All-Star Sluggers",
    packType: "ALL_STARS",
    sportType: "BASEBALL",
    description: "A curated mix of baseball greats and rising stars.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    price: "59.50",
    cards: 28,
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-12",
  },
  {
    id: "pack-3",
    name: "Pro Court Collection",
    packType: "PRO",
    sportType: "BASKETBALL",
    description: "Modern basketball legends with premium parallels.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1505842465776-3d8f0d5f4f6a",
    price: "69.00",
    cards: 18,
    isActive: false,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-22",
  },
  {
    id: "pack-4",
    name: "Multisport Draft",
    packType: "DRAFT",
    sportType: "MULTISPORT",
    description: "Early releases covering the next generation across sports.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    bannerUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    price: "39.99",
    cards: 12,
    isActive: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-02",
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

export default function Packs() {
  const [packs, setPacks] = useState<Pack[]>(INITIAL_PACKS);
  const [search, setSearch] = useState("");
  const [showPackModal, setShowPackModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Pack | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<"packType" | "createdAt" | "price" | "cards">("packType");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<PackFilterKey, string>>({
    packType: "",
    sportType: "",
    isActive: "",
  });
  const [page, setPage] = useState(1);

  const handleFilterChange = (key: PackFilterKey, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSortByChange = (value: "packType" | "createdAt" | "price" | "cards") => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setPage(1);
  };

  const filteredAndSortedPacks = useMemo(() => {
    let result = [...packs];
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((pack) => {
        const descriptionMatch = pack.description?.toLowerCase().includes(query);
        const packTypeMatch = packTypeLabels[pack.packType].toLowerCase().includes(query);
        const sportMatch = sportTypeLabels[pack.sportType].toLowerCase().includes(query);
        return (
          descriptionMatch ||
          packTypeMatch ||
          sportMatch ||
          pack.price.toLowerCase().includes(query)
        );
      });
    }

    (Object.entries(activeFilters) as [PackFilterKey, string][]).forEach(([key, value]) => {
      if (!value) return;
      if (key === "isActive") {
        result = result.filter((pack) => String(pack.isActive) === value);
        return;
      }
      result = result.filter((pack) => pack[key] === value);
    });

    const getSortValue = (pack: Pack) => {
      if (sortBy === "price") return Number(pack.price) || 0;
      if (sortBy === "cards") return pack.cards;
      if (sortBy === "createdAt") return new Date(pack.createdAt).getTime();
      return packTypeLabels[pack.packType].toLowerCase();
    };

    result.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [packs, search, activeFilters, sortBy, sortOrder]);

  const totalItems = filteredAndSortedPacks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PACKS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedPacks = filteredAndSortedPacks.slice(
    (currentPage - 1) * PACKS_PER_PAGE,
    currentPage * PACKS_PER_PAGE
  );

  const handleCreatePack = (formData: PackFormData) => {
    const timestamp = new Date().toISOString();
    const newPack: Pack = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      cards: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setPacks((prev) => [...prev, newPack]);
    setShowPackModal(false);
  };

  const handleEditPack = (formData: PackFormData) => {
    if (!editingPack) return;
    setPacks((prev) =>
      prev.map((pack) =>
        pack.id === editingPack.id
          ? { ...pack, ...formData, updatedAt: new Date().toISOString() }
          : pack
      )
    );
    setEditingPack(null);
    setShowPackModal(false);
  };

  const handleDeletePack = (pack: Pack) => {
    setPacks(packs.filter((p) => p.id !== pack.id));
    setShowDeleteModal(null);
    setPage(1);
  };

  const packColumns: DataTableColumn<Pack>[] = [
    {
      id: "pack",
      header: "Pack",
      cell: (pack) => (
        <div>
          <p className="text-white font-semibold">{packTypeLabels[pack.packType]}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            {sportTypeLabels[pack.sportType]}
          </p>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: (pack) => <p className="text-white font-semibold">{formatCurrency(pack.price)}</p>,
    },
    {
      id: "cards",
      header: "Cards",
      cell: (pack) => <p className="text-white font-semibold">{pack.cards}</p>,
    },
    {
      id: "status",
      header: "Status",
      cell: (pack) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            pack.isActive ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {pack.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "created",
      header: "Created",
      cell: (pack) => <p className="text-white/70 text-sm">{pack.createdAt}</p>,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (pack) => (
        <div className="flex items-center justify-end gap-2">
          <GameButton asChild variant="secondary" className="p-2 hover:text-[#CEFE10] normal-case">
            <Link href={`/packs/${pack.id}`} className="flex items-center gap-1">
              View
            </Link>
          </GameButton>
          <GameButton
            variant="secondary"
            className="p-2 hover:text-[#CEFE10] normal-case"
            onClick={() => {
              setEditingPack(pack);
              setShowPackModal(true);
            }}
          >
            Edit
          </GameButton>
          <GameButton
            variant="danger"
            className="p-2 normal-case"
            onClick={() => setShowDeleteModal(pack)}
          >
            Delete
          </GameButton>
        </div>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ];

  const renderPackMobileCard = (pack: Pack) => {
    const statusLabel = pack.isActive ? "Active" : "Inactive";

    const actionButtons = (
      <div className="flex flex-wrap gap-2 w-full">
        <GameButton asChild variant="secondary" size="sm" className="flex-1 normal-case px-3 py-2">
          <Link href={`/packs/${pack.id}`} className="flex items-center justify-center gap-1">
            View
          </Link>
        </GameButton>
        <GameButton
          size="sm"
          variant="secondary"
          onClick={() => {
            setEditingPack(pack);
            setShowPackModal(true);
          }}
        >
          &nbsp; Edit &nbsp;
        </GameButton>
        <GameButton
          size="sm"
          variant="danger"
          onClick={() => setShowDeleteModal(pack)}
        >
          Delete
        </GameButton>
      </div>
    );

    return (
      <DataTableMobileCardLayout
        title={packTypeLabels[pack.packType]}
        subtitle={sportTypeLabels[pack.sportType]}
        badge={{
          label: statusLabel,
          className: pack.isActive
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-300",
        }}
        fields={[
          {
            id: `price-${pack.id}`,
            label: "Price",
            value: formatCurrency(pack.price),
          },
          {
            id: `cards-${pack.id}`,
            label: "Cards",
            value: pack.cards,
          },
          {
            id: `sport-${pack.id}`,
            label: "Sport",
            value: sportTypeLabels[pack.sportType],
            span: 2,
          },
        ]}
        actions={actionButtons}
      />
    );
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
          <GameButton
            onClick={() => {
              setEditingPack(null);
              setShowPackModal(true);
            }}
            className="w-full md:w-auto justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Pack
          </GameButton>
        </div>

        {/* Search and Controls */}
        <div className="glass p-4 rounded-2xl space-y-4 relative z-0">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search packs by type, sport, or price..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <GameButton
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto justify-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </GameButton>

              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-72 glass rounded-lg p-4 z-50 space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Pack Type</label>
                    <select
                      value={activeFilters.packType || ""}
                      onChange={(e) => handleFilterChange("packType", e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All Pack Types</option>
                      {PACK_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {packTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Sport</label>
                    <select
                      value={activeFilters.sportType || ""}
                      onChange={(e) => handleFilterChange("sportType", e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All Sports</option>
                      {SPORT_TYPE_OPTIONS.map((sport) => (
                        <option key={sport} value={sport}>
                          {sportTypeLabels[sport]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                    <select
                      value={activeFilters.isActive || ""}
                      onChange={(e) => handleFilterChange("isActive", e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <GameButton
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-xs"
                      onClick={() => {
                        setActiveFilters({
                          packType: "",
                          sportType: "",
                          isActive: "",
                        });
                        setPage(1);
                      }}
                    >
                      Clear Filters
                    </GameButton>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <GameButton
                variant="secondary"
                onClick={() => setShowSort(!showSort)}
                className="w-full md:w-auto justify-center gap-2"
              >
                <ArrowUpDown className="w-5 h-5" />
                Sort
              </GameButton>

              {showSort && (
                <div className="absolute top-full right-0 mt-2 w-48 glass rounded-lg p-4 z-50 space-y-3">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        handleSortByChange(e.target.value as "packType" | "createdAt" | "price" | "cards")
                      }
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="packType">Pack Type</option>
                      <option value="createdAt">Created Date</option>
                      <option value="price">Price</option>
                      <option value="cards">Card Count</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Order</label>
                    <div className="flex gap-2">
                      <GameButton
                        size="sm"
                        variant={sortOrder === "asc" ? "primary" : "ghost"}
                        className="flex-1"
                        onClick={() => handleSortOrderChange("asc")}
                      >
                        Asc
                      </GameButton>
                      <GameButton
                        size="sm"
                        variant={sortOrder === "desc" ? "primary" : "ghost"}
                        className="flex-1"
                        onClick={() => handleSortOrderChange("desc")}
                      >
                        Desc
                      </GameButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DataTable<Pack>
          data={paginatedPacks}
          columns={packColumns}
          keyExtractor={(pack) => pack.id}
          renderMobileCard={(pack) => renderPackMobileCard(pack)}
          emptyState={
            <div className="glass rounded-2xl p-6 text-center text-white/70">
              No packs match the current filters.
            </div>
          }
        />

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PACKS_PER_PAGE}
            onPageChange={setPage}
            className="mt-4"
          />
        )}
      </div>

      {/* Modals */}
      <PackModal
        isOpen={showPackModal}
        onClose={() => {
          setShowPackModal(false);
          setEditingPack(null);
        }}
        onSubmit={editingPack ? handleEditPack : handleCreatePack}
        initialData={editingPack ? packToFormData(editingPack) : null}
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
