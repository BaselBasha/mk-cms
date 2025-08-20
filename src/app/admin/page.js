"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { fetchDashboardStats } from "@/utils/api";
import {
  Plus,
  FileText,
  Award,
  Users,
  Newspaper,
  Shield,
  LogOut,
  User,
  Settings,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// --- Particle Background Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;

    let particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.2 - 0.1;
        let directionY = Math.random() * 0.2 - 0.1;
        let color = "rgba(101, 163, 13, 0.2)";
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      init();
    };

    init();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background:
          "linear-gradient(135deg, #0f1419 0%, #1a2d27 50%, #0f1419 100%)",
      }}
    />
  );
};

// --- Stats Card Component ---
const StatsCard = ({ title, value, icon, color, trend, loading }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">
          {loading ? (
            <div className="animate-pulse bg-gray-600 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </div>
        <div className="text-sm text-gray-400">{trend}</div>
      </div>
    </div>
    <h3 className="text-white font-medium">{title}</h3>
  </motion.div>
);

// --- Quick Action Card Component ---
const QuickActionCard = ({ title, description, icon, href, color }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer group h-full"
      >
        <div
          className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#65a30d] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex items-center text-[#65a30d] font-medium">
          <span>{t.admin.quickActions.getStarted}</span>
          <Plus className="h-4 w-4 ml-2" />
        </div>
      </motion.div>
    </Link>
  );
};

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  const [stats, setStats] = useState({
    projects: { total: 0, thisMonth: 0 },
    certifications: { total: 0, thisMonth: 0 },
    partnerships: { total: 0, thisMonth: 0 },
    awards: { total: 0, thisMonth: 0 },
    careers: { total: 0, thisMonth: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch dashboard stats
  const loadStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await fetchDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("admin")) {
      router.push("/admin/login");
    }
  }, [router]);

  // Signout logic
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin");
      router.push("/admin/login");
    }
  };

  const quickActions = [
    {
      title: t.admin.quickActions.addProject,
      description: t.admin.quickActions.addProjectDesc,
      icon: <FileText className="h-8 w-8 text-[#65a30d]" />,
      href: "/admin/projects/new",
      color: "bg-[#65a30d]/20",
    },
    {
      title: t.admin.quickActions.addCertification,
      description: t.admin.quickActions.addCertificationDesc,
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      href: "/admin/certifications/new",
      color: "bg-blue-500/20",
    },
    {
      title: t.admin.quickActions.addPartnership,
      description: t.admin.quickActions.addPartnershipDesc,
      icon: <Users className="h-8 w-8 text-purple-400" />,
      href: "/admin/partnerships/new",
      color: "bg-purple-500/20",
    },
    {
      title: t.admin.quickActions.addAward,
      description: t.admin.quickActions.addAwardDesc,
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      href: "/admin/awards/new",
      color: "bg-yellow-500/20",
    },
    {
      title: t.admin.quickActions.addCareer,
      description: t.admin.quickActions.addCareerDesc,
      icon: <Briefcase className="h-8 w-8 text-orange-400" />,
      href: "/admin/careers/new",
      color: "bg-blue-500/20",
    },
    {
      title: t.admin.quickActions.addPressRelease,
      description: t.admin.quickActions.addPressReleaseDesc,
      icon: <Newspaper className="h-8 w-8 text-red-400" />,
      href: "/admin/press/new",
      color: "bg-red-500/20",
    },
  ];

  return (
    <div 
      className="bg-transparent text-gray-200 font-sans min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader currentPage={t.admin.nav.dashboard} />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {t.admin.dashboard.welcome}
          </h1>
          <p className="text-xl text-gray-400">
            {t.admin.dashboard.subtitle}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {t.admin.dashboard.statsOverview}
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-gray-400 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span className="text-gray-400">{t.admin.dashboard.refresh}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title={t.admin.stats.totalProjects}
              value={stats.projects.total}
              icon={<FileText className="h-6 w-6 text-[#65a30d]" />}
              color="bg-[#65a30d]/20"
              trend={`+${stats.projects.thisMonth} ${t.admin.stats.thisMonth}`}
              loading={loading}
            />
            <StatsCard
              title={t.admin.stats.certifications}
              value={stats.certifications.total}
              icon={<Shield className="h-6 w-6 text-blue-400" />}
              color="bg-blue-500/20"
              trend={`+${stats.certifications.thisMonth} ${t.admin.stats.thisMonth}`}
              loading={loading}
            />
            <StatsCard
              title={t.admin.stats.activePartnerships}
              value={stats.partnerships.total}
              icon={<Users className="h-6 w-6 text-purple-400" />}
              color="bg-purple-500/20"
              trend={`+${stats.partnerships.thisMonth} ${t.admin.stats.thisMonth}`}
              loading={loading}
            />
            <StatsCard
              title={t.admin.stats.awardsWon}
              value={stats.awards.total}
              icon={<Award className="h-6 w-6 text-yellow-400" />}
              color="bg-yellow-500/20"
              trend={`+${stats.awards.thisMonth} ${t.admin.stats.thisMonth}`}
              loading={loading}
            />
            <StatsCard
              title={t.admin.stats.openPositions}
              value={stats.careers.total}
              icon={<Briefcase className="h-6 w-6 text-orange-400" />}
              color="bg-orange-500/20"
              trend={`+${stats.careers.thisMonth} ${t.admin.stats.thisMonth}`}
              loading={loading}
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{t.admin.dashboard.quickActions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <QuickActionCard {...action} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Job Candidates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{t.admin.dashboard.jobCandidates}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/admin/candidates">
                <div className="group relative bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#65a30d]/20 transition-all duration-500 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#65a30d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#65a30d] transition-colors duration-300 mb-3">
                      {t.admin.dashboard.reviewCandidates}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {t.admin.dashboard.candidatesDescription}
                    </p>
                    <div className="flex items-center text-[#65a30d] font-medium">
                      <span>{t.admin.dashboard.viewCandidates}</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
