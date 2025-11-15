import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PackFormData {
  name: string;
  theme: string;
  rarity: string;
  releaseDate: string;
  releaseType: string;
  status: "draft" | "published";
  tags: string[];
}

interface PackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PackFormData) => void;
  initialData?: PackFormData | null;
  title: string;
}

const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legend", "Grail", "Lineup", "Chase"];

export const PackModal = ({ isOpen, onClose, onSubmit, initialData, title }: PackModalProps) => {
  const [formData, setFormData] = useState<PackFormData>({
    name: "",
    theme: "",
    rarity: "Common",
    releaseDate: "",
    releaseType: "standard",
    status: "draft",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Pack name is required";
    if (!formData.rarity) newErrors.rarity = "Rarity is required";
    if (!formData.releaseDate) newErrors.releaseDate = "Release date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        theme: "",
        rarity: "Common",
        releaseDate: "",
        releaseType: "standard",
        status: "draft",
        tags: [],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="glass rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pack Name */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Pack Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter pack name"
                className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
                  errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Theme */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                placeholder="e.g., Basketball, Vintage, Modern"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rarity */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Rarity <span className="text-red-400">*</span>
                </label>
                <select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.rarity ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  {rarityOptions.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity}
                    </option>
                  ))}
                </select>
                {errors.rarity && <p className="text-red-400 text-sm mt-1">{errors.rarity}</p>}
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Release Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.releaseDate ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                />
                {errors.releaseDate && <p className="text-red-400 text-sm mt-1">{errors.releaseDate}</p>}
              </div>
            </div>

            {/* Release Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Release Type</label>
              <select
                name="releaseType"
                value={formData.releaseType}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] transition-colors"
              >
                <option value="standard">Standard</option>
                <option value="limited">Limited Edition</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Metadata Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag and press Enter"
                  className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                      <span className="text-white text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: "draft" }))}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    formData.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-black/30 border border-white/20 text-white/70 hover:text-white"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: "published" }))}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    formData.status === "published"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-black/30 border border-white/20 text-white/70 hover:text-white"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {initialData ? "Update Pack" : "Create Pack"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
