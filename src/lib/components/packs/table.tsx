import Link from "next/link";
import { Edit2, Trash2, Eye } from "lucide-react";
import { GameButton } from "../../ui";
import { DataTableColumn, DataTableMobileCardLayout } from "../data";
import type { Pack } from "@/lib/types/pack";
import { packTypeLabels, sportTypeLabels, formatPackCurrency } from "./constants";

interface PackTableActions {
  onEdit: (pack: Pack) => void;
  onDelete: (pack: Pack) => void;
}

export const renderPackColumns = ({
  onEdit,
  onDelete,
}: PackTableActions): DataTableColumn<Pack>[] => [
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
    cell: (pack) => <p className="text-white font-semibold">{formatPackCurrency(pack.price)}</p>,
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
        <GameButton asChild size="sm" variant="secondary" className="px-3 py-1 normal-case">
          <Link href={`/packs/${pack.id}`} className="flex items-center gap-1">
            View
          </Link>
        </GameButton>
        <GameButton
          size="sm"
          variant="secondary"
          className="px-3 py-1 normal-case"
          onClick={() => onEdit(pack)}
        >
          Edit
        </GameButton>
        <GameButton
          size="sm"
          variant="danger"
          className="px-3 py-1 normal-case"
          onClick={() => onDelete(pack)}
        >
          Delete
        </GameButton>
      </div>
    ),
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
];

export const renderPackMobileCard = (
  pack: Pack,
  { onEdit, onDelete }: PackTableActions
) => {
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
        className="normal-case"
        onClick={() => onEdit(pack)}
      >
        &nbsp; Edit &nbsp;
      </GameButton>
      <GameButton
        size="sm"
        variant="danger"
        className="normal-case"
        onClick={() => onDelete(pack)}
      >
        Delete
      </GameButton>
    </div>
  );

  return (
    <DataTableMobileCardLayout
      title={packTypeLabels[pack.packType]}
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
          value: formatPackCurrency(pack.price),
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
