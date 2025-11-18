'use client';

import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { CardCondition, CardFormData, CardRarity } from '../../types';
import { SPORT_TYPE_OPTIONS, type SportType } from '@/lib/types/pack';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CardFormData) => void;
  initialData?: CardFormData | null;
  title: string;
  packs: Array<{ id: string; name: string }>;
}

const CARD_RARITY_OPTIONS: CardRarity[] = ['GRAIL', 'CHASE', 'LINEUP'];
const CARD_CONDITION_OPTIONS: CardCondition[] = ['MINT', 'NEAR_MINT'];

const DEFAULT_FORM_DATA: CardFormData = {
  name: '',
  playerName: undefined,
  description: undefined,
  imageUrl: undefined,
  bannerUrl: undefined,
  packId: '',
  sportType: SPORT_TYPE_OPTIONS[0],
  rarity: CARD_RARITY_OPTIONS[0],
  condition: undefined,
  estimatedValue: undefined,
  serialNumber: undefined,
  year: undefined,
  manufacturer: undefined,
};

const buildInitialFormData = (data?: CardFormData | null): CardFormData => ({
  ...DEFAULT_FORM_DATA,
  ...data,
  year: data?.year ?? undefined,
});

export const CardModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  packs,
}: CardModalProps) => {
  const [formData, setFormData] = useState<CardFormData>(() => buildInitialFormData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetState = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleChange = (
    name: keyof CardFormData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors((prev) => ({ ...prev, [name as string]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Card name is required';
    if (!formData.packId) newErrors.packId = 'Pack is required';
    if (!formData.rarity) newErrors.rarity = 'Rarity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
    resetState();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-2xl rounded-2xl glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">{title}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Card Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Enter card name"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-[#CEFE10]'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Player Name</label>
                <input
                  type="text"
                  value={formData.playerName ?? ''}
                  onChange={(event) => handleChange('playerName', event.target.value)}
                  placeholder="Optional"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description ?? ''}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder="Short description"
                rows={3}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Rarity <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.rarity}
                  onChange={(event) => handleChange('rarity', event.target.value as CardRarity)}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.rarity ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-[#CEFE10]'
                  }`}
                >
                  {CARD_RARITY_OPTIONS.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity}
                    </option>
                  ))}
                </select>
                {errors.rarity && <p className="text-red-400 text-xs mt-1">{errors.rarity}</p>}
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Condition</label>
                <select
                  value={formData.condition ?? ''}
                  onChange={(event) =>
                    handleChange('condition', event.target.value ? (event.target.value as CardCondition) : undefined)
                  }
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] transition-colors"
                >
                  <option value="">Any</option>
                  {CARD_CONDITION_OPTIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Sport</label>
                <select
                  value={formData.sportType}
                  onChange={(event) => handleChange('sportType', event.target.value as SportType)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] transition-colors"
                >
                  {SPORT_TYPE_OPTIONS.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Pack <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.packId}
                  onChange={(event) => handleChange('packId', event.target.value)}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                    errors.packId ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-[#CEFE10]'
                  }`}
                >
                  <option value="">Select a pack</option>
                  {packs.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
                {errors.packId && <p className="text-red-400 text-xs mt-1">{errors.packId}</p>}
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Estimated Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedValue ?? ''}
                  onChange={(event) => handleChange('estimatedValue', event.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Serial Number</label>
                <input
                  type="text"
                  value={formData.serialNumber ?? ''}
                  onChange={(event) => handleChange('serialNumber', event.target.value)}
                  placeholder="Serial"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year ?? ''}
                  onChange={(event) =>
                    handleChange('year', event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="Year"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={formData.manufacturer ?? ''}
                  onChange={(event) => handleChange('manufacturer', event.target.value)}
                  placeholder="Company"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl ?? ''}
                  onChange={(event) => handleChange('imageUrl', event.target.value)}
                  placeholder="https://"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Banner URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl ?? ''}
                  onChange={(event) => handleChange('bannerUrl', event.target.value)}
                  placeholder="https://"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-black/30 border border-white/20 hover:bg-black/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#CEFE10] hover:bg-[#b8e80d] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {initialData ? 'Update Card' : 'Create Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
