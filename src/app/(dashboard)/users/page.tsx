'use client'

import { useState, useMemo } from "react";
import { Search, Plus, Filter, ArrowUpDown, Edit2, Trash2, AlertCircle, Eye } from "lucide-react";
import { DashboardUser, UserFormData, UserRole, KYCStatus, UserModal } from "@/lib";
import Link from "next/link";

const INITIAL_USERS: DashboardUser[] = [
  {
    id: "u_1",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: new Date("1990-05-12"),
    role: UserRole.CUSTOMER,
    kycStatus: KYCStatus.VERIFIED,
    isActive: true,
    isDeleted: false,
    passwordHash: null,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
    wallet: "$1,250.00",
    cardsOwned: 42,
    createdAtStr: "2024-01-15",
  },
  {
    id: "u_2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: new Date("1988-09-03"),
    role: UserRole.CUSTOMER,
    kycStatus: KYCStatus.PENDING,
    isActive: true,
    isDeleted: false,
    passwordHash: null,
    createdAt: new Date("2024-01-20T09:30:00Z"),
    updatedAt: new Date("2024-01-20T09:30:00Z"),
    wallet: "$3,800.00",
    cardsOwned: 156,
    createdAtStr: "2024-01-20",
  },
  {
    id: "u_3",
    fullName: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: new Date("1995-02-01"),
    role: UserRole.CUSTOMER,
    kycStatus: KYCStatus.REJECTED,
    isActive: false, // suspended-ish
    isDeleted: false,
    passwordHash: null,
    createdAt: new Date("2024-02-01T08:15:00Z"),
    updatedAt: new Date("2024-02-10T08:15:00Z"),
    wallet: "$850.00",
    cardsOwned: 28,
    createdAtStr: "2024-02-01",
  },
  {
    id: "u_4",
    fullName: "Alice Brown",
    email: "alice@example.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: new Date("1992-11-11"),
    role: UserRole.ADMIN,
    kycStatus: KYCStatus.VERIFIED,
    isActive: true,
    isDeleted: false,
    passwordHash: null,
    createdAt: new Date("2024-02-10T11:00:00Z"),
    updatedAt: new Date("2024-02-12T11:00:00Z"),
    wallet: "$5,200.00",
    cardsOwned: 203,
    createdAtStr: "2024-02-10",
  },
  {
    id: "u_5",
    fullName: "Charlie Wilson",
    email: "charlie@example.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: new Date("1985-07-01"),
    role: UserRole.SUPER_ADMIN,
    kycStatus: KYCStatus.VERIFIED,
    isActive: true,
    isDeleted: false,
    passwordHash: null,
    createdAt: new Date("2024-03-01T12:00:00Z"),
    updatedAt: new Date("2024-03-01T12:00:00Z"),
    wallet: "$2,150.00",
    cardsOwned: 87,
    createdAtStr: "2024-03-01",
  },
];

