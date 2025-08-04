"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPressById } from "@/redux/pressSlice";
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
            Loading Article
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

// --- YouTube Video Slider Component ---
const YouTubeVideoSlider = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  if (!videos || videos.length === 0) return null;

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const currentVideo = videos[selectedVideo];
  const videoId = getYouTubeVideoId(currentVideo.src);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&rel=0`
    : null;

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <motion.div
        key={selectedVideo}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800"
      >
        {videoId ? (
          <iframe
            src={embedUrl}
            title={currentVideo.title}
            className="w-full h-64 md:h-96"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-64 md:h-96 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Invalid YouTube URL</p>
            </div>
          </div>
        )}

        {/* Video Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            {currentVideo.title}
          </h3>
        </div>
      </motion.div>

      {/* Video Thumbnail Strip */}
      {videos.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {videos.map((video, index) => {
            const thumbVideoId = getYouTubeVideoId(video.src);
            const thumbnailUrl = thumbVideoId
              ? `https://img.youtube.com/vi/${thumbVideoId}/mqdefault.jpg`
              : null;

            return (
              <button
                key={index}
                onClick={() => setSelectedVideo(index)}
                className={`flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 relative ${
                  selectedVideo === index
                    ? "border-[#65a30d] shadow-lg shadow-[#65a30d]/30"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white" />
                </div>

                {/* Video title on thumbnail */}
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-xs text-white bg-black/70 px-2 py-1 rounded truncate">
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Image Gallery Component ---
const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) return null;

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
      {images.length > 1 && (
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
      )}
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
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#65a30d] p-2 rounded-full hover:bg-[#84cc16] transition-colors"
        >
          <Download className="w-4 h-4 text-white" />
        </a>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export default function PressArticleDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    currentItem: press,
    loading,
    error,
  } = useSelector((state) => state.press);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    dispatch(fetchPublicPressById(id));
  }, [id, dispatch]);

  useEffect(() => {
    // Calculate reading time based on article length
    const wordsPerMinute = 200;
    const wordCount = press?.content ? press.content.split(" ").length : 0;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  }, [press?.content]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: press?.title || "Press Article",
          text: press?.summary || "",
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
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Error Loading Article
            </h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!press) {
    return (
      <div className="min-h-screen bg-transparent text-gray-200 relative">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Article Not Found
            </h2>
            <p className="text-gray-400">
              The requested press article could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Convert press data to match the original UI structure
  const article = {
    id: press._id,
    title: press.title,
    summary: press.summary,
    description: press.content,
    publishedDate: press.publishDate,
    author: press.author,
    publication: press.publication,
    readTime: `${readingTime} min read`,
    views: 15247, // Mock data since backend doesn't have views
    category: press.category,
    tags: press.tags || [],
    priority: 5, // Mock data
    attachments: press.documents
      ? press.documents.map((doc, index) => ({
          name: `Document ${index + 1}`,
          type: "pdf",
          size: "2.4 MB",
          url: doc,
        }))
      : [],
    images: press.image
      ? press.image.map((img, index) => ({
          src: img,
          alt: `${press.title} - Image ${index + 1}`,
          caption: `Image ${index + 1} from ${press.title}`,
        }))
      : [],
    videos: press.youtubeLinks
      ? press.youtubeLinks.map((link, index) => ({
          src: link, // This will be the YouTube URL
          poster: press.image && press.image.length > 0 ? press.image[0] : "",
          title: `Related Video ${index + 1}`,
        }))
      : [],
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
            <YouTubeVideoSlider videos={article.videos} />
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
            {article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-gray-100">
                  Tags
                </h3>
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
            )}
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
                {press.url && (
                  <a
                    href={press.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-gray-100 py-3 rounded-lg transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Original</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attachments Section */}
        {article.attachments.length > 0 && (
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
        )}

        {/* Related Articles */}
        {press.relatedArticles && press.relatedArticles.length > 0 && (
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
              {press.relatedArticles.map((articleUrl, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-100 mb-2">
                      Related Article {index + 1}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Additional reading material
                    </p>
                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Read Article</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
