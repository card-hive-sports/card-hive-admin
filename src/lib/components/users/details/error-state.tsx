import {AlertCircle} from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="glass p-6 rounded-2xl flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <p className="text-white/80">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="self-start bg-[#CEFE10] hover:bg-[#b8e80d] text-black text-sm font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
    >
      Try again
    </button>
  </div>
);
