'use client';

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { ImageUploadWithCrop } from "@/lib/components/media";
import type { MediaUploadProgress } from "@/lib/types/media";
import { PACK_TYPE_OPTIONS, SPORT_TYPE_OPTIONS, type PackFormData, type PackType, type SportType } from "@/lib/types/pack";
import { showApiError } from "@/lib/utils/show-api-error";
import { GameButton } from "@/lib/ui";

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
      setErrors({});
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

  const handleMediaUploadSuccess =
    (field: "imageUrl" | "bannerUrl") => (upload: MediaUploadProgress) => {
      if (!upload.url) return;
      setFormData((prev) => ({ ...prev, [field]: upload.url ?? prev[field] }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleMediaUploadError = (label: string) => (error: unknown) => {
    showApiError(`upload ${label}`, error as AxiosError, "Unable to upload the image. Please try again.");
  };

  const toggleActiveState = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.packType) newErrors.packType = "Select a pack type";
    if (!formData.sportType) newErrors.sportType = "Select a sport";
    if (!formData.bannerUrl.trim()) newErrors.bannerUrl = "Upload a banner";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Upload an image";
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#CEFE10]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Pack Image</p>
                    <p className="text-xs text-white/40">Thumbnail used throughout the UI</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    {formData.imageUrl ? "Linked" : "Required"}
                  </span>
                </div>
                <ImageUploadWithCrop
                  label="Pack Thumbnail"
                  description="Cropped square for listing cards"
                  dropZoneLabel="Drop pack thumbnail or browse"
                  initialPresetId="thumbnail"
                  uploadButtonLabel="Upload Thumbnail"
                  onUploadSuccess={handleMediaUploadSuccess("imageUrl")}
                  onUploadError={handleMediaUploadError("pack thumbnail")}
                  showUploadedPreview
                />
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Or paste an image URL"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                />
                {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Banner Image</p>
                    <p className="text-xs text-white/40">Shown on pack detail headers</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    {formData.bannerUrl ? "Linked" : "Required"}
                  </span>
                </div>
                <ImageUploadWithCrop
                  label="Pack Banner"
                  description="Wide banner preview"
                  dropZoneLabel="Drop banner or browse files"
                  initialPresetId="banner"
                  uploadButtonLabel="Upload Banner"
                  onUploadSuccess={handleMediaUploadSuccess("bannerUrl")}
                  onUploadError={handleMediaUploadError("banner")}
                  showUploadedPreview
                />
                <input
                  name="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={handleChange}
                  placeholder="Or paste a banner URL"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                />
                {errors.bannerUrl && <p className="text-red-400 text-xs mt-1">{errors.bannerUrl}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <div>
                <p className="text-white/70 text-sm font-medium">Status</p>
                <p className="text-xs text-white/40">
                  {formData.isActive ? "Pack is live" : "Pack is paused"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.isActive}
                onClick={toggleActiveState}
                className={clsx(
                  "relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CEFE10] cursor-pointer",
                  formData.isActive ? "bg-[#CEFE10]/70" : "bg-white/20"
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                    formData.isActive ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <GameButton
              variant="primary"
              type="submit"
              className="w-full"
            >
              Save Pack
            </GameButton>
          </form>
        </div>
      </div>
    </>
  );
};
