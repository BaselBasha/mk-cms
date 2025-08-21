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

// --- Media Modal Component ---
const MediaModal = ({ isOpen, onClose, media, type }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-6xl max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-[#65a30d] transition-colors"
          >
            <X size={32} />
          </button>
          {type === "video" ? (
            <video
              src={media}
              controls
              autoPlay
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl"
            />
          ) : (
            <img
              src={media}
              alt="Project media"
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

// --- Project Detail Page Component ---
export default function ProjectDetailPage({ params }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/projects/public/${params.id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-transparent text-gray-200 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || 'Project not found'}</p>
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

  // Transform project data for display
  const transformedProject = {
    id: project._id || project.id,
    title: project.title,
    summary: project.summary,
    description: project.description,
    budget: project.budget,
    location: project.location,
    area: project.area,
    duration: `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`,
    status: project.status.replace("-", " "),
    successPartner: project.successPartner,
    priority: project.priority,
    attachments: {
      images: project.images?.map(img => typeof img === 'string' ? img : img.url) || [],
      videos: project.videos?.map(video => typeof video === 'string' ? video : video.url) || [],
      documents: project.documents?.map((doc, index) => {
        if (typeof doc === 'string') {
          return { url: doc, name: "Document", size: "Unknown size" };
        }
        return {
          url: doc.url,
          name: doc.name || `Document ${index + 1}`,
          size: doc.size || "Unknown size"
        };
      }) || [],
    },
    youtubeLinks: project.youtubeLinks || [],
    awards: project.awards?.map(award => ({
      title: award,
      organization: "MK Group",
      year: new Date().getFullYear()
    })) || [],
    keyMetrics: project.keyMetrics?.map((metric, index) => ({
      label: metric,
      value: "Achieved",
      icon: [<Globe key={`globe-${index}`} className="h-6 w-6" />, <Target key={`target-${index}`} className="h-6 w-6" />, <Users key={`users-${index}`} className="h-6 w-6" />, <Zap key={`zap-${index}`} className="h-6 w-6" />][index % 4]
    })) || [
        {
          label: "Project Success",
          value: "100%",
          icon: <CheckCircle key="check-circle" className="h-6 w-6" />,
        }
      ],
  };

  const openMediaModal = (media, type) => {
    setSelectedMedia(media);
    setMediaType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative min-h-screen">
      <ParticleBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
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
                Featured Project
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              {transformedProject.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              {transformedProject.summary}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-5 w-5 text-[#65a30d]" />
                <span className="text-gray-300">{transformedProject.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-5 w-5 text-[#65a30d]" />
                <span className="text-gray-300">{transformedProject.duration}</span>
              </div>
              {transformedProject.budget && (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <DollarSign className="h-5 w-5 text-[#65a30d]" />
                  <span className="text-gray-300">{transformedProject.budget}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20 bg-gradient-to-r from-black/30 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {transformedProject.keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
              >
                <div className="w-16 h-16 bg-[#65a30d]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-[#65a30d]">{metric.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-400">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Project Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#84cc16] to-[#65a30d] mx-auto rounded-full"></div>
          </motion.div>

          {/* Main Featured Image */}
          {transformedProject.attachments.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div
                className="relative group cursor-pointer overflow-hidden rounded-2xl h-96 md:h-[500px]"
                onClick={() =>
                  openMediaModal(transformedProject.attachments.images[0], "image")
                }
              >
                <img
                  src={transformedProject.attachments.images[0]}
                  alt="Main project image"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Image Grid */}
          {transformedProject.attachments.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {transformedProject.attachments.images.slice(1).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer overflow-hidden rounded-xl h-48 md:h-64"
                  onClick={() => openMediaModal(image, "image")}
                >
                  <img
                    src={image}
                    alt={`Project image ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Video Section */}
          {(transformedProject.attachments.videos.length > 0 || transformedProject.youtubeLinks.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Project Videos
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* YouTube Videos */}
                {transformedProject.youtubeLinks.map((link, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 h-64">
                    <iframe
                      src={link.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title={`Project Video ${index + 1}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}

                {/* Uploaded Videos */}
                {transformedProject.attachments.videos.map((video, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 h-64"
                    onClick={() => openMediaModal(video, "video")}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#65a30d]/90 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <span className="text-white font-medium">
                          Project Video {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">
                Project Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                {transformedProject.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-300 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Area Coverage</span>
                    <span className="text-white font-medium">
                      {transformedProject.area}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {transformedProject.status}
                    </span>
                  </div>
                  {transformedProject.priority && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Priority</span>
                      <span className="text-[#65a30d] font-medium">
                        {transformedProject.priority}
                      </span>
                    </div>
                  )}
                  {transformedProject.budget && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Budget</span>
                      <span className="text-white font-medium">
                        {transformedProject.budget}
                      </span>
                    </div>
                  )}
                  {transformedProject.successPartner && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Success Partner</span>
                      <span className="text-white font-medium text-right max-w-[200px]">
                        {transformedProject.successPartner}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Awards & Recognition
                </h3>
                <div className="space-y-4">
                  {transformedProject.awards.map((award, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-[#65a30d]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-[#65a30d]" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {award.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {award.organization} - {award.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Project Documents
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access detailed technical reports, environmental assessments, and
              project documentation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {transformedProject.attachments.documents.map((doc, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 cursor-pointer group"
                onClick={() => {
                  // Handle both string URLs and file objects
                  const url = typeof doc === 'string' ? doc : doc.url;
                  if (url) {
                    try {
                      // Create a temporary link element to trigger download
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = typeof doc === 'string' ? 'document' : (doc.name || 'document');
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (error) {
                      console.error('Download error:', error);
                      // Fallback to opening in new tab
                      window.open(url, '_blank');
                    }
                  } else {
                    console.error('No URL found for document:', doc);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#65a30d]/20 rounded-xl flex items-center justify-center">
                    <Download className="h-6 w-6 text-[#65a30d]" />
                  </div>
                  <span className="text-gray-400 text-sm">{typeof doc === 'string' ? 'Unknown size' : (doc.size || 'Unknown size')}</span>
                </div>
                <h3 className="text-white font-medium mb-2 group-hover:text-[#65a30d] transition-colors">
                  {typeof doc === 'string' ? 'Document' : (doc.name || 'Document')}
                </h3>
                <p className="text-gray-400 text-sm mb-4">Click to download</p>
                <div className="flex justify-end">
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#65a30d] transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={selectedMedia}
        type={mediaType}
      />

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
