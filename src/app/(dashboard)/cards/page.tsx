'use client';

import { useState, useMemo } from "react";
import { CardPreview, ActivityLogEntry, ActivityLog } from "@/lib";
import { Search, Filter, ArrowUpDown, Trash2 } from "lucide-react";

interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  packId: string;
  packName: string;
  attributes: Record<string, number>;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

interface Pack {
  id: string;
  name: string;
}

const INITIAL_PACKS: Pack[] = [
  { id: "1", name: "Golden Era Basketball" },
  { id: "2", name: "Modern Athletes" },
  { id: "3", name: "Rookie Edition" },
];

const INITIAL_CARDS: Card[] = [
  {
    id: "1",
    name: "Michael Jordan",
    description: "The legendary Michael Jordan in his prime",
    image: "",
    rarity: "Legend",
    packId: "1",
    packName: "Golden Era Basketball",
    attributes: { health: 95, attack: 98, defense: 92 },
    tags: ["iconic", "basketball", "vintage"],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "LeBron James",
    description: "Modern era superstar",
    image: "",
    rarity: "Legend",
    packId: "1",
    packName: "Golden Era Basketball",
    attributes: { health: 92, attack: 88, defense: 89 },
    tags: ["modern", "basketball", "goat"],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Kobe Bryant",
    description: "The Black Mamba",
    image: "",
    rarity: "Epic",
    packId: "1",
    packName: "Golden Era Basketball",
    attributes: { health: 88, attack: 92, defense: 87 },
    tags: ["basketball", "legacy", "champion"],
    status: "draft",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
  },
];

const ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: "1",
    type: "publish",
    title: "Card Published",
    description: "Michael Jordan card was published",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "Admin User",
  },
  {
    id: "2",
    type: "update",
    title: "Card Updated",
    description: "Updated attributes and tags",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: "Admin User",
  },
];