export default function Users() {
  const [users, setUsers] = useState<DashboardUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<DashboardUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<"fullName" | "createdAt" | "wallet">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({ status: "" });

  const computeStatus = (u: DashboardUser) => {
    if (u.isDeleted) return "inactive";
    if (!u.isActive) return "suspended";
    return "active";
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-500/20 text-green-400";
    if (status === "suspended") return "bg-yellow-500/20 text-yellow-400";
    return "bg-gray-500/20 text-gray-400";
  };

  const parseWalletToNumber = (wallet: string) => {
    // "$1,250.00" -> 1250
    return Number(wallet.replace(/[^0-9.-]+/g, ""));
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((user) =>
        (user.fullName || "").toLowerCase().includes(q) ||
        (user.email || "").toLowerCase().includes(q) ||
        (user.phone || "").toLowerCase().includes(q)
      );
    }

    // filter by status (active | suspended | inactive)
    const statusFilter = activeFilters.status || "";
    if (statusFilter) {
      result = result.filter((u) => computeStatus(u) === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "fullName") {
        const aVal = (a.fullName || "").toLowerCase();
        const bVal = (b.fullName || "").toLowerCase();
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      if (sortBy === "createdAt") {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        if (aTime < bTime) return sortOrder === "asc" ? -1 : 1;
        if (aTime > bTime) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      // wallet
      const aNum = parseWalletToNumber(a.wallet || "");
      const bNum = parseWalletToNumber(b.wallet || "");
      if (aNum < bNum) return sortOrder === "asc" ? -1 : 1;
      if (aNum > bNum) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, activeFilters, sortBy, sortOrder]);

  const handleCreateUser = (formData: UserFormData) => {
    // UserFormData from your lib currently has { name, email, phone, wallet, status }
    // map name -> fullName; map status -> isActive/isDeleted semantics
    const newUser: DashboardUser = {
      id: `u_${Math.max(...users.map((u) => Number(u.id.split('_')[1] || 0)), 0) + 1}`,
      fullName: formData.fullName ?? "Unnamed",
      email: formData.email ?? null,
      phone: formData.phone ?? null,
      dateOfBirth: new Date(), // placeholder
      role: UserRole.CUSTOMER,
      kycStatus: KYCStatus.PENDING,
      isActive: formData.status !== "inactive",
      isDeleted: formData.status === "inactive",
      passwordHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      wallet: formData.wallet ?? "$0.00",
      cardsOwned: 0,
      createdAtStr: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setShowUserModal(false);
  };

  const handleEditUser = (formData: UserFormData) => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
            ...u,
            fullName: formData.fullName ?? u.fullName,
            email: formData.email ?? u.email,
            phone: formData.phone ?? u.phone,
            wallet: formData.wallet ?? u.wallet,
            isActive: formData.status !== "inactive",
            isDeleted: formData.status === "inactive",
            updatedAt: new Date(),
          }
          : u
      )
    );
    setEditingUser(null);
    setShowUserModal(false);
  };

  const handleDeleteUser = (user: DashboardUser, isPurge: boolean) => {
    if (isPurge) {
      setUsers(users.filter((u) => u.id !== user.id));
    } else {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isDeleted: true, isActive: false } : u)));
    }
    setShowDeleteModal(null);
  };

  const handleSuspendUser = (user: DashboardUser) => {
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, isActive: user.isActive ? false : true, updatedAt: new Date() } : u
      )
    );
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">Users</h2>
            <p className="text-white/60">Manage platform users and their accounts</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
            }}
            className="flex items-center gap-2 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            New User
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
                placeholder="Search users by name, email or phone..."
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
                    <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                    <select
                      value={activeFilters.status || ""}
                      onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="">All</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/60 text-xs">More filter options coming soon</p>
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
                      onChange={(e) => setSortBy(e.target.value as "fullName" | "createdAt" | "wallet")}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                    >
                      <option value="fullName">Name</option>
                      <option value="createdAt">Join Date</option>
                      <option value="wallet">Wallet</option>
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
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Name</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Email</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Wallet</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Cards</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Status</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Role</th>
                <th className="text-left px-6 py-4 text-white/70 font-semibold text-sm">Joined</th>
                <th className="text-right px-6 py-4 text-white/70 font-semibold text-sm">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredAndSortedUsers.map((user) => {
                const status = computeStatus(user);
                return (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-semibold">{user.fullName}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{user.email ?? "-"}</td>
                    <td className="px-6 py-4 text-white font-semibold">{user.wallet}</td>
                    <td className="px-6 py-4 text-white text-sm">{user.cardsOwned}</td>
                    <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{user.role}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{user.createdAtStr ?? new Date(user.createdAt).toISOString().split('T')[0]}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/users/${user.id}`}
                          className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(user)}
                          className="p-2 text-white/70 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                          title={user.isActive ? "Suspend" : "Unsuspend"}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(user)}
                          className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredAndSortedUsers.map((user) => {
            const status = computeStatus(user);
            return (
              <div key={user.id} className="glass p-4 rounded-2xl">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg mb-2">{user.fullName}</h3>
                  <p className="text-white/60 text-sm mb-3">{user.email ?? "-"}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-white/50 text-xs">Wallet</p>
                      <p className="text-white font-semibold">{user.wallet}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Cards</p>
                      <p className="text-white font-semibold">{user.cardsOwned}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowUserModal(true);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(user)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <UserModal
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
                <button
                  onClick={() => handleDeleteUser(showDeleteModal, false)}
                  className="w-full text-left p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                  <p className="text-yellow-400 font-semibold">Soft Delete (Archive)</p>
                  <p className="text-yellow-400/70 text-sm">User will be marked as inactive but data remains</p>
                </button>

                <button
                  onClick={() => handleDeleteUser(showDeleteModal, true)}
                  className="w-full text-left p-4 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <p className="text-red-400 font-semibold">Purge (Permanent Delete)</p>
                  <p className="text-red-400/70 text-sm">User and all data will be permanently removed</p>
                </button>
              </div>

              <button
                onClick={() => setShowDeleteModal(null)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
