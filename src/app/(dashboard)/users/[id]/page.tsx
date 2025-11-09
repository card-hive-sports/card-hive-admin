'use client'

import {useCallback, useEffect, useMemo, useState} from "react";
import {ArrowLeft, Calendar, Mail, Phone, Wallet} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {
  AccountInfoCard,
  AccountMetricsCard,
  AuthProvider,
  ErrorState,
  KYCStatus,
  LoginActivity,
  LoginActivityDisplay,
  LoginActivitySection,
  LoginMethodsCard,
  ProviderChip,
  Skeleton,
  UserDetailSkeleton,
  User,
  computeUserStatus,
  formatCurrency,
  usersAPI,
  firstLetterToUpper
} from "@/lib";

const LOGIN_PAGE_LIMIT = 5;

const statusBadgeClass = (status?: string | null) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400";
    case "suspended":
      return "bg-yellow-500/20 text-yellow-400";
    case "inactive":
      return "bg-gray-500/20 text-gray-400";
    default:
      return "bg-white/10 text-white/70";
  }
};

const kycStatusClass = (status?: KYCStatus) => {
  switch (status) {
    case KYCStatus.VERIFIED:
      return "text-green-400";
    case KYCStatus.PENDING:
      return "text-yellow-400";
    case KYCStatus.REJECTED:
      return "text-red-400";
    default:
      return "text-white/70";
  }
};

const providerLabelMap: Record<AuthProvider, string> = {
  [AuthProvider.GOOGLE]: "Google",
  [AuthProvider.APPLE]: "Apple",
  [AuthProvider.EMAIL]: "Email",
  [AuthProvider.PHONE]: "Phone",
};

const providerColorMap: Record<AuthProvider, string> = {
  [AuthProvider.GOOGLE]: "bg-red-500/15 text-red-200",
  [AuthProvider.APPLE]: "bg-white/15 text-white",
  [AuthProvider.EMAIL]: "bg-blue-500/15 text-blue-200",
  [AuthProvider.PHONE]: "bg-emerald-500/15 text-emerald-200",
};

const getProviderMeta = (provider?: AuthProvider) => {
  if (!provider) {
    return {
      label: "Unknown",
      className: "bg-white/10 text-white/70",
    };
  }

  return {
    label: providerLabelMap[provider] ?? provider,
    className: providerColorMap[provider] ?? "bg-white/10 text-white/70",
  };
};

