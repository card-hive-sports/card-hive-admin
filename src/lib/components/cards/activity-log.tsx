import { Activity, Plus, Edit2, Trash2, Eye, Check } from "lucide-react";

export interface ActivityLogEntry {
  id: string;
  type: "create" | "update" | "delete" | "publish" | "draft" | "view";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  maxHeight?: string;
}

const activityIcons: Record<string, React.ReactNode> = {
  create: <Plus className="w-4 h-4" />,
  update: <Edit2 className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  publish: <Check className="w-4 h-4" />,
  draft: <Edit2 className="w-4 h-4" />,
  view: <Eye className="w-4 h-4" />,
};

const activityColors: Record<string, string> = {
  create: "bg-green-500/20 text-green-400",
  update: "bg-blue-500/20 text-blue-400",
  delete: "bg-red-500/20 text-red-400",
  publish: "bg-[#CEFE10]/20 text-[#CEFE10]",
  draft: "bg-yellow-500/20 text-yellow-400",
  view: "bg-white/10 text-white/70",
};

export const ActivityLog = ({ entries, maxHeight = "max-h-96" }: ActivityLogProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-[#CEFE10]" />
        <h3 className="text-white text-lg font-bold">Activity Log</h3>
      </div>

      <div className={`overflow-y-auto ${maxHeight}`}>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No activities yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index !== entries.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                )}

                {/* Activity item */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activityColors[entry.type]}`}>
                    {activityIcons[entry.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{entry.title}</p>
                        <p className="text-white/60 text-xs mt-1">{entry.description}</p>
                        {entry.user && (
                          <p className="text-white/40 text-xs mt-2">by {entry.user}</p>
                        )}
                      </div>
                      <span className="text-white/50 text-xs whitespace-nowrap ml-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
