import { User } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";


interface IProps {
    user: User;
    setUser: Dispatch<SetStateAction<User | null>>;
    handleDeleteUser: (user: User, hard: boolean) => void;
    handleUnarchiveUser: (user: User) => void;
}

export const DeleteUserModal: FC<IProps> = ({
    user,
    setUser,
    handleDeleteUser,
    handleUnarchiveUser
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setUser(null)} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-white text-xl font-bold">Delete User</h2>
          </div>

          <p className="text-white/70 mb-6">
          How would you like to delete <strong>{user.fullName}</strong>?
          </p>

          <div className="space-y-3 mb-6">
            {!user.isDeleted ? (
              <button
              onClick={() => handleDeleteUser(user, false)}
              className="w-full text-left p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors cursor-pointer"
              >
                  <p className="text-yellow-400 font-semibold">Soft Delete (Archive)</p>
                  <p className="text-yellow-400/70 text-sm">User will be marked as inactive but data remains</p>
              </button>
            ) : (
              <button
                onClick={() => handleUnarchiveUser(user)}
                className="w-full text-left p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors cursor-pointer"
              >
                <p className="text-green-400 font-semibold">Unarchive User</p>
                <p className="text-green-400/70 text-sm">Restore access for this archived user</p>
              </button>
            )}

            <button
              onClick={() => handleDeleteUser(user, true)}
              className="w-full text-left p-4 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              <p className="text-red-400 font-semibold">Purge (Permanent Delete)</p>
              <p className="text-red-400/70 text-sm">User and all data will be permanently removed</p>
            </button>
          </div>

          <button
            onClick={() => setUser(null)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
