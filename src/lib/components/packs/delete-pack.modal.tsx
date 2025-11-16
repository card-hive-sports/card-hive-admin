import { Dispatch, FC, SetStateAction } from "react";
import { Pack } from "../../types";
import { Trash2 } from "lucide-react";

interface IProps {
  pack: Pack
  setPack: Dispatch<SetStateAction<Pack | null>>;
  handleDeletePack: (pack: Pack) => void;
}

export const DeletePackModal: FC<IProps> = ({
  pack,
  setPack,
  handleDeletePack,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setPack(null)} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-white text-xl font-bold">Delete Pack</h2>
          </div>

          <p className="text-white/70 mb-6">
            Are you sure you want to delete <strong>{pack.packType} ({pack.sportType})</strong>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setPack(null)}
              className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeletePack(pack)}
              className="flex-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}