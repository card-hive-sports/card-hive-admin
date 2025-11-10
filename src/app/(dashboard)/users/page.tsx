'use client'

import {useState, useEffect, useCallback} from "react";
import { Plus, Edit2, Trash2, AlertCircle, Eye } from "lucide-react";
import {
  UserFormData,
  UserModal,
  GetUsersParams,
  usersAPI,
  formatCurrency,
  useDebouncedValue,
  User,
  UserRole,
  COMPUTED_STATUS,
  USERS_SORT_OPTIONS,
  SORT_ORDER,
  Pagination,
  PageHeader,
  ResourceToolbar,
  DataTable,
  DataTableColumn,
  GameButton,
} from "@/lib";
import Link from "next/link";
import { toast } from "sonner";
import { showApiError } from "@/lib/utils/show-api-error";
import { AxiosError } from "axios";

type ActiveFiltersState = {
  status: string;
  startDate: string;
  endDate: string;
};

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const initialFiltersState = (): ActiveFiltersState => ({
  status: "",
  startDate: "",
  endDate: "",
});

export default function Users() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<USERS_SORT_OPTIONS>(USERS_SORT_OPTIONS.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.DESC);
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>(() => initialFiltersState());
  const [filterDraft, setFilterDraft] = useState<ActiveFiltersState>(() => initialFiltersState());
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

  const computeStatus = (u: User) => {
    if (u.isDeleted) return "inactive";
    if (!u.isActive) return "suspended";
    return "active";
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-500/20 text-green-400";
    if (status === "suspended") return "bg-yellow-500/20 text-yellow-400";
    return "bg-gray-500/20 text-gray-400";
  };

  const isSuperAdmin = (user: User) => user.role === UserRole.SUPER_ADMIN;

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
      setShowDeleteModal(null);
      toast.success(isPurge ? "User permanently deleted" : "User moved to trash");
    } catch (error) {
      showApiError(isPurge ? 'permanently delete user' : 'delete user', error as AxiosError);
    }
  };

  const handleUnarchiveUser = async (user: User) => {
    try {
      await usersAPI.unarchiveUser(user.id);
      await fetchUsers(search);
      setShowDeleteModal(null);
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

  const userColumns: DataTableColumn<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: (user) => <span className="text-white font-semibold">{user.fullName}</span>,
    },
    {
      id: "email",
      header: "Email",
      cell: (user) => <span className="text-white/70 text-sm">{user.email ?? "-"}</span>,
    },
    {
      id: "wallet",
      header: "Wallet",
      cell: (user) => <span className="text-white font-semibold">{formatCurrency(Number(user.walletBalance))}</span>,
    },
    {
      id: "cards",
      header: "Cards",
      cell: (user) => <span className="text-white text-sm">{user.cardsOwned}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => {
        const status = computeStatus(user);
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => <span className="text-white/70 text-sm">{user.role}</span>,
    },
    {
      id: "joined",
      header: "Joined",
      cell: (user) => (
        <span className="text-white/70 text-sm">
          {new Date(user.createdAt).toISOString().split("T")[0]}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (user) => {
        const superAdmin = isSuperAdmin(user);
        const disabledClasses = superAdmin ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer";

        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/users/${user.id}`}
              className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (superAdmin) return;
                setEditingUser(user);
                setShowUserModal(true);
              }}
              disabled={superAdmin}
              className={`p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
              title={superAdmin ? "Action disabled for Super Admin" : "Edit"}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (superAdmin) return;
                handleSuspendUser(user);
              }}
              disabled={superAdmin}
              className={`p-2 text-white/70 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
              title={
                superAdmin
                  ? "Action disabled for Super Admin"
                  : user.isActive
                  ? "Suspend"
                  : "Unsuspend"
              }
            >
              <AlertCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (superAdmin) return;
                setShowDeleteModal(user);
              }}
              disabled={superAdmin}
              className={`p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
              title={superAdmin ? "Action disabled for Super Admin" : "Delete"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ];

  const renderUserMobileCard = (user: User) => {
    const status = computeStatus(user);
    const superAdmin = isSuperAdmin(user);
    return (
      <>
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg mb-2">{user.fullName}</h3>
          <p className="text-white/60 text-sm mb-3">{user.email ?? "-"}</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-white/50 text-xs">Wallet</p>
              <p className="text-white font-semibold">
                {formatCurrency(Number(user.walletBalance))}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-white/50 text-xs">Cards</p>
              <p className="text-white font-semibold">{user.cardsOwned}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-white/50 text-xs">Status</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <GameButton asChild variant="secondary" size="sm" className="flex-1">
            <Link href={`/users/${user.id}`} className="w-full text-center">
              View
            </Link>
          </GameButton>
          <GameButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={superAdmin}
            onClick={() => {
              if (superAdmin) return;
              setEditingUser(user);
              setShowUserModal(true);
            }}
          >
            Edit
          </GameButton>
          <GameButton
            type="button"
            size="sm"
            variant="danger"
            disabled={superAdmin}
            onClick={() => {
              if (superAdmin) return;
              setShowDeleteModal(user);
            }}
          >
            Delete
          </GameButton>
        </div>
      </>
    );
  };

  const renderFilterPanel = (close: () => void) => (
    <div className="space-y-4">
      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
        <select
          value={filterDraft.status}
          onChange={(e) => setFilterDraft((prev) => ({ ...prev, status: e.target.value }))}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Date range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={filterDraft.startDate}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, startDate: e.target.value }))}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
          />
          <input
            type="date"
            value={filterDraft.endDate}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, endDate: e.target.value }))}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
          />
        </div>
        <p className="text-white/40 text-xs mt-2">Filter by created date.</p>
      </div>
      <GameButton
        size="sm"
        className="w-full"
        onClick={() => {
          handleApplyFilters();
          close();
        }}
      >
        Apply Filters
      </GameButton>
    </div>
  );

  const renderSortPanel = (close: () => void) => (
    <div className="space-y-3">
      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Sort By</label>
        <select
          value={sortDraft.sortBy}
          onChange={(e) =>
            setSortDraft((prev) => ({
              ...prev,
              sortBy: e.target.value as USERS_SORT_OPTIONS,
            }))
          }
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
        >
          <option value={USERS_SORT_OPTIONS.CREATED_AT}>Joined Date</option>
          <option value={USERS_SORT_OPTIONS.FULL_NAME}>Full Name</option>
          <option value={USERS_SORT_OPTIONS.WALLET_BALANCE}>Wallet Balance</option>
          <option value={USERS_SORT_OPTIONS.EMAIL}>Email</option>
          <option value={USERS_SORT_OPTIONS.PHONE}>Phone</option>
        </select>
      </div>
      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Order</label>
        <div className="flex gap-2">
          <GameButton
            type="button"
            size="sm"
            variant={sortDraft.sortOrder === SORT_ORDER.ASC ? "primary" : "secondary"}
            className="flex-1"
            onClick={() =>
              setSortDraft((prev) => ({
                ...prev,
                sortOrder: SORT_ORDER.ASC,
              }))
            }
          >
            Asc
          </GameButton>
          <GameButton
            type="button"
            size="sm"
            variant={sortDraft.sortOrder === SORT_ORDER.DESC ? "primary" : "secondary"}
            className="flex-1"
            onClick={() =>
              setSortDraft((prev) => ({
                ...prev,
                sortOrder: SORT_ORDER.DESC,
              }))
            }
          >
            Desc
          </GameButton>
        </div>
      </div>
      <GameButton
        size="sm"
        className="w-full"
        onClick={() => {
          handleApplySort();
          close();
        }}
      >
        Apply Sort
      </GameButton>
    </div>
  );

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
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

        {/* Search and Controls */}
        <ResourceToolbar
          searchValue={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users by name, email or phone..."
          filters={{
            buttonLabel: "Filters",
            renderContent: renderFilterPanel,
          }}
          sort={{
            buttonLabel: "Sort",
            renderContent: renderSortPanel,
          }}
        />

        <DataTable<User>
          data={users}
          columns={userColumns}
          keyExtractor={(user) => user.id}
          renderMobileCard={(user) => renderUserMobileCard(user)}
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

      {/* Modals */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-white text-xl font-bold">Delete User</h2>
              </div>

              <p className="text-white/70 mb-6">
                How would you like to delete <strong>{showDeleteModal.fullName}</strong>?
              </p>

              <div className="space-y-3 mb-6">
                {!showDeleteModal.isDeleted ? (
                  <button
                    onClick={() => handleDeleteUser(showDeleteModal, false)}
                    className="w-full text-left p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors cursor-pointer"
                  >
                    <p className="text-yellow-400 font-semibold">Soft Delete (Archive)</p>
                    <p className="text-yellow-400/70 text-sm">User will be marked as inactive but data remains</p>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnarchiveUser(showDeleteModal)}
                    className="w-full text-left p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors cursor-pointer"
                  >
                    <p className="text-green-400 font-semibold">Unarchive User</p>
                    <p className="text-green-400/70 text-sm">Restore access for this archived user</p>
                  </button>
                )}

                <button
                  onClick={() => handleDeleteUser(showDeleteModal, true)}
                  className="w-full text-left p-4 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                >
                  <p className="text-red-400 font-semibold">Purge (Permanent Delete)</p>
                  <p className="text-red-400/70 text-sm">User and all data will be permanently removed</p>
                </button>
              </div>

              <button
                onClick={() => setShowDeleteModal(null)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
