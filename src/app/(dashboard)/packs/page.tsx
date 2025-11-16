'use client'

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PackModal,
  DataTable,
  DataTableColumn,
  DataTableMobileCardLayout,
  Pagination,
  ResourceToolbar,
  ResourceFilterPanel,
  ResourceSortPanel,
} from "@/lib";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
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

const createInitialFilterState = (): Record<PackFilterKey, string> => ({
  packType: "",
  sportType: "",
  isActive: "",
});

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
  const [sortBy, setSortBy] = useState<"packType" | "createdAt" | "price" | "cards">("packType");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<PackFilterKey, string>>(
    createInitialFilterState()
  );
  const [page, setPage] = useState(1);

  const [filterDraft, setFilterDraft] = useState<Record<PackFilterKey, string>>(
    createInitialFilterState()
  );
  const [sortDraft, setSortDraft] = useState({ sortBy, sortOrder });

  useEffect(() => {
    setFilterDraft(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setSortDraft({ sortBy, sortOrder });
  }, [sortBy, sortOrder]);

  const handleApplyFilters = () => {
    setActiveFilters(filterDraft);
    setPage(1);
  };

  const handleClearFilters = () => {
    const resetFilters = createInitialFilterState();
    setFilterDraft(resetFilters);
    setActiveFilters(resetFilters);
    setPage(1);
  };

  const handleApplySort = () => {
    setSortBy(sortDraft.sortBy);
    setSortOrder(sortDraft.sortOrder);
    setPage(1);
  };

  const renderFilterPanel = (close: () => void) => (
    <ResourceFilterPanel
      sections={[
        {
          id: "pack-type-filter",
          label: "Pack Type",
          control: (
            <select
              value={filterDraft.packType || ""}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, packType: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Pack Types</option>
              {PACK_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {packTypeLabels[type]}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: "sport-filter",
          label: "Sport",
          control: (
            <select
              value={filterDraft.sportType || ""}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, sportType: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Sports</option>
              {SPORT_TYPE_OPTIONS.map((sport) => (
                <option key={sport} value={sport}>
                  {sportTypeLabels[sport]}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: "status-filter",
          label: "Status",
          control: (
            <select
              value={filterDraft.isActive || ""}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, isActive: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          ),
        },
      ]}
      primaryAction={{
        label: "Apply Filters",
        onClick: () => {
          handleApplyFilters();
          close();
        },
        variant: "primary",
        size: "sm",
      }}
      onClear={() => {
        handleClearFilters();
        close();
      }}
    />
  );

  const renderSortPanel = (close: () => void) => (
    <ResourceSortPanel
      sortOptions={[
        { value: "packType", label: "Pack Type" },
        { value: "createdAt", label: "Created Date" },
        { value: "price", label: "Price" },
        { value: "cards", label: "Card Count" },
      ]}
      sortBy={sortDraft.sortBy}
      sortOrder={sortDraft.sortOrder}
      onSortByChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortBy: value as "packType" | "createdAt" | "price" | "cards" }))
      }
      onSortOrderChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortOrder: value as "asc" | "desc" }))
      }
      primaryAction={{
        label: "Apply Sort",
        onClick: () => {
          handleApplySort();
          close();
        },
        variant: "primary",
        size: "sm",
      }}
    />
  );

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
          <GameButton asChild size="sm" variant="ghost" className="px-3 py-1 normal-case">
            <Link href={`/packs/${pack.id}`} className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              View
            </Link>
          </GameButton>
          <GameButton
            size="sm"
            variant="secondary"
            className="px-3 py-1 normal-case"
            onClick={() => {
              setEditingPack(pack);
              setShowPackModal(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </GameButton>
          <GameButton
            size="sm"
            variant="danger"
            className="px-3 py-1 normal-case"
            onClick={() => setShowDeleteModal(pack)}
          >
            <Trash2 className="w-4 h-4" />
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
            <Eye className="w-4 h-4" />
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
          <Edit2 className="w-4 h-4" />
          Edit
        </GameButton>
        <GameButton
          size="sm"
          variant="danger"
          onClick={() => setShowDeleteModal(pack)}
        >
          <Trash2 className="w-4 h-4" />
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

        <ResourceToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search packs by type, sport, or price..."
          filters={{
            buttonLabel: "Filters",
            renderContent: renderFilterPanel,
          }}
          sort={{
            buttonLabel: "Sort",
            renderContent: renderSortPanel,
          }}
        />

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
