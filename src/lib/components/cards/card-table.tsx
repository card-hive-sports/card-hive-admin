import Link from 'next/link';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { GameButton } from '../../ui';
import { DataTableColumn, DataTableMobileCardLayout } from '../data';
import type { Card } from '@/lib/types/card';
import { CARD_CONDITION_LABELS, CARD_RARITY_LABELS, formatCardCurrency } from './constants';

interface CardTableActions {
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

const getRarityBadge = (rarity: Card['rarity']) => {
  const label = CARD_RARITY_LABELS[rarity] || rarity;
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70">
      {label}
    </span>
  );
};

export const renderCardColumns = ({
  onEdit,
  onDelete,
}: CardTableActions): DataTableColumn<Card>[] => [
  {
    id: 'card',
    header: 'Card',
    cell: (card) => (
      <div>
        <p className="text-white font-semibold truncate">{card.name}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          {card.playerName || card.serialNumber || '—'}
        </p>
      </div>
    ),
  },
  {
    id: 'pack',
    header: 'Pack',
    cell: (card) => (
      <div>
        <p className="text-white font-semibold text-sm">{card.pack?.name || '—'}</p>
        <p className="text-white/50 text-xs">{card.packId}</p>
      </div>
    ),
  },
  {
    id: 'rarity',
    header: 'Rarity',
    cell: (card) => getRarityBadge(card.rarity),
  },
  {
    id: 'condition',
    header: 'Condition',
    cell: (card) => (
      <span className="text-xs font-semibold text-white/70">
        {card.condition ? CARD_CONDITION_LABELS[card.condition] : 'N/A'}
      </span>
    ),
  },
  {
    id: 'value',
    header: 'Estimated Value',
    cell: (card) => <p className="text-white font-semibold">{formatCardCurrency(card.estimatedValue)}</p>,
  },
  {
    id: 'created',
    header: 'Created',
    cell: (card) => <p className="text-white/60 text-sm">{formatDate(card.createdAt)}</p>,
  },
  {
    id: 'actions',
    header: 'Actions',
    align: 'right',
    headerClassName: 'text-right',
    cellClassName: 'text-right space-y-0',
    cell: (card) => (
      <div className="flex items-center justify-end gap-2">
        <GameButton asChild size="sm" variant="secondary" className="px-3 py-1 normal-case">
          <Link href={`/cards/${card.id}`} className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View
          </Link>
        </GameButton>
        <GameButton
          size="sm"
          variant="secondary"
          className="px-3 py-1 normal-case"
          onClick={() => onEdit(card)}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </GameButton>
        <GameButton
          size="sm"
          variant="danger"
          className="px-3 py-1 normal-case"
          onClick={() => onDelete(card)}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </GameButton>
      </div>
    ),
  },
];

export const renderCardMobileCard = (
  card: Card,
  { onEdit, onDelete }: CardTableActions
) => {
  const badgeLabel = CARD_RARITY_LABELS[card.rarity] || card.rarity;

  const actionButtons = (
    <div className="flex flex-wrap gap-2 w-full">
      <GameButton asChild variant="secondary" size="sm" className="flex-1 normal-case px-3 py-2">
        <Link href={`/cards/${card.id}`} className="flex items-center justify-center gap-1">
          <Eye className="w-4 h-4" />
          View
        </Link>
      </GameButton>
      <GameButton size="sm" variant="secondary" className="normal-case" onClick={() => onEdit(card)}>
        Edit
      </GameButton>
      <GameButton size="sm" variant="danger" className="normal-case" onClick={() => onDelete(card)}>
        Delete
      </GameButton>
    </div>
  );

  return (
    <DataTableMobileCardLayout
      title={card.name}
      subtitle={card.pack?.name}
      badge={{
        label: badgeLabel,
        className: 'bg-white/10 text-white/70',
      }}
      fields={[
        {
          id: `rarity-${card.id}`,
          label: 'Rarity',
          value: badgeLabel,
        },
        {
          id: `condition-${card.id}`,
          label: 'Condition',
          value: card.condition ? CARD_CONDITION_LABELS[card.condition] : 'N/A',
        },
        {
          id: `value-${card.id}`,
          label: 'Value',
          value: formatCardCurrency(card.estimatedValue),
        },
        {
          id: `created-${card.id}`,
          label: 'Created',
          value: formatDate(card.createdAt),
        },
      ]}
      actions={actionButtons}
    />
  );
};
