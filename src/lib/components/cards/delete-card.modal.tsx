import { FC } from 'react';
import { Trash2 } from 'lucide-react';
import type { Card } from '@/lib/types/card';

interface DeleteCardModalProps {
  card: Card;
  setCard: (card: Card | null) => void;
  handleDeleteCard: (card: Card) => void;
}

export const DeleteCardModal: FC<DeleteCardModalProps> = ({
  card,
  setCard,
  handleDeleteCard,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setCard(null)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-white text-xl font-bold">Delete Card</h2>
          </div>
          <p className="text-white/70 mb-6">
            Are you sure you want to delete <strong>{card.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCard(null)}
              className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteCard(card)}
              className="flex-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
