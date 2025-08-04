"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  Play,
  X,
  Download,
  ExternalLink,
  CheckCircle,
  Target,
  Zap,
  Globe,
  Building,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPartnerships } from "@/redux/partnershipsSlice";

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
        let color = "rgba(101, 163, 13, 0.3)";
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
        position: "absolute",
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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
        <motion.button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-300 hover:text-[#65a30d] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </motion.button>
      </div>
    </header>
  );
};

// --- Partnership Card Component ---
const PartnershipCard = ({ partnership, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the first image from attachments or use a default image
  const getPartnershipImage = () => {
    // Check if partnership has an image field (single image)
    if (partnership.image && partnership.image.url) {
      return partnership.image.url;
    }
    
    // Check if partnership has attachments array
    if (partnership.attachments && partnership.attachments.length > 0) {
      const firstImage = partnership.attachments.find(attachment => attachment.type === 'image');
      if (firstImage) {
        return firstImage.url;
      }
    }
    
    // Return a default image if no images found
    return "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <Link href={`/partnerships/${partnership._id || partnership.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:border-[#65a30d]/50">
          {/* Background Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={getPartnershipImage()}
              alt={partnership.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-[#65a30d]" />
                <span className="text-sm text-gray-400">
                  {partnership.category || "Partnership"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Handshake className="h-4 w-4 text-[#65a30d]" />
                <span className="text-sm text-gray-400">
                  {partnership.status || "Active"}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#65a30d] transition-colors">
              {partnership.title}
            </h3>

            <p className="text-gray-300 mb-4 line-clamp-3">
              {partnership.summary || partnership.description}
            </p>

            {/* Partnership Details */}
            <div className="space-y-2 mb-4">
              {partnership.partnerInformation?.name && (
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-[#65a30d]" />
                  <span className="text-gray-300">{partnership.partnerInformation.name}</span>
                </div>
              )}
              {partnership.partnerInformation?.headquarters && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#65a30d]" />
                  <span className="text-gray-300">{partnership.partnerInformation.headquarters}</span>
                </div>
              )}
              {partnership.startDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#65a30d]" />
                  <span className="text-gray-300">Since {new Date(partnership.startDate).getFullYear()}</span>
                </div>
              )}
            </div>

            {/* Key Benefits */}
            {partnership.achievements && partnership.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Key Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {partnership.achievements.slice(0, 3).map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#65a30d]/20 text-[#65a30d] text-xs rounded-full"
                    >
                      {achievement.title}
                    </span>
                  ))}
                  {partnership.achievements.length > 3 && (
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                      +{partnership.achievements.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Read More Button */}
            <div className="flex items-center justify-between">
              <span className="text-[#65a30d] font-medium text-sm group-hover:underline">
                Learn More
              </span>
              <ExternalLink className="h-4 w-4 text-[#65a30d] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Partnerships Page Component ---
export default function PartnershipsPage() {
  const dispatch = useDispatch();
  const { publicItems: partnerships, loading, error } = useSelector((state) => state.partnerships);

  useEffect(() => {
    dispatch(fetchPublicPartnerships());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#65a30d] text-white px-6 py-3 rounded-xl hover:bg-[#84cc16] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative min-h-screen">
      <ParticleBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-[#65a30d]/20 border border-[#65a30d]/30 rounded-full mb-6"
            >
              <span className="text-[#65a30d] font-medium">
                Strategic Partnerships
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Our Partnerships
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Building strong alliances and collaborative relationships to drive innovation and sustainable growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnerships Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {partnerships.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Handshake className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No Partnerships Yet</h3>
              <p className="text-gray-400">We're working on building strategic partnerships. Check back soon!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerships.map((partnership, index) => (
                <PartnershipCard
                  key={partnership._id || partnership.id}
                  partnership={partnership}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 mt-20 relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <img
              src="/MK-GROUP.png"
              alt="MK Group Logo"
              className="h-12 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} MK Group. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 