export default function Cards() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "rarity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({ rarity: "", status: "", packId: "" });
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Card | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    rarity: "Common",
    packId: "",
    attributes: { health: 0, attack: 0, defense: 0 },
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });
  const [tagInput, setTagInput] = useState("");
  const [attributeInputs, setAttributeInputs] = useState({ name: "", value: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredAndSortedCards = useMemo(() => {
    let result = cards;

    if (search) {
      result = result.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase()) ||
        card.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((card) => (card as any)[key] === value);
      }
    });

    result.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [cards, search, activeFilters, sortBy, sortOrder]);

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "bg-gray-500/20 text-gray-400",
      uncommon: "bg-green-500/20 text-green-400",
      rare: "bg-blue-500/20 text-blue-400",
      epic: "bg-purple-500/20 text-purple-400",
      legend: "bg-yellow-500/20 text-yellow-400",
      grail: "bg-[#CEFE10]/20 text-[#CEFE10]",
      lineup: "bg-orange-500/20 text-orange-400",
      chase: "bg-cyan-500/20 text-cyan-400",
    };
    return colors[rarity.toLowerCase()] || colors.common;
  };

  const handleStartEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      description: card.description,
      image: card.image,
      rarity: card.rarity,
      packId: card.packId,
      attributes: { ...card.attributes },
      tags: [...card.tags],
      status: card.status,
    });
  };

  const handleClearForm = () => {
    setEditingCard(null);
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
    setTagInput("");
    setAttributeInputs({ name: "", value: "" });
    setErrors({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
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
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
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

  const handleSaveCard = (isDraft: boolean) => {
    if (!validateForm()) return;

    if (editingCard) {
      setCards(
        cards.map((c) =>
          c.id === editingCard.id
            ? {
                ...c,
                ...formData,
                status: isDraft ? "draft" : "published",
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : c
        )
      );
    } else {
      const newCard: Card = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        packName: INITIAL_PACKS.find((p) => p.id === formData.packId)?.name || "",
        status: isDraft ? "draft" : "published",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setCards([...cards, newCard]);
    }
    handleClearForm();
  };

  const handleDeleteCard = (card: Card) => {
    setCards(cards.filter((c) => c.id !== card.id));
    setShowDeleteModal(null);
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">Cards</h2>
            <p className="text-white/60">Create and manage cards for your packs</p>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Cards List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Controls */}
            <div className="glass p-4 rounded-2xl space-y-4 relative z-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center gap-2 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors justify-center"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 right-0 mt-2 w-full glass rounded-lg p-4 z-50 space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Rarity</label>
                      <select
                        value={activeFilters.rarity || ""}
                        onChange={(e) => setActiveFilters({ ...activeFilters, rarity: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                      >
                        <option value="">All</option>
                        <option value="Common">Common</option>
                        <option value="Uncommon">Uncommon</option>
                        <option value="Rare">Rare</option>
                        <option value="Epic">Epic</option>
                        <option value="Legend">Legend</option>
                        <option value="Grail">Grail</option>
                        <option value="Lineup">Lineup</option>
                        <option value="Chase">Chase</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
                      <select
                        value={activeFilters.status || ""}
                        onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                      >
                        <option value="">All</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Pack</label>
                      <select
                        value={activeFilters.packId || ""}
                        onChange={(e) => setActiveFilters({ ...activeFilters, packId: e.target.value })}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                      >
                        <option value="">All Packs</option>
                        {INITIAL_PACKS.map((pack) => (
                          <option key={pack.id} value={pack.id}>
                            {pack.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setActiveFilters({ rarity: "", status: "", packId: "" })}
                      className="w-full text-white/60 hover:text-white text-xs font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="w-full flex items-center gap-2 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors justify-center"
                >
                  <ArrowUpDown className="w-5 h-5" />
                  Sort
                </button>

                {showSort && (
                  <div className="absolute top-full left-0 right-0 mt-2 w-full glass rounded-lg p-4 z-50 space-y-3">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
                      >
                        <option value="name">Name</option>
                        <option value="createdAt">Created Date</option>
                        <option value="rarity">Rarity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Order</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortOrder("asc")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                            sortOrder === "asc"
                              ? "bg-[#CEFE10] text-black"
                              : "bg-black/30 border border-white/20 text-white hover:bg-black/40"
                          }`}
                        >
                          Asc
                        </button>
                        <button
                          onClick={() => setSortOrder("desc")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                            sortOrder === "desc"
                              ? "bg-[#CEFE10] text-black"
                              : "bg-black/30 border border-white/20 text-white hover:bg-black/40"
                          }`}
                        >
                          Desc
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cards List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredAndSortedCards.map((card) => (
                <div
                  key={card.id}
                  className={`glass p-4 rounded-lg cursor-pointer transition-all hover:bg-white/10 border ${
                    editingCard?.id === card.id ? "border-[#CEFE10]" : "border-white/10"
                  }`}
                  onClick={() => handleStartEdit(card)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{card.name}</p>
                      <p className="text-white/50 text-xs mt-1">{card.packName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRarityColor(card.rarity)}`}>
                      {card.rarity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      card.status === "published"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {card.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Panel - Card Form */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl space-y-4 max-h-[900px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">{editingCard ? "Edit Card" : "Create Card"}</h3>
                {editingCard && (
                  <button
                    onClick={handleClearForm}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Card Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  placeholder="Enter card description"
                  rows={3}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Card Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white/70 text-sm focus:outline-none focus:border-[#CEFE10] transition-colors file:bg-[#CEFE10] file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:font-semibold file:cursor-pointer hover:file:bg-[#b8e80d]"
                />
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-black/30">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Rarity */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Rarity <span className="text-red-400">*</span>
                </label>
                <select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleFormChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.rarity ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legend">Legend</option>
                  <option value="Grail">Grail</option>
                  <option value="Lineup">Lineup</option>
                  <option value="Chase">Chase</option>
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
                  onChange={handleFormChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.packId ? "border-red-500/50 focus:border-red-500" : "border-white/20 focus:border-[#CEFE10]"
                  }`}
                >
                  <option value="">Select a pack</option>
                  {INITIAL_PACKS.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
                {errors.packId && <p className="text-red-400 text-sm mt-1">{errors.packId}</p>}
              </div>

              {/* Attributes */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Attributes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    value={attributeInputs.name}
                    onChange={(e) => setAttributeInputs((prev) => ({ ...prev, name: e.target.value }))}
                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    value={attributeInputs.value}
                    onChange={(e) => setAttributeInputs((prev) => ({ ...prev, value: e.target.value }))}
                    className="w-20 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                {Object.keys(formData.attributes).length > 0 && (
                  <div className="space-y-1">
                    {Object.entries(formData.attributes).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-black/30 rounded p-2 text-sm">
                        <span className="text-white/70 capitalize">{key}: {value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(key)}
                          className="text-white/60 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag"
                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 text-xs">
                        <span className="text-white">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status and Save Buttons */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleSaveCard(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition-colors border border-yellow-500/30"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSaveCard(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-2 px-4 rounded-lg transition-colors border border-green-500/30"
                  >
                    Publish
                  </button>
                </div>
                {editingCard && (
                  <button
                    onClick={handleClearForm}
                    className="w-full bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview and Activity */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card Preview */}
            <CardPreview
              name={formData.name || "Card Name"}
              description={formData.description}
              image={formData.image}
              rarity={formData.rarity}
              attributes={formData.attributes}
              tags={formData.tags}
            />

            {/* Activity Log */}
            <ActivityLog entries={ACTIVITY_LOG} maxHeight="max-h-72" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-white text-xl font-bold">Delete Card</h2>
              </div>

              <p className="text-white/70 mb-6">
                Are you sure you want to delete <strong>{showDeleteModal.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCard(showDeleteModal)}
                  className="flex-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
