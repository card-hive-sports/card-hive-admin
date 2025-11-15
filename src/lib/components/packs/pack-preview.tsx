import { Package, Star } from "lucide-react";

interface PackCard {
  id: string;
  name: string;
  rarity: string;
}

interface PackPreviewProps {
  name: string;
  theme: string;
  rarity: string;
  releaseDate: string;
  cardCount: number;
  cards?: PackCard[];
}

const rarityColors: Record<string, { bg: string; text: string; glow: string }> = {
  common: { bg: "from-gray-600 to-gray-700", text: "text-gray-300", glow: "shadow-gray-500/20" },
  uncommon: { bg: "from-green-600 to-green-700", text: "text-green-300", glow: "shadow-green-500/20" },
  rare: { bg: "from-blue-600 to-blue-700", text: "text-blue-300", glow: "shadow-blue-500/20" },
  epic: { bg: "from-purple-600 to-purple-700", text: "text-purple-300", glow: "shadow-purple-500/20" },
  legend: { bg: "from-yellow-600 to-yellow-700", text: "text-yellow-300", glow: "shadow-yellow-500/20" },
  grail: { bg: "from-amber-500 to-amber-600", text: "text-amber-200", glow: "shadow-amber-500/20" },
  lineup: { bg: "from-orange-600 to-orange-700", text: "text-orange-300", glow: "shadow-orange-500/20" },
  chase: { bg: "from-cyan-600 to-cyan-700", text: "text-cyan-300", glow: "shadow-cyan-500/20" },
};

export const PackPreview = ({ name, theme, rarity, releaseDate, cardCount, cards }: PackPreviewProps) => {
  const colors = rarityColors[rarity.toLowerCase()] || rarityColors.common;

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className={`w-full max-w-sm bg-gradient-to-br ${colors.bg} rounded-2xl p-8 shadow-2xl ${colors.glow}`}>
        {/* Pack Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className={`w-6 h-6 ${colors.text}`} fill="currentColor" />
            <span className={`text-sm font-bold uppercase ${colors.text}`}>{rarity}</span>
            <Star className={`w-6 h-6 ${colors.text}`} fill="currentColor" />
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">{name || "Pack Name"}</h2>
          {theme && <p className="text-white/80 text-sm">{theme}</p>}
        </div>

        {/* Pack Info */}
        <div className="bg-black/30 rounded-xl p-4 mb-8 space-y-3">
          {releaseDate && (
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Release Date</span>
              <span className="text-white font-semibold">{releaseDate}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="text-white/70 text-sm">Card Count</span>
            <span className="text-white font-semibold">{cardCount}</span>
          </div>
        </div>

        {/* Pack Cards Preview */}
        {cards && cards.length > 0 && (
          <div className="mb-8">
            <p className="text-white/70 text-xs font-medium mb-3 uppercase">Cards in Pack</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {cards.slice(0, 4).map((card) => (
                <div key={card.id} className="bg-black/40 rounded-lg p-2 text-center">
                  <p className="text-white text-xs font-semibold truncate">{card.name}</p>
                  <p className={`text-xs ${rarityColors[card.rarity.toLowerCase()]?.text || "text-gray-400"}`}>
                    {card.rarity}
                  </p>
                </div>
              ))}
              {cards.length > 4 && (
                <div className="col-span-2 bg-black/40 rounded-lg p-2 text-center">
                  <p className="text-white/70 text-xs">+ {cards.length - 4} more</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button className={`w-full py-3 rounded-lg font-bold text-black bg-white hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-2`}>
          <Package className="w-5 h-5" />
          {cards && cards.length > 0 ? "View Pack" : "Open Pack"}
        </button>
      </div>
    </div>
  );
}
