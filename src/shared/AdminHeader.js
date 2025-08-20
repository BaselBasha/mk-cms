"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const AdminHeader = ({ currentPage = "Dashboard" }) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Get admin data from localStorage
    if (typeof window !== "undefined") {
      const admin = localStorage.getItem("admin");
      if (admin) {
        try {
          const parsedAdmin = JSON.parse(admin);
          setAdminData(parsedAdmin.admin);
        } catch (error) {
          console.error("Error parsing admin data:", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin");
      router.push("/admin/login");
    }
  };

  const navItems = [
    { name: t.admin.nav.dashboard, href: "/admin" },
    { name: t.admin.nav.projects, href: "/admin/projects" },
    { name: t.admin.nav.partnerships, href: "/admin/partnerships" },
    { name: t.admin.nav.certifications, href: "/admin/certifications" },
    { name: t.admin.nav.awards, href: "/admin/awards" },
    { name: t.admin.nav.careers, href: "/admin/careers" },
    { name: t.admin.nav.press, href: "/admin/press" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-[#0f1419]/95 via-[#1a2d27]/95 to-[#0f1419]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-gradient-to-r from-[#0f1419]/90 via-[#1a2d27]/90 to-[#0f1419]/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Award className="h-8 w-8 text-[#65a30d]" />
            <div>
              <h1 className="text-2xl font-bold text-white">{t.admin.header.title}</h1>
              <p className="text-sm text-gray-400">{currentPage} {t.admin.nav.management}</p>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 ${
                  currentPage === item.name
                    ? "text-[#65a30d] font-medium"
                    : "text-gray-300 hover:text-white hover:text-[#65a30d]/80"
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#65a30d]/30 transition-all duration-200"
              >
                <User className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300 text-sm">
                  {adminData?.username || "Admin"}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-[#0f1419]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-white font-medium text-sm">
                          {adminData?.username || "Admin"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {adminData?.email || "admin@mkgroup.com"}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          // Add settings functionality here
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-[#65a30d] transition-colors duration-200"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm">{t.admin.header.settings}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">{t.admin.header.logout}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default AdminHeader; 