'use client';

import {FC, useState} from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut, Settings } from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {authAPI} from "@/lib";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  userInitials?: string;
}

const Layout: FC<LayoutProps> = ({ children, userInitials = "AD" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/home", icon: LayoutDashboard },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    authAPI.logout()
      .then(() => {
        router.push("/login");
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md border-r border-white/10 flex-col p-6 fixed left-0 top-0 h-screen">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Image src={'/logo.png'} width={48} height={32} alt={'Logo'}/>
          </div>
          <span className="text-white font-bold text-lg">Card Hive</span>
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-[#CEFE10] text-black font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md border-l border-white/10 p-6 transform transition-transform duration-300 z-50 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-4 top-4 p-2 text-white/70 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="mt-12 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-[#CEFE10] text-black font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md border-b border-white/10 p-4 md:p-6 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-white font-bold text-xl md:text-2xl">Card Hive Admin</h1>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-[#CEFE10] text-black font-bold flex items-center justify-center hover:bg-[#b8e80d] transition-colors duration-200"
              >
                {userInitials}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden z-50">
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
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-200 border-t border-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
