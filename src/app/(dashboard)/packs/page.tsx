'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
  DeletePackModal,
  PackFilters,
  PackSortBy,
  PackSortDraft,
  PackSortOrder,
  GameButton,
  Pack,
  PackFormData,
  GetPacksParams,
  packsAPI,
  useDebouncedValue,
  PackType,
  SportType,
} from "@/lib";
import { showApiError } from "@/lib/utils/show-api-error";

const PACKS_PER_PAGE = 5;

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
  const [packs, setPacks] = useState<Pack[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [isLoading, setIsLoading] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [packToDelete, setPackToDelete] = useState<Pack | null>(null);
  const [sortBy, setSortBy] = useState<PackSortBy>("packType");
  const [sortOrder, setSortOrder] = useState<PackSortOrder>("asc");
  const [activeFilters, setActiveFilters] = useState<PackFilters>(() => createInitialFilterState());
  const [page, setPage] = useState(1);
  const [paginationState, setPaginationState] = useState({
    total: 0,
    totalPages: 1,
    limit: PACKS_PER_PAGE,
    hasNext: false,
    hasPrev: false,
  });

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

  const fetchPacks = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      try {
        const normalizedSearch = debouncedSearch.trim();
        const params: GetPacksParams = {
          search: normalizedSearch ? normalizedSearch : undefined,
          packType: activeFilters.packType as PackType || undefined,
          sportType: activeFilters.sportType as SportType || undefined,
          isActive:
            activeFilters.isActive === ""
              ? undefined
              : activeFilters.isActive === "true",
          sortBy,
          sortOrder,
          page: targetPage,
          limit: PACKS_PER_PAGE,
        };

        const response = await packsAPI.getPacks(params);
        setPacks(response.data);
        setPaginationState({
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
          limit: response.pagination.limit,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        });

        if (response.pagination.page !== targetPage) {
          setPage(response.pagination.page);
        }
      } catch (error) {
        showApiError("fetch packs", error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, activeFilters, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchPacks(page);
  }, [fetchPacks, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

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

  const handlePackDeleteRequest = useCallback((pack: Pack) => {
    setPackToDelete(pack);
  }, []);

  const packColumns = useMemo(
    () =>
      renderPackColumns({
        onEdit: handlePackEdit,
        onDelete: handlePackDeleteRequest,
      }),
    [handlePackDeleteRequest, handlePackEdit]
  );

  const handlePageChange = (nextPage: number) => {
    setPage((prevPage) => {
      const totalPagesCount = Math.max(1, paginationState.totalPages);
      if (nextPage < 1 || nextPage > totalPagesCount || nextPage === prevPage) {
        return prevPage;
      }
      return nextPage;
    });
  };

  const handleCreatePack = async (formData: PackFormData) => {
    try {
      await packsAPI.createPack(formData);
      toast.success("Pack created");
      setShowPackModal(false);
      setEditingPack(null);
      if (page === 1) {
        await fetchPacks(1);
      } else {
        setPage(1);
      }
    } catch (error) {
      showApiError("create pack", error as AxiosError);
    }
  };

  const handleUpdatePack = async (formData: PackFormData) => {
    if (!editingPack) return;
    try {
      await packsAPI.updatePack(editingPack.id, formData);
      toast.success("Pack updated");
      setEditingPack(null);
      setShowPackModal(false);
      await fetchPacks(page);
    } catch (error) {
      showApiError("update pack", error as AxiosError);
    }
  };

  const handleDeletePack = async (pack: Pack) => {
    try {
      await packsAPI.deletePack(pack.id);
      toast.success("Pack deleted");
      setPackToDelete(null);
      await fetchPacks(page);
    } catch (error) {
      showApiError("delete pack", error as AxiosError);
    }
  };

  const safeTotalPages = Math.max(1, paginationState.totalPages);
  const pageSize = Math.max(1, paginationState.limit);

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
          onSearchChange={handleSearchChange}
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
          data={packs}
          columns={packColumns}
          keyExtractor={(pack) => pack.id}
          renderMobileCard={(pack) =>
            renderPackMobileCard(pack, {
              onEdit: handlePackEdit,
              onDelete: handlePackDeleteRequest,
            })
          }
          emptyState={
            <div className="glass rounded-2xl p-6 text-center text-white/70">
              {isLoading ? "Loading packs..." : "No packs match the current filters."}
            </div>
          }
        />

        {safeTotalPages > 1 && (
          <Pagination
            page={page}
            totalPages={safeTotalPages}
            totalItems={paginationState.total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            isLoading={isLoading}
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
        onSubmit={editingPack ? handleUpdatePack : handleCreatePack}
        initialData={editingPack ? packToFormData(editingPack) : null}
        title={editingPack ? "Edit Pack" : "Create New Pack"}
      />

      {packToDelete && (
        <DeletePackModal
          pack={packToDelete}
          setPack={setPackToDelete}
          handleDeletePack={handleDeletePack}
        />
      )}
    </>
  );
}
