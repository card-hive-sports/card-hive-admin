import {LucideIcon} from "lucide-react";
import {Skeleton} from "../../ui/skeleton";
import {GameCard} from "@/lib/ui";

export interface InfoRow {
  Icon: LucideIcon;
  label: string;
  value: string;
}

interface AccountInfoCardProps {
  infoRows: InfoRow[];
  statusLabel: string;
  statusClassName: string;
  userId: string;
  lastLogin: string;
  isLastLoginLoading: boolean;
}

export const AccountInfoCard = ({
  infoRows,
  statusLabel,
  statusClassName,
  userId,
  lastLogin,
  isLastLoginLoading,
}: AccountInfoCardProps) => (
  <GameCard className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-white text-lg font-semibold">Account Information</h3>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClassName} bg-white/5 border border-white/10`}
      >
        {statusLabel}
      </span>
    </div>

    <div className="space-y-4">
      {infoRows.map(({ Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
        >
          <Icon className="w-5 h-5 text-[#CEFE10]" />
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-white font-semibold break-all">{value}</p>
          </div>
        </div>
      ))}

      <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">User ID</span>
          <span className="text-white font-semibold">#{userId}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Last Login</span>
          {isLastLoginLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="text-white font-semibold">{lastLogin}</span>
          )}
        </div>
      </div>
    </div>
  </GameCard>
);
