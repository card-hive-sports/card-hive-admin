export interface ProviderChip {
  id: string;
  label: string;
  className: string;
}

interface LoginMethodsCardProps {
  providers: ProviderChip[];
  kycStatusLabel: string;
  kycStatusClassName: string;
}

export const LoginMethodsCard = ({
  providers,
  kycStatusLabel,
  kycStatusClassName,
}: LoginMethodsCardProps) => (
  <div className="glass p-6 rounded-2xl space-y-4">
    <div>
      <h3 className="text-white text-lg font-semibold mb-2">Connected Login Methods</h3>
      {providers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <span
              key={provider.id}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${provider.className}`}
            >
              {provider.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-white/60 text-sm">No authentication providers connected.</p>
      )}
    </div>

    <div className="border-t border-white/10 pt-4">
      <p className="text-white/60 text-sm mb-1">KYC Status</p>
      <p className={`text-white text-sm font-semibold ${kycStatusClassName}`}>
        {kycStatusLabel}
      </p>
    </div>
  </div>
);
