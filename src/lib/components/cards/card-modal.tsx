import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export interface CardFormData {
  id?: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  packId: string;
  attributes: Record<string, number>;
  tags: string[];
  status: "draft" | "published";
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CardFormData) => void;
  initialData?: CardFormData | null;
  title: string;
  packs: Array<{ id: string; name: string }>;
}

const rarityOptions = ["Common", "Uncommon", "Rare", "Epic", "Legend", "Grail", "Lineup", "Chase"];

export const CardModal = ({ isOpen, onClose, onSubmit, initialData, title, packs }: CardModalProps) => {
  const [formData, setFormData] = useState<CardFormData>({
    name: "",
    description: "",
    image: "",
    rarity: "Common",
    packId: "",
    attributes: { health: 0, attack: 0, defense: 0 },
    tags: [],
    status: "draft",
  });
  const [tagInput, setTagInput] = useState("");
  const [attributeInputs, setAttributeInputs] = useState({ name: "", value: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prev) => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAttribute = () => {
    if (attributeInputs.name && attributeInputs.value) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeInputs.name.toLowerCase()]: parseInt(attributeInputs.value),
        },
      }));
      setAttributeInputs({ name: "", value: "" });
    }
  };

  const handleRemoveAttribute = (key: string) => {
    setFormData((prev) => {
      const newAttrs = { ...prev.attributes };
      delete newAttrs[key];
      return { ...prev, attributes: newAttrs };
    });
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
    if (!formData.name.trim()) newErrors.name = "Card name is required";
    if (!formData.rarity) newErrors.rarity = "Rarity is required";
    if (!formData.packId) newErrors.packId = "Pack is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        description: "",
        image: "",
        rarity: "Common",
        packId: "",
        attributes: { health: 0, attack: 0, defense: 0 },
        tags: [],
        status: "draft",
      });
      setImagePreview("");
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
            {/* Card Name */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Card Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter card name"
                className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
                  errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter card description"
                rows={3}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Card Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white/70 text-sm focus:outline-none focus:border-[#CEFE10] transition-colors file:bg-[#CEFE10] file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:font-semibold file:cursor-pointer hover:file:bg-[#b8e80d]"
                  />
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/30 flex-shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
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

              {/* Pack */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Pack <span className="text-red-400">*</span>
                </label>
                <select
                  name="packId"
                  value={formData.packId}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.packId ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  <option value="">Select a pack</option>
                  {packs.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
                {errors.packId && <p className="text-red-400 text-sm mt-1">{errors.packId}</p>}
              </div>
            </div>

            {/* Attributes */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Attributes</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Attribute name"
                  value={attributeInputs.name}
                  onChange={(e) => setAttributeInputs((prev) => ({ ...prev, name: e.target.value }))}
                  className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={attributeInputs.value}
                  onChange={(e) => setAttributeInputs((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-20 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {Object.keys(formData.attributes).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(formData.attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                      <div>
                        <p className="text-white/70 text-xs capitalize">{key}</p>
                        <p className="text-white font-semibold">{value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(key)}
                        className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Media Tags</label>
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
                {initialData ? "Update Card" : "Create Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
