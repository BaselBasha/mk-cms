"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCertifications } from "@/redux/certificationsSlice";
import {
  Award,
  Calendar,
  Globe,
  Shield,
  Check,
  ArrowLeft,
  Search,
  Filter,
  X,
} from "lucide-react";

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
    const numberOfParticles = 100;

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
        let size = Math.random() * 2 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.3 - 0.15;
        let directionY = Math.random() * 0.3 - 0.15;
        let color = "rgba(200, 164, 100, 0.3)";
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
        background: "linear-gradient(135deg, #1a2d27 0%, #33413d 100%)",
      }}
    />
  );
};

// --- Header Component ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }}>
          <img
            src="/MK-GROUP.png"
            alt="MK Group Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
        </motion.div>
        <motion.a
          href="#"
          className="flex items-center space-x-2 text-gray-300 hover:text-[#65a30d] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </motion.a>
      </div>
    </header>
  );
};

// --- Hero Section ---
const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center text-white text-center">
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center"
      >
        <Award className="w-12 h-12 text-white" />
      </motion.div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65a30d] to-[#84cc16]">
          Certifications
        </span>
      </h1>
      <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-300 leading-relaxed">
        Recognized excellence in quality, sustainability, and innovation across
        global standards
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 text-sm text-gray-400"
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#65a30d]" />
          <span>15+ International Certifications</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#65a30d]" />
          <span>Global Recognition</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="w-4 h-4 text-[#65a30d]" />
          <span>Premium Quality Standards</span>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

// --- Certification Card Component ---
const CertificationCard = ({ certification, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#65a30d]/20 transition-all duration-500 h-[650px] flex flex-col"
    whileHover={{ y: -10, scale: 1.02 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#65a30d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {/* Certificate Image */}
    <div className="relative h-48 bg-white/90 flex items-center justify-center p-6 flex-shrink-0">
      {certification.image?.url ? (
        <img
          src={certification.image.url}
          alt={certification.title}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`flex items-center justify-center w-full h-full ${certification.image?.url ? 'hidden' : ''}`}
        style={{ display: certification.image?.url ? 'none' : 'flex' }}
      >
        <Award className="w-16 h-16 text-gray-400" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    {/* Content */}
    <div className="p-8 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white group-hover:text-[#65a30d] transition-colors duration-300 line-clamp-2">
          {certification.title}
        </h3>
        <div className="flex items-center space-x-1 text-[#65a30d] flex-shrink-0">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3 flex-1">
        {certification.summary}
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Issue Date:</span>
          <span className="text-gray-300 font-medium">
            {new Date(certification.issueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Valid Until:</span>
          <span className="text-gray-300 font-medium">
            {new Date(certification.validUntil).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Issuing Body:</span>
          <span className="text-gray-300 font-medium truncate max-w-[120px]">
            {certification.issuingBody}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Key Features:
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {(certification.features || []).slice(0, 3).map((feature, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 text-sm text-gray-400"
            >
              <Check className="w-3 h-3 text-[#65a30d] flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
          {(certification.features || []).length > 3 && (
            <div className="text-sm text-gray-500 italic">
              +{(certification.features || []).length - 3} more features...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            certification.priority === "High"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : certification.priority === "Medium"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : "bg-green-500/20 text-green-300 border border-green-500/30"
          }`}
        >
          {certification.priority} Priority
        </div>
        {certification.documents && certification.documents.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (certification.documents.length === 1) {
                // Single document - open directly
                window.open(certification.documents[0].url, '_blank');
              } else {
                // Multiple documents - open each in new tab
                certification.documents.forEach((doc) => {
                  window.open(doc.url, '_blank');
                });
              }
            }}
            className="bg-[#65a30d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#528000] transition-colors duration-300 flex items-center space-x-2 cursor-pointer z-10 relative"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Documents</span>
          </motion.button>
        )}
      </div>
    </div>
  </motion.div>
);

// --- Filter Component ---
const FilterSection = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#65a30d] text-white shadow-lg"
                    : "bg-black/20 text-gray-300 hover:bg-white/5 border border-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Statistics Section ---
const StatsSection = ({
  totalCertifications,
  activeCertifications,
  categories,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="py-20"
  >
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Total Certifications",
            value: totalCertifications,
            icon: Award,
          },
          {
            title: "Active Certifications",
            value: activeCertifications,
            icon: Shield,
          },
          {
            title: "Certification Categories",
            value: categories.length - 1,
            icon: Globe,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center">
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function CertificationsPage() {
  const dispatch = useDispatch();
  const { publicItems: certifications, loading, error } = useSelector((state) => state.certifications);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPublicCertifications());
  }, [dispatch]);

  const categories = [
    "All",
    "Quality",
    "Environmental",
    "Organic",
    "Food Safety",
    "Accreditation",
    "National",
  ];

  if (loading) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Loading certifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error loading certifications</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const filteredCertifications = certifications.filter((cert) => {
    const matchesCategory =
      activeCategory === "All" || cert.category === activeCategory;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCertifications = certifications.filter(
    (cert) => new Date(cert.validUntil) > new Date()
  ).length;

  return (
    <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative min-h-screen">
      <ParticleBackground />
      <Header />

      <main>
        <HeroSection />

        <StatsSection
          totalCertifications={certifications.length}
          activeCertifications={activeCertifications}
          categories={categories}
        />

        <FilterSection
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <section className="py-20">
          <div className="container mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchTerm}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCertifications.map((cert, index) => (
                  <CertificationCard
                    key={cert._id || cert.id}
                    certification={cert}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredCertifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">
                  No certifications found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
