"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPress } from "@/redux/pressSlice";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Eye,
  Clock,
  Search,
  Filter,
  Loader2,
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
    const numberOfParticles = 80;
    const palette = [
      "#65a30d",
      "#84cc16",
      "#a3e635",
      "rgba(101,163,13,0.3)",
      "rgba(132,204,22,0.3)",
      "rgba(163,230,53,0.2)",
    ];

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.008;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      update() {
        this.angle += this.angularSpeed;
        this.x += this.directionX + Math.sin(this.angle) * 0.15;
        this.y += this.directionY + Math.cos(this.angle) * 0.15;
        if (this.x > canvas.width || this.x < 0)
          this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0)
          this.directionY = -this.directionY;
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
        let color = palette[Math.floor(Math.random() * palette.length)];
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
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    />
  );
};

// --- Loading Component ---
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-transparent text-gray-200 relative">
      <ParticleBackground />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 className="w-12 h-12 text-[#65a30d]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-semibold text-gray-100 mb-2"
          >
            Loading Press Articles
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            Please wait while we fetch the content...
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Press Card Component ---
const PressCard = ({ press }) => {
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate reading time based on article length
    const wordsPerMinute = 200;
    const wordCount = press?.content ? press.content.split(" ").length : 0;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  }, [press?.content]);

  // Function to clean up publication name
  const getCleanPublicationName = (publication) => {
    if (!publication) return "Unknown";
    
    // If it's a URL, extract domain name
    if (publication.includes('http')) {
      try {
        const url = new URL(publication);
        return url.hostname.replace('www.', '');
      } catch {
        return publication;
      }
    }
    
    // If it's too long, truncate it
    if (publication.length > 20) {
      return publication.substring(0, 20) + '...';
    }
    
    return publication;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer h-[500px] flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={press.image && press.image.length > 0 ? press.image[0] : "https://mkgroup-eg.com/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-27-at-14.21.40_47a11d61.jpg"}
          alt={press.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#65a30d]/80 text-white text-xs font-medium rounded-full">
            {press.category || "Press"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(press.publishDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-[#65a30d] transition-colors flex-shrink-0">
          {press.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {press.summary}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 truncate">{press.author}</span>
          </div>
          <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400 truncate max-w-[120px]" title={press.publication}>
              {getCleanPublicationName(press.publication)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {press.tags && press.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {press.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {press.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">
                +{press.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#65a30d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// --- Main Component ---
export default function PressPage() {
  const dispatch = useDispatch();
  const { publicItems: pressArticles, loading, error } = useSelector((state) => state.press);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    console.log('Dispatching fetchPublicPress...');
    dispatch(fetchPublicPress());
  }, [dispatch]);

  useEffect(() => {
    console.log('Press state updated:', { pressArticles, loading, error });
  }, [pressArticles, loading, error]);

  // Filter articles based on search and category
  const filteredArticles = pressArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           article.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...new Set(pressArticles.map(article => article.category).filter(Boolean))];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent text-gray-200 relative">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Error Loading Articles</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-200 relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">
                  Press & Media
                </h1>
                <p className="text-sm text-gray-400">
                  Latest news and coverage about MK Group
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">
                {filteredArticles.length} of {pressArticles.length} articles
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {/* Search and Filter - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#65a30d] transition-colors text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:border-[#65a30d] transition-colors appearance-none cursor-pointer text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800 text-gray-100">
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              No articles found
            </h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No press articles available at the moment."
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((press, index) => (
              <Link key={press._id || index} href={`/press/${press._id}`}>
                <PressCard press={press} />
              </Link>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
} 