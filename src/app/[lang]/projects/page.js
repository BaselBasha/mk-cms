"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProjects } from "@/redux/projectsSlice";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Search,
  Filter,
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
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);

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
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      init();
    };

    init();
    animate();
    window.addEventListener("resize", handleResize);

    // Update canvas height when content changes
    const updateCanvasHeight = () => {
      if (canvas) {
        canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        init();
      }
    };

    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(updateCanvasHeight);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
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
        width: "100vw",
        height: "100vh",
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
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center max-w-7xl">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/">
            <img
              src="/MK-GROUP.png"
              alt="MK Group Logo"
              className="h-12 w-auto"
            />
          </Link>
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

// --- Project Card Component ---
const ProjectCard = ({ project }) => {
  const params = useParams();
  const currentLang = params.lang || 'en';

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "in-progress":
        return "text-yellow-400";
      case "planning":
        return "text-blue-400";
      case "on-hold":
        return "text-orange-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#65a30d]/30 transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            project.images && project.images.length > 0
              ? typeof project.images[0] === "string"
                ? project.images[0]
                : project.images[0].url
              : "https://mkgroup-eg.com/wp-content/uploads/2024/05/The-Jojoba-Company-farm.jpg"
          }
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )} bg-black/50 backdrop-blur-sm`}
          >
            {project.status.replace("-", " ")}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              project.priority
            )} bg-black/50 backdrop-blur-sm`}
          >
            {project.priority}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#65a30d] transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-2">{project.summary}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#65a30d]" />
            <span className="text-gray-300">{project.location}</span>
          </div>
          {project.budget && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-[#65a30d]" />
              <span className="text-gray-300">{project.budget}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-[#65a30d]" />
            <span className="text-gray-300">{project.area}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-[#65a30d]" />
            <span className="text-gray-300">
              {new Date(project.startDate).getFullYear()} -{" "}
              {new Date(project.endDate).getFullYear()}
            </span>
          </div>
        </div>

        {project.successPartner && (
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4 text-[#65a30d]" />
            <span className="text-gray-300 text-sm">
              {project.successPartner}
            </span>
          </div>
        )}

        <Link
          href={`/${currentLang}/projects/${project._id || project.id}`}
          className="inline-flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors font-medium"
        >
          <span>View Details</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// --- Main Projects Page Component ---
export default function ProjectsPage() {
  const dispatch = useDispatch();
  const {
    publicItems: projects,
    loading,
    error,
  } = useSelector((state) => state.projects);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    console.log('Dispatching fetchPublicProjects...');
    dispatch(fetchPublicProjects());
  }, [dispatch]);

  useEffect(() => {
    console.log('Projects state updated:', { projects, loading, error });
    
    // Update canvas height when projects data changes
    const updateCanvas = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      }
    };
    
    // Small delay to ensure DOM is updated
    setTimeout(updateCanvas, 100);
  }, [projects, loading, error]);

  // Filter projects based on search and filters
  const filteredProjects =
    (projects || [])?.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || project.status === statusFilter;
      const matchesPriority =
        !priorityFilter || project.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "planning", label: "Planning" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1a2d27] via-[#33413d] to-[#1a2d27] text-gray-200 font-sans overflow-x-hidden relative min-h-screen w-full">
      <ParticleBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              Discover our landmark projects transforming desert landscapes into
              thriving agricultural ecosystems
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-gray-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-gray-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setPriorityFilter("");
                }}
                className="px-4 py-3 bg-[#65a30d] hover:bg-[#84cc16] text-white rounded-xl transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">
                Error loading projects: {error}
              </p>
              <button
                onClick={() => dispatch(fetchPublicProjects())}
                className="bg-[#65a30d] text-white px-6 py-3 rounded-xl hover:bg-[#84cc16] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && Array.isArray(projects) && (
            <>
              <div className="mb-8">
                <p className="text-gray-400">
                  Showing {filteredProjects.length} of {projects.length}{" "}
                  projects
                </p>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-xl mb-4">
                    No projects found
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project._id || project.id}
                      project={project}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Handle case where projects is not an array */}
          {!loading && !error && !Array.isArray(projects) && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">
                Error: Invalid projects data
              </p>
              <p className="text-gray-500">Please try refreshing the page</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 mt-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
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
