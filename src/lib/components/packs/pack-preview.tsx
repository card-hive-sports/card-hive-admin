import Image from "next/image";
import type { PackType, SportType } from "@/lib/types/pack";
import { formatCurrency } from "@/lib";

const packTypeLabels: Record<PackType, string> = {
  DRAFT: "Draft",
  PRO: "Pro",
  ALL_STARS: "All Stars",
  HALL_OF_FAME: "Hall of Fame",
  LEGENDS: "Legends",
};

const sportTypeLabels: Record<SportType, string> = {
  FOOTBALL: "Football",
  BASEBALL: "Baseball",
  BASKETBALL: "Basketball",
  MULTISPORT: "Multisport",
};

const sportIcons: Record<SportType, string> = {
  FOOTBALL: "/icons/sports/football.svg",
  BASEBALL: "/icons/sports/baseball.svg",
  BASKETBALL: "/icons/sports/basketball.svg",
  MULTISPORT: "/icons/sports/multisport.svg",
};

interface PackPreviewProps {
  packType: PackType;
  sportType: SportType;
  price: string;
  bannerUrl?: string;
}

const cutSize = 20;
const cutClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${cutSize}px), calc(100% - ${cutSize}px) 100%, 0 100%, 0 ${cutSize}px)`;

export const PackPreview = ({ packType, sportType, price, bannerUrl }: PackPreviewProps) => {
  return (
    <div className="relative min-h-96 h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-2xl">
      <div className="absolute inset-0">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`${packTypeLabels[packType]} banner`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-white/10 to-black/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="absolute bottom-4 left-4 z-10  p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/70">
            {packTypeLabels[packType]}
          </span>
          <span className="text-3xl font-bold text-white">{formatCurrency(Number(price))}</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 h-16 w-16 rounded-[20px] bg-black/70 border border-white/20 shadow-lg overflow-hidden" style={{ clipPath: cutClipPath }}>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={sportIcons[sportType]}
            alt={`${sportTypeLabels[sportType]} icon`}
            fill
            className="object-cover scale-125 translate-x-4 translate-y-4"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};