const formatDateValue = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTimeValue = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLabel = (value?: string | null) => {
  if (!value) return "Unknown";
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const UserDetail = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userID = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [loginPagination, setLoginPagination] = useState<PaginationState>({
    page: 1,
    limit: LOGIN_PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [loginLoading, setLoginLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isInitialLoading = isLoading && !user;

  const fetchUser = useCallback(async () => {
    if (!userID) {
      setError("User ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await usersAPI.getUserByID(userID);
      setUser(response);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setError("Unable to load user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userID]);

  const fetchLoginActivities = useCallback(async (page = 1, limit = LOGIN_PAGE_LIMIT) => {
    if (!userID) return;

    setLoginLoading(true);
    setLoginError(null);
    try {
      const response = await usersAPI.getUserLoginActivities(userID, { page, limit });
      setLoginActivities(response.data);
      setLoginPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });
    } catch (err) {
      console.error("Failed to fetch login activities:", err);
      setLoginError("Unable to load login activity. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }, [userID]);

  const handleLoginPageChange = useCallback(
    (nextPage: number) => {
      if (nextPage === loginPagination.page) return;
      fetchLoginActivities(nextPage, loginPagination.limit);
    },
    [fetchLoginActivities, loginPagination.page, loginPagination.limit]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchLoginActivities(1, LOGIN_PAGE_LIMIT);
  }, [fetchLoginActivities]);

  const accountStatus = user ? computeUserStatus(user.isActive, user.isDeleted) : null;
  const walletBalance = formatCurrency(Number(user?.walletBalance ?? 0));
  const walletCurrency = user?.walletCurrency?.toUpperCase() ?? "USD";
  const joinedDate = formatDateValue(user?.createdAt);
  const updatedAt = formatDateTimeValue(user?.updatedAt);
  const kycStatusValue = user?.kycStatus ?? KYCStatus.PENDING;

  const infoRows = useMemo(
    () => [
      { Icon: Mail, label: "Email", value: user?.email ?? "Not provided" },
      { Icon: Phone, label: "Phone", value: user?.phone ?? "Not provided" },
      { Icon: Calendar, label: "Joined", value: joinedDate },
      { Icon: Wallet, label: "Last Updated", value: updatedAt },
    ],
    [user, joinedDate, updatedAt]
  );

  const stats = useMemo(
    () => [
      {
        label: "Wallet Balance",
        value: walletBalance,
        helper: walletCurrency,
      },
      {
        label: "Cards Owned",
        value: (user?.cardsOwned ?? 0).toLocaleString(),
        helper: "Across all collections",
      },
      {
        label: "KYC Status",
        value: formatLabel(kycStatusValue),
        helper: kycStatusValue === KYCStatus.VERIFIED ? "Compliant" : "Needs attention",
        accent: kycStatusClass(kycStatusValue),
      },
      {
        label: "Role",
        value: formatLabel(user?.role),
        helper: "Access level",
      },
    ],
    [walletBalance, walletCurrency, user, kycStatusValue]
  );

  const providerChips = useMemo<ProviderChip[]>(() => {
    if (!user?.authProviders) return [];
    return user.authProviders.map((providerLink) => {
      const meta = getProviderMeta(providerLink.provider);
      return {
        id: providerLink.id,
        label: meta.label,
        className: meta.className,
      };
    });
  }, [user?.authProviders]);

  const activityDisplayData = useMemo<LoginActivityDisplay[]>(() => {
    return loginActivities.map((activity) => {
      const meta = getProviderMeta(activity.loginMethod);
      const statusClassName = activity.success
        ? "bg-green-500/20 text-green-400"
        : "bg-red-500/20 text-red-400";

      const {
        deviceType = 'Unknown',
        platform = 'Unknown',
        browser = 'Unknown'
      } = activity;

      return {
        id: activity.id,
        deviceLabel: `${browser} on ${platform} ${firstLetterToUpper(deviceType ?? 'unknown')}`,
        timestamp: formatDateTimeValue(activity.loginAt),
        ipAddress: activity.ipAddress,
        failureReason: activity.failureReason,
        success: activity.success,
        statusClassName,
        providerLabel: meta.label,
      };
    });
  }, [loginActivities]);

  const lastLoginAt = activityDisplayData[0]?.timestamp ?? "—";

  const renderContent = () => {
    if (isInitialLoading) {
      return <UserDetailSkeleton />;
    }

    if (error) {
      return (
        <ErrorState
          message={error}
          onRetry={fetchUser}
        />
      );
    }

    if (!user) {
      return (
        <div className="glass p-6 rounded-2xl">
          <p className="text-white/70">User record was not found.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountInfoCard
            infoRows={infoRows}
            statusLabel={formatLabel(accountStatus)}
            statusClassName={statusBadgeClass(accountStatus)}
            userId={user.id}
            lastLogin={lastLoginAt}
            isLastLoginLoading={loginLoading && activityDisplayData.length === 0}
          />
          <AccountMetricsCard stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoginMethodsCard
            providers={providerChips}
            kycStatusLabel={formatLabel(user.kycStatus)}
            kycStatusClassName={kycStatusClass(user.kycStatus)}
          />
          <LoginActivitySection
            activities={activityDisplayData}
            isLoading={loginLoading}
            error={loginError}
            pagination={loginPagination}
            onPageChange={handleLoginPageChange}
            onRetry={() => fetchLoginActivities(loginPagination.page, loginPagination.limit)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/users")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          {isInitialLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <h2 className="text-white text-3xl font-bold">
                {user ? user.fullName : "User Details"}
              </h2>
              {user && <p className="text-white/60">User ID: #{user.id}</p>}
            </>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default UserDetail;
