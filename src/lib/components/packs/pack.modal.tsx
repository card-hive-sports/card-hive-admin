import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PACK_TYPE_OPTIONS, SPORT_TYPE_OPTIONS, type PackFormData, type PackType, type SportType } from "@/lib/types/pack";

interface PackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PackFormData) => void;
  initialData?: PackFormData | null;
  title: string;
}

const DEFAULT_FORM_DATA: PackFormData = {
  packType: PACK_TYPE_OPTIONS[0],
  sportType: SPORT_TYPE_OPTIONS[0],
  description: "",
  imageUrl: "",
  bannerUrl: "",
  price: "",
  isActive: true,
};

const formatLabel = (value: PackType | SportType) => {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
};

export const PackModal = ({ isOpen, onClose, onSubmit, initialData, title }: PackModalProps) => {
  const [formData, setFormData] = useState<PackFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.packType) newErrors.packType = "Select a pack type";
    if (!formData.sportType) newErrors.sportType = "Select a sport";
    if (!formData.price.trim() || Number.isNaN(Number(formData.price))) {
      newErrors.price = "Valid price is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
    setFormData(DEFAULT_FORM_DATA);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Price <span className="text-red-400">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
                    errors.price ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>
              <div className="flex flex-col justify-end">
                <label className="text-white/70 text-sm font-medium mb-1">Active</label>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/30 bg-black/30"
                  />
                  <span>{formData.isActive ? "Live" : "Paused"}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Pack Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="packType"
                  value={formData.packType}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.packType ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  {PACK_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
                {errors.packType && <p className="text-red-400 text-xs mt-1">{errors.packType}</p>}
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Sport Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="sportType"
                  value={formData.sportType}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.sportType ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  {SPORT_TYPE_OPTIONS.map((sport) => (
                    <option key={sport} value={sport}>
                      {formatLabel(sport)}
                    </option>
                  ))}
                </select>
                {errors.sportType && <p className="text-red-400 text-xs mt-1">{errors.sportType}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Summarize what makes this pack special"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#CEFE10] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Image URL</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Banner URL</label>
                <input
                  name="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#CEFE10] text-black font-semibold py-3 rounded-xl shadow-lg shadow-[#CEFE10]/40 hover:bg-[#b8e80d] transition-colors"
            >
              Save Pack
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
