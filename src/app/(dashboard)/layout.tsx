'use client';

import {FC, ReactNode, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {Menu, X, LayoutDashboard, LogOut, Settings, Users} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {authAPI, useAuth, GameButton} from "@/lib";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const getInitials = (fullName?: string) => {
    if (!fullName) return "AD";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AD";
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0][0] ?? "";
    const last = parts[parts.length - 1][0] ?? "";
    if (!first && !last) return "AD";
    if (!last) return first.toUpperCase();
    return `${first}${last}`.toUpperCase();
  };

  const initials = getInitials(user?.fullName ?? undefined);

  const menuItems = [
    { name: "Home", path: "/home", icon: LayoutDashboard },
      { name: "Users", path: "/users", icon: Users },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    authAPI.logout()
      .then(() => {
        router.push("/login");
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileDropdownOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md border-r border-white/10 flex-col p-6 fixed left-0 top-0 h-screen">
        <Link href="/home" className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Image src={'/logo.png'} width={48} height={32} alt={'Logo'}/>
          </div>
          <span className="text-white font-bold text-lg">Card Hive</span>
        </Link>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <GameButton
                key={item.path}
                asChild
                variant={active ? "primary" : "secondary"}
                className="w-full justify-start normal-case px-4 py-3"
              >
                <Link href={item.path} className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </Link>
              </GameButton>
            );
          })}
        </nav>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md border-l border-white/10 p-6 transform transition-transform duration-300 z-50 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-4 top-4 p-2 text-white/70 hover:text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="mt-12 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <GameButton
                key={item.path}
                asChild
                variant={active ? "primary" : "secondary"}
                className="w-full justify-start normal-case px-4 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={item.path} className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </Link>
              </GameButton>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col">
        <header className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-white font-bold text-2xl md:text-3xl">Admin Dashboard</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-10 h-10 rounded-full bg-[#CEFE10] text-black font-bold flex items-center justify-center hover:bg-[#b8e80d] transition-colors duration-200 cursor-pointer"
            >
              {user?.avatarUrl ? (
                <span className="relative inline-flex h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={user.avatarUrl}
                    alt={`${user.fullName}'s avatar`}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                </span>
              ) : (
                initials
              )}
            </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-dark rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-200 border-t border-white/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
