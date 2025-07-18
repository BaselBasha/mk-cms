"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Award,
  Users,
  Newspaper,
  Shield,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  LogOut,
  User,
  Settings,
  Globe,
  Target,
  Zap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// --- Admin Header Component ---
const AdminHeader = ({ onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/MK-GROUP.png"
              alt="MK Group Logo"
              className="h-10 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Content Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#65a30d]" />
                </div>
                <span className="text-white font-medium hidden sm:block">
                  Admin
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2"
                  >
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span className="text-white">Settings</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                      onClick={onLogout}
                    >
                      <LogOut className="h-4 w-4 text-gray-400" />
                      <span className="text-white">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Stats Card Component ---
const StatsCard = ({ title, value, icon, color, trend }) => (
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
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{trend}</div>
      </div>
    </div>
    <h3 className="text-white font-medium">{title}</h3>
  </motion.div>
);

// --- Quick Action Card Component ---
const QuickActionCard = ({ title, description, icon, href, color }) => (
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
        <span>Get Started</span>
        <Plus className="h-4 w-4 ml-2" />
      </div>
    </motion.div>
  </Link>
);

// --- Recent Activity Item ---
const ActivityItem = ({ type, title, time, status }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-3"
  >
    <div className="w-10 h-10 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
      <FileText className="h-5 w-5 text-[#65a30d]" />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium">{title}</h4>
      <p className="text-gray-400 text-sm">
        {type} • {time}
      </p>
    </div>
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "Published"
          ? "bg-green-500/20 text-green-400"
          : status === "Draft"
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-blue-500/20 text-blue-400"
      }`}
    >
      {status}
    </div>
  </motion.div>
);

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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
      title: "Add Project",
      description: "Create a new project with details, media, and metrics",
      icon: <FileText className="h-8 w-8 text-[#65a30d]" />,
      href: "/admin/projects/new",
      color: "bg-[#65a30d]/20",
    },
    {
      title: "Add Certification",
      description: "Upload new certifications and compliance documents",
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      href: "/admin/certifications/new",
      color: "bg-blue-500/20",
    },
    {
      title: "Add Partnership",
      description: "Register new business partnerships and collaborations",
      icon: <Users className="h-8 w-8 text-purple-400" />,
      href: "/admin/partnerships/new",
      color: "bg-purple-500/20",
    },
    {
      title: "Add Award",
      description: "Document new awards and recognitions received",
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      href: "/admin/awards/new",
      color: "bg-yellow-500/20",
    },
    {
      title: "Add Press Release",
      description: "Publish new press releases and media coverage",
      icon: <Newspaper className="h-8 w-8 text-red-400" />,
      href: "/admin/press/new",
      color: "bg-red-500/20",
    },
    {
      title: "Analytics",
      description: "View detailed analytics and performance metrics",
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      href: "/admin/analytics",
      color: "bg-green-500/20",
    },
  ];

  const recentActivity = [
    {
      type: "Project",
      title: "Desert Reclamation Project Updated",
      time: "2 hours ago",
      status: "Published",
    },
    {
      type: "Award",
      title: "Sustainability Award Added",
      time: "5 hours ago",
      status: "Published",
    },
    {
      type: "Partnership",
      title: "GreenTech Solutions Partnership",
      time: "1 day ago",
      status: "Draft",
    },
    {
      type: "Press",
      title: "New Innovation Press Release",
      time: "2 days ago",
      status: "Review",
    },
  ];

  return (
    <div className="bg-transparent text-gray-200 font-sans min-h-screen">
      <ParticleBackground />
      <AdminHeader onLogout={handleLogout} />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, Admin
          </h1>
          <p className="text-xl text-gray-400">
            Manage your content and monitor your platform's performance
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatsCard
            title="Total Projects"
            value="24"
            icon={<FileText className="h-6 w-6 text-[#65a30d]" />}
            color="bg-[#65a30d]/20"
            trend="+3 this month"
          />
          <StatsCard
            title="Certifications"
            value="12"
            icon={<Shield className="h-6 w-6 text-blue-400" />}
            color="bg-blue-500/20"
            trend="+2 this month"
          />
          <StatsCard
            title="Active Partnerships"
            value="8"
            icon={<Users className="h-6 w-6 text-purple-400" />}
            color="bg-purple-500/20"
            trend="+1 this month"
          />
          <StatsCard
            title="Awards Won"
            value="15"
            icon={<Award className="h-6 w-6 text-yellow-400" />}
            color="bg-yellow-500/20"
            trend="+4 this month"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d] transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Filter className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
                      <Globe className="h-4 w-4 text-[#65a30d]" />
                    </div>
                    <span className="text-gray-300">Page Views</span>
                  </div>
                  <span className="text-white font-bold">12.5k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Conversions</span>
                  </div>
                  <span className="text-white font-bold">234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Engagement</span>
                  </div>
                  <span className="text-white font-bold">87%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Upcoming</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Project Review</p>
                    <p className="text-gray-400 text-sm">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Content Update</p>
                    <p className="text-gray-400 text-sm">Friday, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
