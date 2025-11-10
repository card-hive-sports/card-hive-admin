import {FormEvent, useState, useEffect} from "react";
import { X } from "lucide-react";
import {User, UserFormData, UserRole} from "@/lib";
import {GameButton} from "@/lib/ui";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  initialData?: User;
  title: string;
}

export const UserModal = ({ isOpen, onClose, onSubmit, initialData, title }: UserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
    role: initialData?.role ?? UserRole.CUSTOMER,
  });

  // Resync modal form state when toggling between create/edit modes without triggering extra renders
  useEffect(() => {
    if (!isOpen) return;

    const nextFormData: UserFormData = initialData
      ? {
          fullName: initialData.fullName,
          email: initialData.email ?? "",
          phone: initialData.phone ?? "",
          dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
          role: initialData.role ?? UserRole.CUSTOMER,
        }
      : {
          fullName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          role: UserRole.CUSTOMER,
        };

    setFormData((prev) =>
      prev.fullName === nextFormData.fullName &&
      prev.email === nextFormData.email &&
      prev.phone === nextFormData.phone &&
      prev.dateOfBirth === nextFormData.dateOfBirth &&
      prev.role === nextFormData.role
        ? prev
        : nextFormData,
    );
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] cursor-pointer"
              />
            </div>

            {!initialData && (
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#CEFE10] cursor-pointer"
                >
                  <option value={UserRole.CUSTOMER}>Customer</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <GameButton type="button" variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </GameButton>
              <GameButton type="submit" className="flex-1">
                {initialData ? "Update" : "Create"}
              </GameButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
