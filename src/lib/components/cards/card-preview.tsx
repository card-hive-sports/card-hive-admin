import { Star } from "lucide-react";

interface CardPreviewProps {
  name: string;
  description: string;
  image: string;
  rarity: string;
  attributes?: Record<string, number>;
  tags?: string[];
}

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-300" },
  uncommon: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-300" },
  rare: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-300" },
  epic: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-300" },
  legend: { bg: "bg-[#CEFE10]/20", border: "border-[#CEFE10]/30", text: "text-[#CEFE10]" },
  grail: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-300" },
};

export const CardPreview = ({ name, description, image, rarity, attributes, tags }: CardPreviewProps) => {
  const colors = rarityColors[rarity.toLowerCase()] || rarityColors.common;

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className={`w-full max-w-sm glass rounded-2xl overflow-hidden border ${colors.border}`}>
        {/* Card Image */}
        <div className="relative w-full h-64 bg-black/50 overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-white/10 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Rarity Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
              <Star className="w-3 h-3" />
              {rarity.toUpperCase()}
            </span>
          </div>

          {/* Card Name */}
          <h3 className="text-white text-xl font-bold mb-2">{name || "Card Name"}</h3>

          {/* Card Description */}
          {description && (
            <p className="text-white/70 text-sm mb-4 line-clamp-3">{description}</p>
          )}

          {/* Attributes */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="mb-4 pt-4 border-t border-white/10">
              <p className="text-white/60 text-xs font-medium mb-3">ATTRIBUTES</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="bg-black/30 rounded-lg p-2 text-center">
                    <p className="text-white/60 text-xs capitalize">{key}</p>
                    <p className="text-white font-bold text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
