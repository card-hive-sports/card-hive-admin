import Link from "next/link";
import { GameButton } from "../../ui";
import { DataTableColumn, DataTableMobileCardLayout } from "../data";
import { User, UserRole } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { formatCurrency } from "../../utils";

export const computeStatus = (u: User) => {
  if (u.isDeleted) return "inactive";
  if (!u.isActive) return "suspended";
  return "active";
};

export const getStatusColor = (status: string) => {
  if (status === "active") return "bg-green-500/20 text-green-400";
  if (status === "suspended") return "bg-yellow-500/20 text-yellow-400";
  return "bg-gray-500/20 text-gray-400";
};

export const isSuperAdmin = (user: User) => user.role === UserRole.SUPER_ADMIN;

interface IProps {
  setUser: Dispatch<SetStateAction<User | null>>;
  setEditingUser: Dispatch<SetStateAction<User | null>>;
  setShowUserModal: Dispatch<SetStateAction<boolean>>;
  handleSuspendUser: (user: User) => void;
}

export const renderUserMobileCard = (
  user: User,
  {
    setUser,
    setEditingUser,
    setShowUserModal,
  }: IProps) => {
  const status = computeStatus(user);
  const superAdmin = isSuperAdmin(user);
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const actionButtons = (
    <div className="flex flex-wrap gap-2 w-full">
      <GameButton asChild variant="secondary" size="sm" className="flex-1 normal-case px-3 py-2">
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
        &nbsp; Edit &nbsp;
      </GameButton>
      <GameButton
        size="sm"
        variant="danger"
        disabled={superAdmin}
        onClick={() => {
          if (superAdmin) return;
          setUser(user);
        }}
      >
        Delete
      </GameButton>
    </div>
  );

  return (
    <DataTableMobileCardLayout
      title={user.fullName}
      subtitle={user.email ?? "-"}
      badge={{ label: statusLabel, className: getStatusColor(status) }}
      fields={[
        {
          id: `wallet-${user.id}`,
          label: "Wallet",
          value: formatCurrency(Number(user.walletBalance)),
        },
        {
          id: `cards-${user.id}`,
          label: "Cards",
          value: user.cardsOwned,
        },
        {
          id: `status-field-${user.id}`,
          label: "Status",
          value: (
            <span
              className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
            >
              {statusLabel}
            </span>
          ),
          span: 2,
        },
      ]}
      actions={actionButtons}
    />
  );
};

export const renderUserColumns = ({
  setUser,
  setShowUserModal,
  setEditingUser,
  handleSuspendUser,
}: IProps): DataTableColumn<User>[] => [
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
          <GameButton
            variant="secondary"
            className="p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors"
            title="View"
          >
            <Link href={`/users/${user.id}`}>VIEW</Link>
          </GameButton>
          <GameButton
            type="button"
            variant="secondary"
            onClick={() => {
              if (superAdmin) return;
              setEditingUser(user);
              setShowUserModal(true);
            }}
            disabled={superAdmin}
            className={`p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
            title={superAdmin ? "Action disabled for Super Admin" : "Edit"}
          >
            EDIT
          </GameButton>
          <GameButton
            type="button"
            variant="secondary"
            onClick={() => {
              if (superAdmin) return;
              handleSuspendUser(user);
            }}
            disabled={superAdmin}
            className={`p-2 text-white/70 hover:text-[#CEFE10] hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
            title={
              superAdmin
                ? "Action disabled for Super Admin"
                : user.isActive
                ? "Suspend"
                : "Unsuspend"
            }
          >
            {user.isActive
                ? "Suspend"
                : "Unsuspend"}
          </GameButton>
          <GameButton
            type="button"
            variant="danger"
            onClick={() => {
              if (superAdmin) return;
              setUser(user);
            }}
            disabled={superAdmin}
            className={`p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors ${disabledClasses}`}
            title={superAdmin ? "Action disabled for Super Admin" : "Delete"}
          >
            DELETE
          </GameButton>
        </div>
      );
    },
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
];
