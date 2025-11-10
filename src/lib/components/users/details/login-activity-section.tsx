import {AlertCircle} from "lucide-react";
import {Pagination} from "../../pagination";
import {LoginActivitySkeleton} from "./skeletons";
import {GameCard, GameButton} from "@/lib/ui";

export interface LoginActivityDisplay {
  id: string;
  deviceLabel: string;
  timestamp: string;
  ipAddress?: string | null;
  failureReason?: string | null;
  success: boolean;
  statusClassName: string;
  providerLabel: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LoginActivitySectionProps {
  activities: LoginActivityDisplay[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export const LoginActivitySection = ({
  activities,
  isLoading,
  error,
  pagination,
  onPageChange,
  onRetry,
}: LoginActivitySectionProps) => {
  if (error && activities.length === 0) {
    return (
      <GameCard className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-white/80">{error}</p>
        </div>
        <GameButton onClick={onRetry} size="sm" className="self-start">
          Try again
        </GameButton>
      </GameCard>
    );
  }

  if (isLoading && activities.length === 0) {
    return <LoginActivitySkeleton />;
  }

  return (
    <GameCard className="p-6 space-y-4">
      <h3 className="text-white text-lg font-semibold">Recent Login Activity</h3>

      {activities.length ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 gap-4 transition-all duration-200 ${
                isLoading ? "opacity-70" : "hover:border-[#CEFE10]/40 hover:shadow-[0_10px_25px_rgba(206,254,16,0.2)]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{activity.deviceLabel}</p>
                <p className="text-white/60 text-xs">
                  {activity.timestamp}
                  {activity.ipAddress ? ` • ${activity.ipAddress}` : ""}
                </p>
                {activity.failureReason && !activity.success && (
                  <p className="text-red-300 text-xs mt-1 truncate">{activity.failureReason}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.statusClassName}`}>
                  {activity.success ? "Success" : "Failed"}
                </span>
                <p className="text-white/60 text-xs mt-1">{activity.providerLabel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/60 text-sm">No login activity recorded.</p>
      )}

      {pagination.total > 0 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={onPageChange}
          isLoading={isLoading}
          className="pt-2"
        />
      )}

      {error && activities.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-yellow-200 text-sm">
          <span>{error}</span>
          <GameButton
            size="sm"
            variant="ghost"
            onClick={onRetry}
            disabled={isLoading}
            className="text-yellow-100 uppercase tracking-wide"
          >
            Retry
          </GameButton>
        </div>
      )}
    </GameCard>
  );
};
