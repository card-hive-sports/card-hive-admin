'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  PackFilterPanel,
  PackModal,
  PackSortPanel,
  DataTable,
  Pagination,
  ResourceToolbar,
  renderPackColumns,
  renderPackMobileCard,
  createInitialFilterState,
  packTypeLabels,
  sportTypeLabels,
  DeletePackModal,
  PackFilters,
  PackSortBy,
  PackSortDraft,
  PackSortOrder,
  GameButton,
  Pack,
  PackFormData
} from "@/lib";

const PACKS_PER_PAGE = 5;

const INITIAL_PACKS: Pack[] = [
  {
    id: "pack-1",
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
  const [pack, setPack] = useState<Pack | null>(null);
  const [sortBy, setSortBy] = useState<PackSortBy>("packType");
  const [sortOrder, setSortOrder] = useState<PackSortOrder>("asc");
  const [activeFilters, setActiveFilters] = useState<PackFilters>(() => createInitialFilterState());
  const [page, setPage] = useState(1);

  const [filterDraft, setFilterDraft] = useState<PackFilters>(() => createInitialFilterState());
  const [sortDraft, setSortDraft] = useState<PackSortDraft>(() => ({
    sortBy: "packType",
    sortOrder: "asc",
  }));

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

  const handlePackEdit = useCallback((pack: Pack) => {
    setEditingPack(pack);
    setShowPackModal(true);
  }, []);

  const handlePackDelete = useCallback((pack: Pack) => {
    setPack(pack);
  }, []);

  const packColumns = useMemo(
    () =>
      renderPackColumns({
        onEdit: handlePackEdit,
        onDelete: handlePackDelete,
      }),
    [handlePackDelete, handlePackEdit]
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

    (Object.entries(activeFilters) as [keyof typeof activeFilters, string][]).forEach(([key, value]) => {
      if (!value) return;
      if (key === "isActive") {
        result = result.filter((pack) => String(pack.isActive) === value);
        return;
      }
      result = result.filter((pack) => pack[key as keyof Pack] === value);
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
    setPack(null);
    setPage(1);
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
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
            renderContent: (close: () => void) => (
              <PackFilterPanel
                filterDraft={filterDraft}
                setFilterDraft={setFilterDraft}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
                close={close}
              />
            ),
          }}
          sort={{
            buttonLabel: "Sort",
            renderContent: (close: () => void) => (
              <PackSortPanel
                sortDraft={sortDraft}
                setSortDraft={setSortDraft}
                handleApplySort={handleApplySort}
                close={close}
              />
            ),
          }}
        />

        <DataTable<Pack>
          data={paginatedPacks}
          columns={packColumns}
          keyExtractor={(pack) => pack.id}
          renderMobileCard={(pack) =>
            renderPackMobileCard(pack, {
              onEdit: handlePackEdit,
              onDelete: handlePackDelete,
            })
          }
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

      {pack && (
        <DeletePackModal
          pack={pack}
          setPack={setPack}
          handleDeletePack={handleDeletePack}
        />
      )}
    </>
  );
}
