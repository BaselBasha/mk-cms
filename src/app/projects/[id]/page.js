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
export default function ProjectDetailPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock project data
  const project = {
    id: 123,
    title: "Wadi El Natrun Desert Reclamation Project",
    summary:
      "Transforming 5,000 hectares of barren desert into thriving agricultural land through innovative Jojoba cultivation and sustainable farming practices.",
    description:
      "The Wadi El Natrun Desert Reclamation Project represents our most ambitious undertaking to date. This groundbreaking initiative transforms previously unusable desert terrain into productive agricultural land, demonstrating the potential for sustainable development in Egypt's most challenging environments.\n\nUtilizing cutting-edge drip irrigation systems, soil enrichment techniques, and our proprietary Jojoba cultivars, we've created a self-sustaining ecosystem that not only produces high-quality Jojoba oil but also serves as a model for desert agriculture worldwide.\n\nThe project incorporates renewable energy sources, water conservation technologies, and biodiversity preservation measures, ensuring minimal environmental impact while maximizing agricultural output. Our integrated approach combines traditional farming wisdom with modern agricultural science to create a truly revolutionary farming system.",
    budget: "$12.5 Million",
    location: "Wadi El Natrun, Egypt",
    area: "5,000 Hectares",
    duration: "2019 - 2024",
    status: "Completed",
    successPartner: "GreenTech Solutions & Desert Bloom Initiative",
    priority: "High",
    attachments: {
      images: [
        "https://mkgroup-eg.com/wp-content/uploads/2024/05/The-Jojoba-Company-farm.jpg",
        "https://mkgroup-eg.com/wp-content/uploads/2024/05/The-Jojoba-Company-farm.jpg",
        "https://mkgroup-eg.com/wp-content/uploads/2024/07/%D9%85%D8%A8%D8%A7%D8%AF%D8%B1%D8%A9-%D9%88%D8%A7%D8%AF%D9%8A-%D8%A7%D9%84%D8%AC%D9%88%D8%AC%D9%88%D8%A8%D8%A7.jpg",
        "https://mkgroup-eg.com/wp-content/uploads/2024/07/%D9%85%D8%B4%D8%B1%D9%88%D8%B9-%D9%87%D9%8A%D8%A6%D8%A9-%D8%AA%D9%86%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%B5%D8%B9%D9%8A%D8%AF.jpg",
        "https://mkgroup-eg.com/wp-content/uploads/2024/05/The-Jojoba-Company-farm.jpg",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop",
      ],
      videos: [
        "https://youtu.be/10A4z4EKidghttps://youtu.be/10A4z4EKidg?si=-0CJGkyguVvhTmjt",
        "https://www.w3schools.com/html/movie.mp4",
      ],
      documents: [
        { name: "Project Technical Report.pdf", size: "2.3 MB" },
        { name: "Environmental Impact Assessment.pdf", size: "1.8 MB" },
        { name: "Financial Analysis.xlsx", size: "890 KB" },
      ],
    },
    awards: [
      {
        title: "Best Sustainable Agriculture Project 2024",
        organization: "Middle East Green Awards",
        year: "2024",
      },
      {
        title: "Innovation in Desert Agriculture",
        organization: "Global Agriculture Forum",
        year: "2023",
      },
    ],
    keyMetrics: [
      {
        label: "Water Savings",
        value: "40%",
        icon: <Globe className="h-6 w-6" />,
      },
      {
        label: "Soil Recovery",
        value: "85%",
        icon: <Target className="h-6 w-6" />,
      },
      {
        label: "Job Creation",
        value: "250+",
        icon: <Users className="h-6 w-6" />,
      },
      {
        label: "CO2 Reduction",
        value: "1,200 tons",
        icon: <Zap className="h-6 w-6" />,
      },
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
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              {project.summary}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-5 w-5 text-[#65a30d]" />
                <span className="text-gray-300">{project.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="h-5 w-5 text-[#65a30d]" />
                <span className="text-gray-300">{project.duration}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <DollarSign className="h-5 w-5 text-[#65a30d]" />
                <span className="text-gray-300">{project.budget}</span>
              </div>
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
            {project.keyMetrics.map((metric, index) => (
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
                openMediaModal(project.attachments.images[0], "image")
              }
            >
              <img
                src={project.attachments.images[0]}
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

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {project.attachments.images.slice(1).map((image, index) => (
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

          {/* Video Section */}
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
              {project.attachments.videos.map((video, index) => (
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
                {project.description.split("\n\n").map((paragraph, index) => (
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
                      {project.area}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority</span>
                    <span className="text-[#65a30d] font-medium">
                      {project.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Success Partner</span>
                    <span className="text-white font-medium text-right max-w-[200px]">
                      {project.successPartner}
                    </span>
                  </div>
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Awards & Recognition
                </h3>
                <div className="space-y-4">
                  {project.awards.map((award, index) => (
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
            {project.attachments.documents.map((doc, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#65a30d]/20 rounded-xl flex items-center justify-center">
                    <Download className="h-6 w-6 text-[#65a30d]" />
                  </div>
                  <span className="text-gray-400 text-sm">{doc.size}</span>
                </div>
                <h3 className="text-white font-medium mb-2 group-hover:text-[#65a30d] transition-colors">
                  {doc.name}
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
      <footer className="bg-black/30 border-t border-white/10 mt-20">
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
