'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  ActivityLog,
  ActivityLogEntry,
  Card,
  CardFormData,
  CardFilters,
  CardModal,
  CardSortDraft,
  CardSortPanel,
  CardFilterPanel,
  GetCardsParams,
  cardsAPI,
  createInitialCardFilterState,
  DeleteCardModal,
  renderCardColumns,
  renderCardMobileCard,
  ResourceToolbar,
  DataTable,
  Pagination,
  GameButton,
  useDebouncedValue,
  showApiError,
} from '@/lib';
import { CardCondition, CardRarity, CardSortBy, CardSortOrder } from '@/lib/types/card';
import { packsAPI } from '@/lib/api';
import { packTypeLabels, sportTypeLabels } from '@/lib/components/packs/constants';

const CARDS_PER_PAGE = 8;

type PackOption = {
  id: string;
  name: string;
};

const ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: '1',
    type: 'publish',
    title: 'Card Published',
    description: 'A new card was published to the Lunar Pack.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'Admin User',
  },
  {
    id: '2',
    type: 'update',
    title: 'Card Updated',
    description: 'Updated rarity metadata for the Grail edition.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: 'Admin User',
  },
];

const cardToFormData = (card: Card): CardFormData => ({
  name: card.name,
  playerName: card.playerName ?? undefined,
  description: card.description ?? undefined,
  imageUrl: card.imageUrl ?? undefined,
  bannerUrl: card.bannerUrl ?? undefined,
  packId: card.packId,
  sportType: card.sportType,
  rarity: card.rarity,
  condition: card.condition ?? undefined,
  estimatedValue: card.estimatedValue ?? undefined,
  serialNumber: card.serialNumber ?? undefined,
  year: card.year ?? undefined,
  manufacturer: card.manufacturer ?? undefined,
});

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [packOptions, setPackOptions] = useState<PackOption[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [sortBy, setSortBy] = useState<CardSortBy>('name');
  const [sortOrder, setSortOrder] = useState<CardSortOrder>('asc');
  const [activeFilters, setActiveFilters] = useState<CardFilters>(() => createInitialCardFilterState());
  const [filterDraft, setFilterDraft] = useState<CardFilters>(() => createInitialCardFilterState());
  const [sortDraft, setSortDraft] = useState<CardSortDraft>(() => ({
    sortBy: 'name',
    sortOrder: 'asc',
  }));
  const [page, setPage] = useState(1);
  const [paginationState, setPaginationState] = useState({
    total: 0,
    totalPages: 1,
    limit: CARDS_PER_PAGE,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const response = await packsAPI.getPacks({ limit: 100, page: 1 });
        const options = response.data.map((pack) => ({
          id: pack.id,
          name: `${packTypeLabels[pack.packType]} — ${sportTypeLabels[pack.sportType]}`,
        }));
        setPackOptions(options);
      } catch (error) {
        showApiError('fetch packs', error as AxiosError);
      }
    };

    loadPacks();
  }, []);

  useEffect(() => {
    setFilterDraft(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setSortDraft({ sortBy, sortOrder });
  }, [sortBy, sortOrder]);

  const fetchCards = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      try {
        const normalizedSearch = debouncedSearch.trim();
        const params: GetCardsParams = {
          search: normalizedSearch ? normalizedSearch : undefined,
          packId: activeFilters.packId || undefined,
          rarity: (activeFilters.rarity as CardRarity) || undefined,
          condition: (activeFilters.condition as CardCondition) || undefined,
          sortBy,
          sortOrder,
          page: targetPage,
          limit: CARDS_PER_PAGE,
        };

        const response = await cardsAPI.getCards(params);
        setCards(response.data);
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
        showApiError('fetch cards', error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    },
    [activeFilters, debouncedSearch, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchCards(page);
  }, [fetchCards, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setActiveFilters(filterDraft);
    setPage(1);
  };

  const handleClearFilters = () => {
    const resetFilters = createInitialCardFilterState();
    setFilterDraft(resetFilters);
    setActiveFilters(resetFilters);
    setPage(1);
  };

  const handleApplySort = () => {
    setSortBy(sortDraft.sortBy);
    setSortOrder(sortDraft.sortOrder);
    setPage(1);
  };

  const handleCardEdit = useCallback((card: Card) => {
    setEditingCard(card);
    setShowCardModal(true);
  }, []);

  const handleDeleteRequest = useCallback((card: Card) => {
    setCardToDelete(card);
  }, []);

  const cardColumns = useMemo(
    () =>
      renderCardColumns({
        onEdit: handleCardEdit,
        onDelete: handleDeleteRequest,
      }),
    [handleCardEdit, handleDeleteRequest]
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

  const handleCreateCard = async (formData: CardFormData) => {
    try {
      await cardsAPI.createCard(formData);
      toast.success('Card created');
      setShowCardModal(false);
      setEditingCard(null);
      if (page === 1) {
        await fetchCards(1);
      } else {
        setPage(1);
      }
    } catch (error) {
      showApiError('create card', error as AxiosError);
    }
  };

  const handleUpdateCard = async (formData: CardFormData) => {
    if (!editingCard) return;
    try {
      await cardsAPI.updateCard(editingCard.id, formData);
      toast.success('Card updated');
      setEditingCard(null);
      setShowCardModal(false);
      await fetchCards(page);
    } catch (error) {
      showApiError('update card', error as AxiosError);
    }
  };

  const handleDeleteCard = async (card: Card) => {
    try {
      await cardsAPI.deleteCard(card.id);
      toast.success('Card deleted');
      setCardToDelete(null);
      await fetchCards(page);
    } catch (error) {
      showApiError('delete card', error as AxiosError);
    }
  };

  const safeTotalPages = Math.max(1, paginationState.totalPages);
  const pageSize = Math.max(1, paginationState.limit);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Cards</h2>
          <p className="text-white/60">Manage the cards that live inside your packs</p>
        </div>
        <GameButton
          onClick={() => {
            setEditingCard(null);
            setShowCardModal(true);
          }}
          className="w-full md:w-auto justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Card
        </GameButton>
      </div>

      <ResourceToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search cards by name, rarity, or serial..."
        filters={{
          buttonLabel: 'Filters',
          renderContent: (close) => (
            <CardFilterPanel
              filterDraft={filterDraft}
              setFilterDraft={setFilterDraft}
              packs={packOptions}
              handleApplyFilters={handleApplyFilters}
              handleClearFilters={handleClearFilters}
              close={close}
            />
          ),
        }}
        sort={{
          buttonLabel: 'Sort',
          renderContent: (close) => (
            <CardSortPanel
              sortDraft={sortDraft}
              setSortDraft={setSortDraft}
              handleApplySort={handleApplySort}
              close={close}
            />
          ),
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <DataTable<Card>
            data={cards}
            columns={cardColumns}
            keyExtractor={(card) => card.id}
            renderMobileCard={(card) =>
              renderCardMobileCard(card, {
                onEdit: handleCardEdit,
                onDelete: handleDeleteRequest,
              })
            }
            emptyState={
              <div className="glass rounded-2xl p-6 text-center text-white/70">
                {isLoading ? 'Loading cards...' : 'No cards match the current filters.'}
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

        <div className="space-y-4">
          <ActivityLog entries={ACTIVITY_LOG} />
        </div>
      </div>

      <CardModal
        key={editingCard ? editingCard.id : 'new-card'}
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setEditingCard(null);
        }}
        onSubmit={editingCard ? handleUpdateCard : handleCreateCard}
        initialData={editingCard ? cardToFormData(editingCard) : null}
        title={editingCard ? 'Edit Card' : 'Create New Card'}
        packs={packOptions}
      />

      {cardToDelete && (
        <DeleteCardModal
          card={cardToDelete}
          setCard={setCardToDelete}
          handleDeleteCard={handleDeleteCard}
        />
      )}
    </div>
  );
}
