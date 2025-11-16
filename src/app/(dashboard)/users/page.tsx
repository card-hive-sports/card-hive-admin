'use client'

import {useState, useEffect, useCallback} from "react";
import { Plus } from "lucide-react";
import {
  UserFormData,
  UserModal,
  GetUsersParams,
  usersAPI,
  useDebouncedValue,
  User,
  COMPUTED_STATUS,
  USERS_SORT_OPTIONS,
  SORT_ORDER,
  Pagination,
  PageHeader,
  ResourceToolbar,
  UsersFilterPanel,
  ActiveUsersFilterState,
  DataTable,
  GameButton,
  UsersSortPanel,
  renderUserColumns,
  renderUserMobileCard,
  PaginationState,
} from "@/lib";
import { toast } from "sonner";
import { showApiError } from "@/lib/utils/show-api-error";
import { AxiosError } from "axios";
import { DeleteUserModal } from "@/lib/components/users/delete-user.modal";


const initialFiltersState = (): ActiveUsersFilterState => ({
  status: "",
  startDate: "",
  endDate: "",
});

export default function Users() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<USERS_SORT_OPTIONS>(USERS_SORT_OPTIONS.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.DESC);
  const [activeFilters, setActiveFilters] = useState<ActiveUsersFilterState>(() => initialFiltersState());
  const [filterDraft, setFilterDraft] = useState<ActiveUsersFilterState>(() => initialFiltersState());
  const [sortDraft, setSortDraft] = useState<{ sortBy: USERS_SORT_OPTIONS; sortOrder: SORT_ORDER }>({
    sortBy: USERS_SORT_OPTIONS.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const { status, startDate, endDate } = activeFilters;
  const { page, limit, total, totalPages } = paginationState;

  const resetToFirstPage = useCallback(() => {
    setPaginationState((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPaginationState((prev) => {
      if (nextPage < 1 || nextPage > prev.totalPages || nextPage === prev.page) {
        return prev;
      }
      return {
        ...prev,
        page: nextPage,
      };
    });
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleApplyFilters = () => {
    setActiveFilters({ ...filterDraft });
    resetToFirstPage();
  };

  const handleApplySort = () => {
    setSortBy(sortDraft.sortBy);
    setSortOrder(sortDraft.sortOrder);
    resetToFirstPage();
  };

  const fetchUsers = useCallback(async (searchTerm?: string) => {
    setIsLoading(true);
    try {
      const normalizedSearch = searchTerm?.trim();
      const params: GetUsersParams = {
        search: normalizedSearch ? normalizedSearch : undefined,
        ...(status && COMPUTED_STATUS[status as COMPUTED_STATUS]),
        sortBy,
        sortOrder,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
      };

      const response = await usersAPI.getUsers(params);

      setUsers(response.data);
      setPaginationState((prev) => ({
        ...prev,
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
        hasNext: response.pagination.hasNext,
        hasPrev: response.pagination.hasPrev,
      }));
    } catch (error) {
      showApiError('fetch users', error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }, [status, startDate, endDate, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch, fetchUsers]);

  useEffect(() => {
    setFilterDraft(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setSortDraft({ sortBy, sortOrder });
  }, [sortBy, sortOrder]);

  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await usersAPI.createUser({
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        role: formData.role,
      });
      await fetchUsers(search);
      setShowUserModal(false);
      toast.success("User created successfully");
    } catch (error) {
      showApiError('create user', error as AxiosError);
    }
  };

  const handleEditUser = async (formData: UserFormData) => {
    if (!editingUser) return;
    try {
      await usersAPI.updateUser(editingUser.id, {
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      });
      await fetchUsers(search);
      setEditingUser(null);
      setShowUserModal(false);
      toast.success("User updated successfully");
    } catch (error) {
      showApiError('update user', error as AxiosError);
    }
  };

  const handleDeleteUser = async (user: User, isPurge: boolean) => {
    try {
      await usersAPI.deleteUser(user.id, isPurge);
      await fetchUsers(search);
      setUser(null);
      toast.success(isPurge ? "User permanently deleted" : "User moved to trash");
    } catch (error) {
      showApiError(isPurge ? 'permanently delete user' : 'delete user', error as AxiosError);
    }
  };

  const handleUnarchiveUser = async (user: User) => {
    try {
      await usersAPI.unarchiveUser(user.id);
      await fetchUsers(search);
      setUser(null);
      toast.success("User restored successfully");
    } catch (error) {
      showApiError('restore user', error as AxiosError);
    }
  };

  const handleSuspendUser = async (user: User) => {
    try {
      if (user.isActive) {
        await usersAPI.suspendUser(user.id);
        toast.success("User suspended");
      } else {
        await usersAPI.unsuspendUser(user.id);
        toast.success("User unsuspended");
      }
      await fetchUsers(search);
    } catch (error) {
      showApiError(user.isActive ? 'suspend user' : 'unsuspend user', error as AxiosError);
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        <PageHeader
          title="Users"
          subtitle="Manage platform users and their accounts"
          actions={
            <GameButton
              size="md"
              className="w-full md:w-auto justify-center gap-2"
              onClick={() => {
                setEditingUser(null);
                setShowUserModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              New User
            </GameButton>
          }
        />

        <ResourceToolbar
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users by name, email or phone..."
          filters={{
            buttonLabel: "Filters",
            renderContent: (close: () => void) => {
              return (
                <UsersFilterPanel
                  close={close}
                  filterDraft={filterDraft}
                  setFilterDraft={setFilterDraft}
                  handleApplyFilters={handleApplyFilters}
                />
              );
            },
          }}
          sort={{
            buttonLabel: "Sort",
            renderContent: (close: () => void) => {
              return (
                <UsersSortPanel
                  close={close}
                  sortDraft={sortDraft}
                  setSortDraft={setSortDraft}
                  handleApplySort={handleApplySort}
                />
              );
            },
          }}
        />

        <DataTable<User>
          data={users}
          columns={renderUserColumns({
            setUser,
            setShowUserModal,
            setEditingUser,
            handleSuspendUser,
          })}
          keyExtractor={(user) => user.id}
          renderMobileCard={(user) => renderUserMobileCard(user, {
            setUser,
            setShowUserModal,
            setEditingUser,
            handleSuspendUser,
          })}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={limit}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          className="mt-6"
        />
      </div>

      <UserModal
        key={editingUser ? `edit-${editingUser.id}` : "create"}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        initialData={editingUser ?? undefined}
        title={editingUser ? "Edit User" : "Create New User"}
      />

      {user && (
        <DeleteUserModal
          user={user}
          setUser={setUser}
          handleDeleteUser={handleDeleteUser}
          handleUnarchiveUser={handleUnarchiveUser}
        />
      )}
    </>
  );
}
