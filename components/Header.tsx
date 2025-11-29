"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiMapPin, FiMail, FiHelpCircle, FiInfo,
  FiBookOpen, FiShoppingBag, FiMap, FiUserPlus,
  FiUsers, FiDollarSign, FiChevronDown, FiMenu, FiX, FiEdit
} from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import { LayoutDashboard } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch pending edit requests count for admin
  useEffect(() => {
    if (session && (session.user as any)?.role === 'admin') {
      const fetchPendingCount = async () => {
        try {
          const res = await fetch('/api/admin/edit-requests/stats');
          const data = await res.json();
          if (data.success) {
            setPendingCount(data.data.pending || 0);
          }
        } catch (error) {
          console.error('Failed to fetch pending count:', error);
        }
      };

      fetchPendingCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const isActiveGroup = (paths: string[]) =>
    paths.some(path => pathname.startsWith(path) || pathname === path);

  const menuGroups = [
    {
      label: 'About',
      icon: FiInfo,
      items: [
        { label: 'Our Story', path: '/about', icon: FiInfo },
        { label: 'Impact', path: '/#impact', icon: SiBitcoin },
      ]
    },
    {
      label: 'Programs',
      icon: FiBookOpen,
      items: [
        { label: 'Micro-Merchants & Traders', path: '/programs/merchants', icon: FiShoppingBag },
        { label: 'Women\'s Upcycling Collective', path: '/programs/upcycling', icon: FiUsers },
        { label: 'Waste Incentives Program', path: '/programs/waste-management', icon: FiBookOpen },
        { label: 'Boda-Boda "Ride to Freedom"', path: '/programs/bodaboda', icon: FiUserPlus },
      ]
    },
    {
      label: 'Merchants',
      icon: FiShoppingBag,
      items: [
        { label: 'View Directory', path: '/merchants', icon: FiShoppingBag },
        { label: 'Interactive Map', path: '/maps', icon: FiMap },
        { label: 'Register Business', path: '/register', icon: FiUserPlus },
      ]
    },
    {
      label: 'Community',
      icon: FiUsers,
      items: [
        { label: 'Fedi Community', path: '/fedi', icon: FiHelpCircle },
      ]
    },
  ];

  return (
    <>
      {/* Desktop Floating Header with Mega Menu */}
      <header
        className={`hidden md:block fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav
          className={`glass-card py-3.5 px-6 transition-all duration-300 ${
            scrolled ? 'bg-black/80 backdrop-blur-xl' : ''
          }`}
          style={{
            background: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/Media/Logo/icon symbol only svg.svg"
                alt="Afribit Africa"
                width={32}
                height={32}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-lg font-bold">
                Afribit <span className="text-gradient">Africa</span>
              </span>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <div className="flex items-center gap-1">
              {menuGroups.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActiveGroup(group.items.map(i => i.path.split('#')[0]))
                        ? 'text-bitcoin bg-bitcoin/10'
                        : 'text-gray-300 hover:text-bitcoin hover:bg-white/5'
                    }`}
                  >
                    <group.icon className="w-4 h-4" />
                    {group.label}
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${
                      activeDropdown === group.label ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === group.label && (
                    <div
                      className="absolute top-full left-0 mt-0.5 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseEnter={() => setActiveDropdown(group.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            pathname === item.path.split('#')[0] || pathname === item.path
                              ? 'text-bitcoin bg-bitcoin/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Admin Section */}
              {session ? (
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('admin')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname.startsWith('/admin')
                        ? 'text-bitcoin bg-bitcoin/10'
                        : 'text-gray-300 hover:text-bitcoin hover:bg-white/5'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${
                      activeDropdown === 'admin' ? 'rotate-180' : ''
                    }`} />
                    {pendingCount > 0 && (
                      <span className="ml-1 bg-[#F7931A] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>

                  {/* Admin Dropdown */}
                  {activeDropdown === 'admin' && (
                    <div
                      className="absolute top-full left-0 mt-0.5 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseEnter={() => setActiveDropdown('admin')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          pathname === '/admin/dashboard'
                            ? 'text-bitcoin bg-bitcoin/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/admin/edit-requests"
                        className={`flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                          pathname.startsWith('/admin/edit-requests')
                            ? 'text-bitcoin bg-bitcoin/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FiEdit className="w-4 h-4" />
                          <span>Edit Requests</span>
                        </div>
                        {pendingCount > 0 && (
                          <span className="bg-[#F7931A] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/admin/login'
                      ? 'text-bitcoin bg-bitcoin/10'
                      : 'text-gray-300 hover:text-bitcoin hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}

              <Link
                href="/contact"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/contact'
                    ? 'text-bitcoin bg-bitcoin/10'
                    : 'text-gray-300 hover:text-bitcoin hover:bg-white/5'
                }`}
              >
                <FiMail className="w-4 h-4" />
                Contact
              </Link>

              <Link
                href="/donate"
                className="btn btn-primary px-5 py-2 text-sm ml-2 flex items-center gap-2"
              >
                <SiBitcoin className="w-4 h-4" />
                Fuel BCE
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation - Bottom Bar + Hamburger Menu */}
      <div className="md:hidden">
        {/* Mobile Bottom Navigation Bar - Floating Rounded */}
        <nav className="fixed bottom-4 left-4 right-4 z-50 border-2 border-white/10 bg-black/95 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/50">
          <div className="flex items-center justify-around py-3 px-2">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-all ${
                pathname === '/' ? 'text-bitcoin' : 'text-gray-400 hover:text-bitcoin'
              }`}
            >
              <FiHome className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link
              href="/maps"
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-all ${
                pathname === '/maps' ? 'text-bitcoin' : 'text-gray-400 hover:text-bitcoin'
              }`}
            >
              <FiMapPin className="w-6 h-6" />
              <span className="text-[10px] font-medium">Map</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-all ${
                mobileMenuOpen ? 'text-bitcoin' : 'text-gray-400 hover:text-bitcoin'
              }`}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </motion.div>
              <span className="text-[10px] font-medium">Menu</span>
            </button>

            <Link
              href="/donate"
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-all ${
                pathname === '/donate' ? 'text-bitcoin' : 'text-gray-400 hover:text-bitcoin'
              }`}
            >
              <SiBitcoin className="w-6 h-6" />
              <span className="text-[10px] font-medium">Donate</span>
            </Link>

            <Link
              href="/contact"
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-all ${
                pathname === '/contact' ? 'text-bitcoin' : 'text-gray-400 hover:text-bitcoin'
              }`}
            >
              <FiMail className="w-6 h-6" />
              <span className="text-[10px] font-medium">Contact</span>
            </Link>
          </div>
        </nav>

        {/* Mobile Full Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="h-full overflow-y-auto pb-24 pt-6 px-6"
              >
                {/* Logo Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Image
                      src="/Media/Logo/icon symbol only svg.svg"
                      alt="Afribit Africa"
                      width={36}
                      height={36}
                    />
                    <span className="text-xl font-bold">
                      Afribit <span className="text-gradient">Africa</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                {/* Menu Groups */}
                <div className="space-y-6">
                  {menuGroups.map((group, groupIndex) => (
                    <motion.div
                      key={group.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + groupIndex * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider px-3">
                        <group.icon className="w-4 h-4" />
                        {group.label}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item, itemIndex) => (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.15 + groupIndex * 0.1 + itemIndex * 0.05 }}
                          >
                            <Link
                              href={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                                pathname === item.path.split('#')[0] || pathname === item.path
                                  ? 'text-bitcoin bg-bitcoin/10'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Admin Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="border-t border-white/10 pt-6 space-y-1"
                  >
                    {session ? (
                      <>
                        <div className="flex items-center gap-2 px-3 mb-2">
                          <LayoutDashboard className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</span>
                          {pendingCount > 0 && (
                            <span className="ml-auto bg-[#F7931A] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {pendingCount}
                            </span>
                          )}
                        </div>
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                            pathname === '/admin/dashboard'
                              ? 'text-bitcoin bg-bitcoin/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/edit-requests"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg transition-all ${
                            pathname.startsWith('/admin/edit-requests')
                              ? 'text-bitcoin bg-bitcoin/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FiEdit className="w-5 h-5" />
                            <span className="font-medium">Edit Requests</span>
                          </div>
                          {pendingCount > 0 && (
                            <span className="bg-[#F7931A] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {pendingCount}
                            </span>
                          )}
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/admin/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                          pathname === '/admin/login'
                            ? 'text-bitcoin bg-bitcoin/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Admin Login</span>
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Header;
