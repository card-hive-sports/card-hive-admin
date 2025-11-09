import {LucideIcon} from "lucide-react";
import {Skeleton} from "../../ui/skeleton";

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
  <div className="glass p-6 rounded-2xl">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white text-lg font-semibold">Account Information</h3>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClassName}`}>
        {statusLabel}
      </span>
    </div>

    <div className="space-y-4">
      {infoRows.map(({ Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#CEFE10]" />
          <div>
            <p className="text-white/60 text-sm">{label}</p>
            <p className="text-white font-semibold break-all">{value}</p>
          </div>
        </div>
      ))}

      <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">User ID</span>
          <span className="text-white font-semibold">#{userId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">Last Login</span>
          {isLastLoginLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="text-white font-semibold">{lastLogin}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);
