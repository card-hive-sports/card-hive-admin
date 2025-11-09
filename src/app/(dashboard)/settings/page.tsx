'use client'

import {useCallback, useEffect, useState} from "react";
import {
  authAPI,
  AuthProvider,
  AuthResponse,
  LoginActivity,
  PageHeader,
  ResourceToolbar,
  Skeleton,
  SkeletonText,
  usersAPI,
  Pagination,
  firstLetterToUpper
} from "@/lib";
import {AlertCircle, Mail, Phone, ShieldCheck, UserCircle2} from "lucide-react";

const providerLabelMap: Record<AuthProvider, string> = {
  [AuthProvider.GOOGLE]: "Google",
  [AuthProvider.APPLE]: "Apple",
  [AuthProvider.EMAIL]: "Email",
  [AuthProvider.PHONE]: "Phone",
};

const ACTIVITY_PAGE_LIMIT = 5;

const Settings = () => {
  const [profile, setProfile] = useState<AuthResponse['user'] | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    limit: ACTIVITY_PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await authAPI.getProfile();
      setProfile(response);
    } catch {
      setProfileError("Unable to load profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async (profileId: string, page = 1) => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      const response = await usersAPI.getUserLoginActivities(profileId, {
        page,
        limit: ACTIVITY_PAGE_LIMIT,
      });
      setActivities(response.data);
      setActivityPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });
    } catch {
      setActivitiesError("Unable to load login activity.");
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  const handleActivityPageChange = (nextPage: number) => {
    if (!profile) return;
    if (nextPage === activityPagination.page || nextPage < 1 || nextPage > activityPagination.totalPages) {
      return;
    }
    fetchActivities(profile.id, nextPage);
  };

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const formData = new FormData(event.currentTarget);

    try {
      await usersAPI.updateUser(profile.id, {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
      });
      fetchProfile();
    } catch {
      setProfileError("Failed to update profile. Please try again.");
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      activity.deviceType?.toLowerCase().includes(term) ||
      activity.platform?.toLowerCase().includes(term) ||
      activity.browser?.toLowerCase().includes(term) ||
      providerLabelMap[activity.loginMethod].toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      fetchActivities(profile.id, 1);
    }
  }, [profile, fetchActivities]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your admin profile and security settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <UserCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Profile Details</h3>
              <p className="text-white/60 text-sm">Update your personal information</p>
            </div>
          </div>

          {profileLoading ? (
            <ProfileSkeleton />
          ) : profileError ? (
            <InlineError message={profileError} onRetry={fetchProfile} />
          ) : profile ? (
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  defaultValue={profile.fullName}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                <div className="flex items-center gap-3 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <Mail className="w-4 h-4 text-white/60" />
                  <input
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    className="flex-1 bg-transparent border-0 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Phone Number</label>
                <div className="flex items-center gap-3 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <Phone className="w-4 h-4 text-white/60" />
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone ?? ""}
                    placeholder="+1 (555) 123-4567"
                    className="flex-1 bg-transparent border-0 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white/70 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#CEFE10]" />
                <div>
                  <p className="text-white font-semibold text-sm">Role</p>
                  <p className="text-white/70 text-xs">{profile.role}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={fetchProfile}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          ) : null}
        </section>

        <section className="glass p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">Recent Login Activity</h3>
            <p className="text-white/60 text-sm">Monitor and secure your account access</p>
          </div>

          <ResourceToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by device, platform, or method..."
          />

          {activitiesLoading && !activities.length ? (
            <ActivitySkeleton />
          ) : activitiesError ? (
            <InlineError
              message={activitiesError}
              onRetry={() => {
                if (profile) {
                  fetchActivities(profile.id, activityPagination.page);
                } else {
                  fetchProfile();
                }
              }}
            />
          ) : filteredActivities.length ? (
            <div className="space-y-3">
              {filteredActivities.map((activity) => {
                const providerLabel = providerLabelMap[activity.loginMethod];
                const statusClass = activity.success
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400";
                const {
                  deviceType = 'Unknown',
                  platform = 'Unknown',
                } = activity;
                return (
                  <div key={activity.id} className="p-4 bg-black/30 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {`${platform} ${firstLetterToUpper(deviceType ?? 'unknown')}`}
                        </p>
                        <p className="text-white/60 text-xs">
                          {new Date(activity.loginAt).toLocaleString()}
                          {activity.ipAddress ? ` • ${activity.ipAddress}` : ""}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                        {activity.success ? "Success" : "Failed"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-white/60 text-xs">
                      <span>{activity.browser || "Unknown browser"}</span>
                      <span>{providerLabel}</span>
                    </div>
                    {activity.failureReason && !activity.success && (
                      <p className="text-red-300 text-xs mt-2">{activity.failureReason}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No login activities found for this account." />
          )}

          {activityPagination.total > 0 && (
            <Pagination
              page={activityPagination.page}
              totalPages={activityPagination.totalPages}
              totalItems={activityPagination.total}
              pageSize={activityPagination.limit}
              onPageChange={handleActivityPageChange}
              isLoading={activitiesLoading}
              className="pt-2"
            />
          )}
        </section>
      </div>

      <section className="glass p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">Security Tips</h3>
          <p className="text-white/60 text-sm">Keep your admin account secure</p>
        </div>
        <ul className="space-y-3 text-white/70 text-sm">
          <li>• Use a strong and unique password for your admin account.</li>
          <li>• Enable two-factor authentication whenever possible.</li>
          <li>• Review login history regularly to detect suspicious activity.</li>
          <li>• Avoid sharing login credentials with other team members.</li>
        </ul>
      </section>
    </div>
  );
}

export default Settings;

const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-14 w-full" />
    <div className="flex gap-3">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-10 w-1/2" />
    </div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <SkeletonText lines={2} />
      </div>
    ))}
  </div>
);

const InlineError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-3">
    <div className="flex items-center gap-2 text-red-200">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">{message}</span>
    </div>
    <button
      onClick={onRetry}
      className="text-red-100 text-sm font-semibold underline cursor-pointer"
    >
      Retry
    </button>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
      <ShieldCheck className="w-6 h-6 text-white/60" />
    </div>
    <p className="text-white/70 text-sm">{message}</p>
  </div>
);
