import {AlertCircle} from "lucide-react";
import {GameCard, GameButton} from "@/lib/ui";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <GameCard className="p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <p className="text-white/80">{message}</p>
    </div>
    <GameButton onClick={onRetry} size="sm" className="self-start">
      Try again
    </GameButton>
  </GameCard>
);
