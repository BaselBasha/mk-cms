'use client'
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPartnershipById } from "@/redux/partnershipsSlice";
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
  TrendingUp,
  Building,
  User
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

// --- Media Gallery Component ---
const MediaGallery = ({ attachments = [], image = null }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine single image and attachments
  const allImages = [];
  if (image && image.url) {
    allImages.push({
      type: 'image',
      url: image.url,
      title: image.name || 'Partnership Image',
      description: 'Partnership image'
    });
  }
  
  if (attachments && attachments.length > 0) {
    allImages.push(...attachments.filter(item => item.type === "image"));
  }

  const images = allImages;
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
      {images.length > 0 && (
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
      )}

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
        {selectedMedia && images.length > 0 && (
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
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentItem: partnership, loading, error } = useSelector((state) => state.partnerships);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPublicPartnershipById(params.id));
    }
  }, [dispatch, params.id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-gray-200 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/partnerships')}
            className="bg-[#65a30d] text-white px-6 py-3 rounded-xl hover:bg-[#84cc16] transition-colors"
          >
            Back to Partnerships
          </button>
        </div>
      </div>
    );
  }

  if (!partnership) {
    return (
      <div className="min-h-screen bg-transparent text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Partnership not found</p>
          <button
            onClick={() => router.push('/partnerships')}
            className="bg-[#65a30d] text-white px-6 py-3 rounded-xl hover:bg-[#84cc16] transition-colors"
          >
            Back to Partnerships
          </button>
        </div>
      </div>
    );
  }

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
              {partnership.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {partnership.summary}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                <Calendar className="mr-2 text-[#65a30d]" size={16} />
                <span className="text-sm">Since {new Date(partnership.startDate).getFullYear()}</span>
              </div>
              {partnership.partnerInformation?.headquarters && (
                <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                  <MapPin className="mr-2 text-[#65a30d]" size={16} />
                  <span className="text-sm">{partnership.partnerInformation.headquarters}</span>
                </div>
              )}
              {partnership.partnerInformation?.revenue && (
                <div className="flex items-center bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                  <TrendingUp className="mr-2 text-[#65a30d]" size={16} />
                  <span className="text-sm">{partnership.partnerInformation.revenue}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image Section */}
    

      {/* Achievement Cards */}
      {partnership.achievements && partnership.achievements.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {partnership.achievements.map((achievement, index) => (
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
      )}

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
                          {partnership.description}
                        </p>
                      </div>
                      
                      {partnership.nextMilestone && (
                        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                          <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                            <Target className="mr-2 text-[#65a30d]" />
                            Next Milestone
                          </h3>
                          <p className="text-gray-300">{partnership.nextMilestone}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
                          <Users className="mr-2 text-[#65a30d]" />
                          Partner Information
                        </h3>
                        <div className="space-y-4">
                          {partnership.partnerInformation?.name && (
                            <div className="flex items-center space-x-3">
                              <Building className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Partner Name</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.name}</div>
                              </div>
                            </div>
                          )}
                          {partnership.partnerInformation?.founded && (
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Founded</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.founded}</div>
                              </div>
                            </div>
                          )}
                          {partnership.partnerInformation?.headquarters && (
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Headquarters</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.headquarters}</div>
                              </div>
                            </div>
                          )}
                          {partnership.partnerInformation?.employees && (
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Employees</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.employees}</div>
                              </div>
                            </div>
                          )}
                          {partnership.partnerInformation?.specialization && (
                            <div className="flex items-center space-x-3">
                              <Target className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Specialization</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.specialization}</div>
                              </div>
                            </div>
                          )}
                          
                          {partnership.partnerInformation?.ceo && (
                            <div className="flex items-center space-x-3">
                              <User className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">CEO</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.ceo}</div>
                              </div>
                            </div>
                          )}
                          {partnership.partnerInformation?.revenue && (
                            <div className="flex items-center space-x-3">
                              <TrendingUp className="h-5 w-5 text-[#65a30d] flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-400 text-sm">Revenue</span>
                                <div className="text-gray-200 font-medium">{partnership.partnerInformation.revenue}</div>
                              </div>
                            </div>
                          )}
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
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {partnership.description}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-gray-100 mb-6">Partner Links</h2>
                      <div className="space-y-4">
                        {partnership.partnerLinks && partnership.partnerLinks.length > 0 ? (
                          partnership.partnerLinks.map((link, index) => (
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
                                  <p className="text-sm text-gray-400 capitalize">{link.type?.replace('-', ' ')}</p>
                                </div>
                              </div>
                              <ChevronRight className="text-gray-400" size={20} />
                            </motion.a>
                          ))
                        ) : (
                          <p className="text-gray-400">No partner links available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Media Gallery</h2>
                  <MediaGallery attachments={partnership.attachments} image={partnership.image} />
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">Partnership Timeline</h2>
                  {partnership.timeline && partnership.timeline.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#65a30d] to-transparent"></div>
                      <div className="ml-12 space-y-8">
                        {partnership.timeline.map((item, idx) => (
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
                  ) : (
                    <p className="text-gray-400 text-center">No timeline events available</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}