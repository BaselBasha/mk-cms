'use client'
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Calendar, 
  MapPin, 
  Star,
  Users,
  Globe,
  Award,
  FileText,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Target,
  TrendingUp
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
    const palette = [
      "#65a30d",
      "#84cc16",
      "#a3e635",
      "#a3a29b",
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
        this.angularSpeed = (Math.random() - 0.5) * 0.01;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      update() {
        this.angle += this.angularSpeed;
        this.x += this.directionX + Math.sin(this.angle) * 0.2;
        this.y += this.directionY + Math.cos(this.angle) * 0.2;
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2.5 + 1.2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.4 - 0.2;
        let directionY = Math.random() * 0.4 - 0.2;
        let color = palette[Math.floor(Math.random() * palette.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
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

// --- Sample Partnership Data ---
const partnershipData = {
  id: 1,
  title: "GreenTech Solutions Partnership",
  summary: "Strategic alliance revolutionizing sustainable irrigation technology across the Middle East",
  description: `Our partnership with GreenTech Solutions represents a groundbreaking collaboration that's reshaping the future of desert agriculture. Since 2020, we've been working together to develop cutting-edge irrigation systems that reduce water consumption by up to 40% while increasing crop yields by 25%.

This partnership has enabled us to implement state-of-the-art drip irrigation technology across over 15,000 hectares of previously unusable desert land. The collaboration combines our deep understanding of desert agriculture with GreenTech's innovative water management solutions.

Together, we've developed proprietary sensor networks that monitor soil moisture, temperature, and nutrient levels in real-time, allowing for precise irrigation scheduling that maximizes efficiency while minimizing waste. The partnership has also led to the development of solar-powered irrigation systems that operate completely off-grid, making large-scale desert farming economically viable.

Our joint research has resulted in three breakthrough patents for desert irrigation technology, and we've successfully implemented these solutions not only in Egypt but also in Jordan, Saudi Arabia, and Morocco. The partnership continues to expand with plans for new projects in Sub-Saharan Africa.`,
  partnerInformation: {
    name: "GreenTech Solutions",
    founded: "2015",
    headquarters: "Dubai, UAE",
    employees: "250+",
    specialization: "Smart Irrigation & Water Management",
    website: "https://greentech-solutions.com",
    ceo: "Dr. Ahmad Hassan",
    revenue: "$45M (2023)"
  },
  partnerLinks: [
    {
      title: "Official Website",
      url: "https://greentech-solutions.com",
      type: "website"
    },
    {
      title: "Partnership Press Release",
      url: "https://greentech-solutions.com/mk-partnership",
      type: "press"
    },
    {
      title: "Joint Research Publication",
      url: "https://research.greentech.com/desert-irrigation",
      type: "research"
    },
    {
      title: "Case Study: Wadi El Natrun Project",
      url: "https://greentech-solutions.com/case-studies/wadi-el-natrun",
      type: "case-study"
    }
  ],
  attachments: [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop",
      title: "Smart Drip Irrigation System Installation",
      description: "Advanced irrigation technology being implemented in our Wadi El Natrun facility"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1591785536093-ac933b43a955?q=80&w=2940&auto=format&fit=crop",
      title: "Soil Sensor Network Deployment",
      description: "IoT sensors monitoring soil conditions across 5,000 hectares"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2874&auto=format&fit=crop",
      title: "Solar-Powered Irrigation Hub",
      description: "Sustainable energy solutions powering our irrigation systems"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1542451313-380d331656c4?q=80&w=2874&auto=format&fit=crop",
      title: "Partnership Signing Ceremony",
      description: "Historic partnership agreement signing in Dubai, 2020"
    },
    {
      type: "video",
      url: "https://player.vimeo.com/video/507832639?h=a8b6e7f9c0",
      title: "Partnership Success Story",
      description: "Documentary showcasing the impact of our collaboration"
    },
    {
      type: "document",
      url: "/documents/partnership-agreement.pdf",
      title: "Partnership Agreement",
      description: "Official partnership documentation and terms"
    },
    {
      type: "document",
      url: "/documents/joint-research-findings.pdf",
      title: "Research Findings Report",
      description: "Comprehensive analysis of irrigation efficiency improvements"
    }
  ],
  timeline: [
    {
      year: "2020",
      event: "Partnership Established",
      description: "Strategic alliance formed with initial $5M investment"
    },
    {
      year: "2021",
      event: "First Pilot Project",
      description: "Successful implementation across 1,000 hectares"
    },
    {
      year: "2022",
      event: "Technology Patent Filed",
      description: "Joint patent application for smart irrigation system"
    },
    {
      year: "2023",
      event: "Regional Expansion",
      description: "Partnership expanded to Jordan and Saudi Arabia"
    },
    {
      year: "2024",
      event: "Award Recognition",
      description: "Received Middle East Sustainability Award"
    }
  ],
  achievements: [
    {
      title: "40% Water Reduction",
      description: "Achieved 40% reduction in water consumption across all projects"
    },
    {
      title: "25% Yield Increase",
      description: "Increased crop yields by 25% through optimized irrigation"
    },
    {
      title: "15,000 Hectares",
      description: "Successfully implemented across 15,000 hectares of desert land"
    },
    {
      title: "3 Patents",
      description: "Developed 3 breakthrough patents for desert irrigation"
    }
  ],
  priority: "high",
  status: "active",
  startDate: "2020-03-15",
  nextMilestone: "Sub-Saharan Africa Expansion - Q3 2024"
};

// --- Media Gallery Component ---
const MediaGallery = ({ attachments }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = attachments.filter(item => item.type === "image");
  const videos = attachments.filter(item => item.type === "video");
  const documents = attachments.filter(item => item.type === "document");

  const openModal = (media, index) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div>
        <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
          <Globe className="mr-3 text-[#65a30d]" />
          Project Gallery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => openModal(image, index)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-semibold text-lg mb-1">{image.title}</h4>
                <p className="text-sm text-gray-300">{image.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <Play className="mr-3 text-[#65a30d]" />
            Video Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full h-64">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full rounded-xl"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-100 mb-2">{video.title}</h4>
                  <p className="text-sm text-gray-400">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <FileText className="mr-3 text-[#65a30d]" />
            Documents & Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <motion.a
                key={index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-black/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <Download className="text-[#65a30d] mr-4 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-100 mb-1">{doc.title}</h4>
                  <p className="text-sm text-gray-400">{doc.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Image Gallery */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 text-white hover:text-[#65a30d] z-10"
              >
                <X size={32} />
              </button>
              
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#65a30d] z-10"
              >
                <ChevronLeft size={48} />
              </button>
              
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#65a30d] z-10"
              >
                <ChevronRight size={48} />
              </button>

              <img
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.title}
                className="w-full h-full object-contain rounded-xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <h3 className="text-xl font-bold text-white mb-2">{images[currentIndex]?.title}</h3>
                <p className="text-gray-300">{images[currentIndex]?.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Partnership Details Component ---
export default function PartnershipDetails() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "details", label: "Partnership Details", icon: Users },
    { id: "media", label: "Media Gallery", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Calendar }
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-200 font-sans relative">
      <ParticleBackground />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#84cc16] to-[#65a30d] bg-clip-text text-transparent">
              {partnershipData.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {partnershipData.summary}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                <Calendar className="mr-2 text-[#65a30d]" size={16} />
                <span className="text-sm">Since {new Date(partnershipData.startDate).getFullYear()}</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                <MapPin className="mr-2 text-[#65a30d]" size={16} />
                <span className="text-sm">{partnershipData.partnerInformation.headquarters}</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                <TrendingUp className="mr-2 text-[#65a30d]" size={16} />
                <span className="text-sm">{partnershipData.partnerInformation.revenue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievement Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {partnershipData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-[#65a30d] mb-2">{achievement.title}</div>
                <p className="text-gray-300 text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 sticky top-20 z-30 bg-black/50 backdrop-blur-lg border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#65a30d] text-black font-semibold'
                      : 'bg-black/20 text-gray-300 hover:bg-black/40'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 min-h-screen">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {activeTab === "overview" && (
                <div className="max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-100 mb-6">Partnership Overview</h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed mb-6">
                          {partnershipData.description.split('\n')[0]}
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          {partnershipData.description.split('\n')[1]}
                        </p>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                          <Target className="mr-2 text-[#65a30d]" />
                          Next Milestone
                        </h3>
                        <p className="text-gray-300">{partnershipData.nextMilestone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                          <Users className="mr-2 text-[#65a30d]" />
                          Partner Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Company:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Founded:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.founded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Headquarters:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.headquarters}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Employees:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.employees}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">CEO:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.ceo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Specialization:</span>
                            <span className="text-gray-200">{partnershipData.partnerInformation.specialization}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-100 mb-6">Detailed Description</h2>
                      <div className="prose prose-invert max-w-none">
                        {partnershipData.description.split('\n').map((paragraph, index) => (
                          <p key={index} className="text-gray-300 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-gray-100 mb-6">Partner Links</h2>
                      <div className="space-y-4">
                        {partnershipData.partnerLinks.map((link, index) => (
                          <motion.a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-black/30 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center">
                              <ExternalLink className="text-[#65a30d] mr-3" size={20} />
                              <div>
                                <h4 className="font-semibold text-gray-100">{link.title}</h4>
                                <p className="text-sm text-gray-400 capitalize">{link.type.replace('-', ' ')}</p>
                              </div>
                            </div>
                            <ChevronRight className="text-gray-400" size={20} />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Media Gallery</h2>
                  <MediaGallery attachments={partnershipData.attachments} />
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Partnership Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#65a30d] to-transparent"></div>
                    <div className="ml-12 space-y-8">
                      {partnershipData.timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-[#65a30d] flex items-center justify-center text-white font-bold shadow-lg">
                            {item.year}
                          </div>
                          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 ml-2">
                            <h4 className="text-xl font-bold text-gray-100 mb-2">{item.event}</h4>
                            <p className="text-gray-300 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}