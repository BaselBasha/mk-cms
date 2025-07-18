"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Share2,
  Heart,
  Bookmark,
  Eye,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Award,
  Star,
  Clock,
  MapPin,
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

// --- Video Player Component ---
const VideoPlayer = ({ src, poster, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-64 md:h-96 object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Video Title */}
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white font-semibold text-lg bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
          {title}
        </h3>
      </div>
    </div>
  );
};

// --- Image Gallery Component ---
const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            {images[selectedImage].caption}
          </p>
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedImage === index
                ? "border-[#65a30d] shadow-lg shadow-[#65a30d]/30"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Attachment Component ---
const AttachmentCard = ({ attachment }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "video":
        return "🎬";
      case "image":
        return "🖼️";
      case "document":
        return "📋";
      default:
        return "📎";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{getFileIcon(attachment.type)}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-100">{attachment.name}</h4>
          <p className="text-sm text-gray-400">{attachment.size}</p>
        </div>
        <button className="bg-[#65a30d] p-2 rounded-full hover:bg-[#84cc16] transition-colors">
          <Download className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export default function PressArticleDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  // Mock data for the article
  const article = {
    id: 123,
    title:
      "MK Jojoba's Revolutionary Desert Agriculture Transforms Egyptian Landscape",
    summary:
      "How one company's innovative approach to jojoba cultivation is turning barren desert into thriving agricultural land while creating sustainable economic opportunities.",
    description: `
      In the heart of Egypt's Western Desert, where endless sand dunes once stretched to the horizon, something remarkable is happening. MK Jojoba, a pioneering agricultural company, has transformed over 15,000 hectares of barren land into thriving jojoba farms, creating a model for sustainable desert agriculture that's attracting international attention.

      The company's journey began in 2002 with a simple yet ambitious vision: to prove that with the right approach, desert land could be transformed into productive agricultural space. Today, their success story is reshaping perceptions about what's possible in arid environments.

      "We didn't just want to grow jojoba," explains Dr. Ahmed Hassan, the company's chief agricultural scientist. "We wanted to create a sustainable ecosystem that could support both economic growth and environmental restoration."

      The transformation hasn't been without challenges. The initial years required significant investment in soil preparation, water management systems, and research into drought-resistant cultivation techniques. However, the results speak for themselves: MK Jojoba now produces some of the highest-quality jojoba oil in the world, with their products being exported to premium cosmetics manufacturers across Europe, Asia, and North America.

      What sets MK Jojoba apart is their holistic approach to desert agriculture. Beyond just growing jojoba plants, they've implemented comprehensive soil restoration programs, introduced beneficial insects to create natural pest control systems, and developed water recycling technologies that maximize efficiency in this water-scarce environment.

      The environmental impact has been equally impressive. The company's farms now serve as carbon sinks, helping to offset emissions while improving local air quality. The vegetation has also created microclimates that support other forms of desert wildlife, contributing to biodiversity conservation efforts.

      From an economic perspective, MK Jojoba's success has created employment opportunities for over 2,000 people, many of whom are from local communities that previously had limited economic prospects. The company has also established training programs to share their knowledge with other potential desert farmers, creating a ripple effect of sustainable development.

      International recognition has followed their success. The company has received numerous awards for environmental innovation and sustainable agriculture, including the prestigious Global Agriculture Innovation Award in 2023. Their methods are now being studied and replicated in other arid regions around the world.

      Looking ahead, MK Jojoba plans to expand their operations to additional desert areas while continuing to refine their sustainable farming techniques. They're also investing in research partnerships with universities to develop new applications for jojoba and other desert-adapted crops.

      "This is just the beginning," says CEO Mohamed Khaled. "We've proven that deserts don't have to be barriers to agriculture – they can be opportunities for innovation and sustainable growth."

      The story of MK Jojoba serves as a powerful reminder that with vision, persistence, and the right approach, even the most challenging environments can be transformed into sources of prosperity and environmental benefit.
    `,
    publishedDate: "2024-01-15",
    author: "Sarah Mitchell",
    publication: "Global Agriculture Today",
    readTime: "8 min read",
    views: 15247,
    category: "Sustainable Agriculture",
    tags: [
      "Desert Agriculture",
      "Sustainability",
      "Innovation",
      "Egypt",
      "Jojoba",
    ],
    priority: 1,
    attachments: [
      {
        name: "MK Jojoba Impact Report 2023",
        type: "pdf",
        size: "2.4 MB",
        url: "/attachments/mk-jojoba-impact-report-2023.pdf",
      },
      {
        name: "Desert Transformation Time-lapse",
        type: "video",
        size: "15.6 MB",
        url: "/attachments/desert-transformation-timelapse.mp4",
      },
      {
        name: "Aerial Farm Photography",
        type: "image",
        size: "1.8 MB",
        url: "/attachments/aerial-farm-photos.zip",
      },
      {
        name: "Sustainable Farming Techniques Guide",
        type: "document",
        size: "3.2 MB",
        url: "/attachments/sustainable-farming-guide.pdf",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2400&auto=format&fit=crop",
        alt: "MK Jojoba Desert Farm Aerial View",
        caption:
          "Aerial view of MK Jojoba's transformation of desert landscape into thriving agricultural land",
      },
      {
        src: "https://images.unsplash.com/photo-1542451313-380d331656c4?q=80&w=2400&auto=format&fit=crop",
        alt: "Jojoba Plant Close-up",
        caption:
          "Close-up of mature jojoba plants showing the distinctive seed pods",
      },
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2400&auto=format&fit=crop",
        alt: "Irrigation System",
        caption:
          "Advanced drip irrigation system maximizing water efficiency in desert conditions",
      },
      {
        src: "https://images.unsplash.com/photo-1597656649387-c10a2d119515?q=80&w=2400&auto=format&fit=crop",
        alt: "Workers in Field",
        caption:
          "Local workers maintaining the jojoba crops during harvest season",
      },
    ],
    videos: [
      {
        src: "/videos/desert-transformation-story.mp4",
        poster:
          "https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1200&auto=format&fit=crop",
        title: "Desert Transformation: The MK Jojoba Story",
      },
    ],
  };

  useEffect(() => {
    // Calculate reading time based on article length
    const wordsPerMinute = 200;
    const wordCount = article.description.split(" ").length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  }, [article.description]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert("Article URL copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-200 relative">
      <ParticleBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-100">
                  Press Article
                </h1>
                <p className="text-sm text-gray-400">{article.publication}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isLiked
                    ? "bg-red-500/20 text-red-400"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isBookmarked
                    ? "bg-[#65a30d]/20 text-[#65a30d]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-[#65a30d]/20 text-[#65a30d] rounded-full text-sm font-medium">
              {article.category}
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-400 mb-6 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.publishedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{article.publication}</span>
            </div>
          </div>
        </motion.div>

        {/* Featured Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <ImageGallery images={article.images} />
            <div className="space-y-6">
              {article.videos.map((video, index) => (
                <VideoPlayer
                  key={index}
                  src={video.src}
                  poster={video.poster}
                  title={video.title}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg prose-invert max-w-none">
              {article.description.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-300 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Article Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Article Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="text-gray-100 font-semibold">
                    {article.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reading Time</span>
                  <span className="text-gray-100 font-semibold">
                    {readingTime} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Priority</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < article.priority
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 bg-[#65a30d] hover:bg-[#84cc16] text-white py-3 rounded-lg transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Article</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-gray-100 py-3 rounded-lg transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Original</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attachments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-8">
            Attachments & Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {article.attachments.map((attachment, index) => (
              <AttachmentCard key={index} attachment={attachment} />
            ))}
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-8">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={`https://images.unsplash.com/photo-150${
                    i + 5
                  }48207${i}8-15d4a09cfac2?q=80&w=400&auto=format&fit=crop`}
                  alt={`Related Article ${i}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-100 mb-2">
                    Related Article Title {i}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Brief description of the related article content...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>5 min read</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
