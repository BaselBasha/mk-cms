"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Award,
  Leaf,
  Globe,
  Users,
  Wind,
  Sun,
  Menu,
  X,
  Shield,
  Star,
  ArrowLeft,
  Building,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProjects } from "@/redux/projectsSlice";
import { fetchPublicCompanies } from "@/redux/companiesSlice";
import { fetchPublicPartnerships } from "@/redux/partnershipsSlice";
import { fetchPublicPress } from "@/redux/pressSlice";
import { fetchPublicCertifications } from "@/redux/certificationsSlice";
import { fetchPublicAwards } from "@/redux/awardsSlice";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PaginatedProjectsSection from "@/components/PaginatedProjectsSection";
import PaginatedCompaniesSection from "@/components/PaginatedCompaniesSection";
import PaginatedPartnershipsSection from "@/components/PaginatedPartnershipsSection";
import PaginatedPressSection from "@/components/PaginatedPressSection";

// --- Section Title Component ---
const SectionTitle = ({ children, className = "" }) => (
  <motion.h2
    className={`text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-16 text-center ${className}`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.h2>
);

// --- Particle Background Component ---
// Creates a dynamic, animated particle background for the entire page.
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Use viewport height instead of scroll height

    let particlesArray = [];
    const numberOfParticles = 150; // Increased for more density

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
        let directionX = Math.random() * 0.4 - 0.2;
        let directionY = Math.random() * 0.4 - 0.2;
        let color = "rgba(101, 163, 13, 0.3)"; // Green theme particles
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
      canvas.height = window.innerHeight;
      init();
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);

    // Also handle resize on component mount to ensure correct initial size
    handleResize();

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

// --- Main Page Component ---
export default function App() {
  const dispatch = useDispatch();
  const { language, isRTL } = useLanguage();
  const { publicItems: projects } = useSelector((state) => state.projects);
  const { publicItems: companies } = useSelector((state) => state.companies);
  const { publicItems: partnerships } = useSelector((state) => state.partnerships);
  const { publicItems: pressArticles } = useSelector((state) => state.press);
  const { publicItems: certifications, loading: certificationsLoading } =
    useSelector((state) => state.certifications);
  const { publicItems: awards, loading: awardsLoading } = useSelector(
    (state) => state.awards
  );

  useEffect(() => {
    // Ensure the background is properly set on page load/refresh
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";

    // Force a repaint to ensure the particle background is visible
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch data for all sections
    dispatch(fetchPublicProjects());
    dispatch(fetchPublicCompanies());
    dispatch(fetchPublicPartnerships());
    dispatch(fetchPublicPress());
    dispatch(fetchPublicCertifications());
    dispatch(fetchPublicAwards());
  }, [dispatch]);

  // Check if any section has data
  const hasProjects = projects && projects.length > 0;
  const hasCompanies = companies && companies.length > 0;
  const hasPartnerships = partnerships && partnerships.length > 0;
  const hasPress = pressArticles && pressArticles.length > 0;
  const hasCertifications = certifications && certifications.length > 0;
  const hasAwards = awards && awards.length > 0;

  return (
    <div 
      className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <Header />
      <main className="w-full">
        <HeroSection />
        <WhoAreWeSection />
        {hasCertifications && <CertificationsSection />}

        <ProductsSection />
        {hasProjects && <PaginatedProjectsSection />}
        {hasCertifications && <CertificationsImageSlider />}
        {hasAwards && <AwardsSliderSection />}
        <WhyUsSection />
        <SpecializationSection />
        {hasCompanies && <PaginatedCompaniesSection />}
        {hasPartnerships && <PaginatedPartnershipsSection />}
        {hasPress && <PaginatedPressSection />}

      </main>
      <Footer />
    </div>
  );
}

// --- Reusable Animation Component ---
const AnimatedSection = ({ children, className, id }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  return (
    <motion.section
      id={id}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.section>
  );
};

// --- Item Animation Variants ---
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// --- Header Component ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    t.nav.home,
    t.nav.about,
    t.nav.products,
    t.nav.projects,
    t.nav.certifications,
    t.nav.awards,
    t.nav.companies,
    t.nav.partnerships,
    t.nav.press,
    t.nav.career,
    t.nav.contact,
  ];

  const scrollToSection = (sectionId) => {
    // Map section names to their actual IDs
    const sectionMap = {
      [t.nav.home.toLowerCase()]: "home",
      [t.nav.about.toLowerCase()]: "about",
      [t.nav.products.toLowerCase()]: "products",
      [t.nav.projects.toLowerCase()]: "projects",
      [t.nav.certifications.toLowerCase()]: "certifications",
      [t.nav.awards.toLowerCase()]: "awards-slider",
      [t.nav.companies.toLowerCase()]: "companies",
      [t.nav.partnerships.toLowerCase()]: "partnerships",
      [t.nav.press.toLowerCase()]: "press",
      [t.nav.contact.toLowerCase()]: "contact",
    };

    const actualId = sectionMap[sectionId.toLowerCase()];
    const element = document.getElementById(actualId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/20 shadow-lg"
            : "bg-black/20 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo - More compact */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <img
              src="/MK-GROUP.png"
              alt="MK Jojoba Logo"
              className="h-10 w-auto"
            />
          </motion.div>
          
          {/* Desktop Navigation - More compact and elegant */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => {
                  if (link === t.nav.contact) {
                    window.open("https://wa.me/201067726594", "_blank");
                  } else if (link === t.nav.career) {
                    window.location.href = "/careers";
                  } else {
                    scrollToSection(link.toLowerCase());
                  }
                }}
                className="px-3 py-2 text-gray-300 hover:text-[#65a30d] transition-all duration-200 font-medium text-sm rounded-md hover:bg-white/5 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#65a30d] group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
              </button>
            ))}
          </nav>
          
          {/* Right Side Controls - More compact */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSwitcher />
            <button
              onClick={() => window.open("https://wa.me/201067726594", "_blank")}
              className="bg-[#65a30d] text-white py-2 px-4 rounded-lg hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20 text-sm font-medium"
            >
              {t.nav.getInTouch}
            </button>
          </div>
          
          {/* Mobile Menu Button - More compact */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-300 p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu - Improved styling */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={28} className="text-gray-300" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-4 overflow-y-auto px-6">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                setIsMenuOpen(false);
                if (link === t.nav.contact) {
                  window.open("https://wa.me/201067726594", "_blank");
                } else if (link === t.nav.career) {
                  window.location.href = "/careers";
                } else {
                  scrollToSection(link.toLowerCase());
                }
              }}
              className="text-gray-200 text-xl font-medium hover:text-[#65a30d] transition-colors duration-300 cursor-pointer py-3 px-6 rounded-lg hover:bg-white/5 w-full text-center"
            >
              {link}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

// --- Hero Section ---
const HeroSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-white text-center"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
          },
        }}
        className="relative z-10 p-6"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-8xl font-bold mb-4 tracking-tight leading-tight"
          style={{ textShadow: "0 0 20px rgba(0,0,0,0.5)" }}
        >
          {t.hero.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65a30d] to-[#84cc16]">
            MK-Group
          </span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300"
        >
          {t.hero.subtitle}
        </motion.p>
        <motion.a
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: "backOut" },
            },
          }}
          href="#about"
          className="bg-gradient-to-r from-[#65a30d] to-[#84cc16] text-black font-bold py-4 px-10 rounded-full text-lg hover:shadow-2xl hover:shadow-[#65a30d]/40 transition-all duration-300 transform hover:scale-110"
        >
          {t.hero.cta}
        </motion.a>
      </motion.div>
    </section>
  );
};


// --- Who Are We Section ---
const WhoAreWeSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <AnimatedSection id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants} className="relative">
            <img
              src="https://www.ekapija.com/thumbs/victoria_group_poslovna_zgrada_080716_tw1024.jpg"
              alt="Jojoba Field"
              className="rounded-lg w-full h-auto object-cover"
            />
            <div className="absolute -inset-2 border-2 border-[#65a30d]/30 rounded-lg -z-10 transform rotate-2"></div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-100 mb-4">{t.about.title}</h2>
            <div className="w-20 h-1 bg-[#65a30d] mb-6"></div>
            <p className="text-lg text-gray-400 mb-4">
              {t.about.description1}
            </p>
            <p className="text-gray-400 mb-6">
              {t.about.description2}
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// --- Certifications Section (Infinite Scroller) ---
const CertificationsSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const logos = [
    { name: t.certifications.items.iso9001, icon: <Award className="h-10 w-10 text-[#65a30d]" /> },
    {
      name: t.certifications.items.organicCertified,
      icon: <Leaf className="h-10 w-10 text-[#65a30d]" />,
    },
    {
      name: t.certifications.items.globalGap,
      icon: <Globe className="h-10 w-10 text-[#65a30d]" />,
    },
    {
      name: t.certifications.items.fairTrade,
      icon: <Users className="h-10 w-10 text-[#65a30d]" />,
    },
    { name: t.certifications.items.ecoCert, icon: <Sun className="h-10 w-10 text-[#65a30d]" /> },
    {
      name: t.certifications.items.nonGmo,
      icon: <Wind className="h-10 w-10 text-[#65a30d]" />,
    },
  ];
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <AnimatedSection id="certifications" className="py-20 md:py-28">
      <SectionTitle>{t.certifications?.title || "Our Certifications"}</SectionTitle>
      <div className="text-center mb-16">
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {t.certifications?.description || "Our certifications demonstrate our commitment to quality and excellence."}
        </p>
      </div>
      <div className="relative w-full overflow-hidden mask-gradient">
        <motion.div
          className="flex"
          animate={{
            x: ["0%", `-${100 / (duplicatedLogos.length / logos.length)}%`],
          }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 mx-4 flex items-center justify-center space-x-4 p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              {logo.icon}
              <span className="font-semibold text-gray-300 text-lg">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </AnimatedSection>
  );
};

// --- Certifications Image Slider Section ---
const CertificationsImageSlider = () => {
  const { publicItems: certifications, loading } = useSelector(
    (state) => state.certifications
  );
  const { language } = useLanguage();
  const t = translations[language];

  // Transform certifications for display
  const certs = (certifications || []).map((cert) => ({
    img:
      cert.image?.url ||
      "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO.png",
    alt: cert.title || "Certification",
    title: cert.title,
    category: cert.category,
    priority: cert.priority,
  }));

  // Duplicate for seamless scroll
  const duplicated = [...certs, ...certs, ...certs];

  return (
    <AnimatedSection className="py-16 bg-transparent">
      <SectionTitle>{t.certifications.imageGallery || "Our Certification Gallery"}</SectionTitle>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
        </div>
      ) : (
        <>
          <div className="relative w-full overflow-hidden mask-gradient">
            <motion.div
              className="flex items-center"
              animate={{ x: ["0%", `-${100 / 3}%`] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              drag="x"
              dragConstraints={sliderDragConstraints}
              whileTap={{ cursor: "grabbing" }}
            >
              {duplicated.map((cert, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-56 h-40 mx-6 flex items-center justify-center bg-white/80 rounded-xl shadow border border-gray-200"
                >
                  <img
                    src={cert.img}
                    alt={cert.alt}
                    className="max-h-24 max-w-40 object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO.png";
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex justify-center mt-6">
            <Link
              href="/certifications"
              className="bg-[#65a30d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#84cc16] transition-all duration-300"
            >
              {t.certifications.viewAll}
            </Link>
          </div>
        </>
      )}

      <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </AnimatedSection>
  );
};

// --- Awards Section ---
const AwardsSection = () => {
  const { publicItems: awards, loading } = useSelector((state) => state.awards);
  const { language } = useLanguage();
  const t = translations[language];

  // Transform awards for display
  const displayAwards = (awards || []).map((award) => ({
    id: award._id,
    title: award.title || "Award",
    category: award.category || "General",
    year: award.awardDate
      ? new Date(award.awardDate).getFullYear().toString()
      : "2023",
    icon: <Award className="h-8 w-8 text-[#65a30d]" />,
    summary: award.summary,
    level: award.level,
  }));

  return (
    <AnimatedSection id="awards" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <SectionTitle>{t.awards.title}</SectionTitle>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-6">
            {t.awards.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
            <span className="ml-3 text-gray-400">{t.common.loading}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayAwards.map((award, index) => (
              <Link key={index} href={`/awards/${award.id}`} className="block">
                <motion.div
                  variants={itemVariants}
                  className="group relative bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center hover:border-[#65a30d]/30 hover:bg-black/30 transition-all duration-500 cursor-pointer"
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#65a30d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center">
                      {award.icon}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#65a30d] transition-colors duration-300">
                      {award.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-3">
                      {award.category}
                    </p>

                    <div className="text-[#65a30d] font-semibold">
                      {award.year}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <motion.a
            href="/awards"
            className="inline-flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t.awards.viewAll}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </motion.a>
        </div>
      </div>
    </AnimatedSection>
  );
};

// --- Awards Slider Section ---
const AwardsSliderSection = () => {
  const { publicItems: awards, loading } = useSelector((state) => state.awards);
  const { language } = useLanguage();
  const t = translations[language];

  // Transform awards for slider display
  const sliderAwards = (awards || []).map((award) => ({
    id: award._id,
    title: award.title || "Award",
    category: award.category || "General",
    year: award.awardDate
      ? new Date(award.awardDate).getFullYear().toString()
      : "2023",
    icon: <Award className="h-8 w-8 text-[#65a30d]" />,
    summary: award.summary,
    level: award.level,
    image: award.image?.url || null,
  }));

  return (
    <AnimatedSection id="awards-slider" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <SectionTitle>{t.awards.featured}</SectionTitle>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-6">
            {t.awards.featuredSubtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
              {sliderAwards.map((award, index) => (
                <Link
                  key={index}
                  href={`/awards/${award.id}`}
                  className="block"
                >
                  <motion.div
                    variants={itemVariants}
                    className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg cursor-pointer"
                    whileHover={{ y: -10, scale: 1.05 }}
                  >
                    {award.image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={award.image}
                          alt={award.title}
                          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#65a30d]/20 to-[#84cc16]/20 flex items-center justify-center">
                        <Award className="h-16 w-16 text-[#65a30d]" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#65a30d] font-semibold bg-[#65a30d]/10 px-3 py-1 rounded-full">
                          {award.category}
                        </span>
                        <span className="text-sm text-gray-400">
                          {award.year}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#65a30d] transition-colors duration-300">
                        {award.title}
                      </h3>

                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {award.summary}
                      </p>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{t.awards.level}:</span>
                        <span className="text-xs text-[#65a30d] font-semibold">
                          {award.level}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <motion.a
            href="/awards"
            className="inline-flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t.awards.exploreAll}</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </motion.a>
        </div>
      </div>
    </AnimatedSection>
  );
};

// --- Glass Card Component for Scrolling Sections ---
const GlassCard = ({
  item,
  index,
  isProject = false,
  isPartnership = false,
  isCompany = false,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const getStatusText = (status) => {
    if (status === "active") return t.partnerships.status.active;
    if (status === "completed") return t.partnerships.status.completed;
    if (status === "inactive") return t.partnerships.status.inactive;
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg cursor-pointer"
      onClick={() => {
        if (isProject && item.id) {
          window.location.href = `/projects/${item.id}`;
        } else if (isPartnership && item.id) {
          window.location.href = `/partnerships/${item.id}`;
        } else if (isCompany && item.website) {
          window.open(item.website, '_blank');
        }
      }}
    >
      <img
        src={item.img}
        alt={item.name || item.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
        onError={(e) => {
          // Fallback image for partnerships if the poster image fails to load
          if (isPartnership) {
            e.target.src =
              "https://mkgroup-eg.com/wp-content/uploads/2022/11/NVU.png";
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{item.name || item.title}</h3>
        <p className="text-gray-300 line-clamp-2">{item.desc || item.area}</p>
        {item.budget && (
          <p className="text-[#65a30d] text-sm mt-1">{item.budget}</p>
        )}
        {isPartnership && item.status && (
          <div className="flex items-center mt-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.status === "active"
                  ? "bg-green-500/20 text-green-400"
                  : item.status === "completed"
                  ? "bg-blue-500/20 text-blue-400"
                  : item.status === "inactive"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {getStatusText(item.status)}
            </span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#65a30d] rounded-2xl transition-all duration-300"></div>
    </motion.div>
  );
};

// Utility for drag constraints
const sliderDragConstraints = { left: -1000, right: 0 };

// --- Products Section ---
const ProductsSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const products = [
    {
      name: t.products.items.seeds.name,
      desc: t.products.items.seeds.desc,
      img: "https://thumbs.dreamstime.com/b/planting-new-grass-seed-to-bare-spot-yard-29495687.jpg",
    },

    {
      name: t.products.items.jojobaWax.name,
      desc: t.products.items.jojobaWax.desc,
      img: "https://s.alicdn.com/@sc04/kf/H5116f3775a1e45b28211b6da12fb8bab0.jpg",
    },

    {
      name: t.products.items.seeding.name,
      desc: t.products.items.seeding.desc,
      img: "https://anchoragegardensupply.com/ius/product/5988-415444-9458.jpg",
    },
    {
      name: t.products.items.organicOil.name,
      desc: t.products.items.organicOil.desc,
      img: "https://assets.clevelandclinic.org/transform/63ea0011-b018-4e01-92be-3e6e5b0f4cfc/pouring-olive-oil-into-small-bowl-1812012898",
    },
    {
      name: t.products.items.organicOil.name,
      desc: t.products.items.organicOil.desc,
      img: "https://www.greenpeople.co.uk/cdn/shop/files/Anti-ageing-facial-oil-hero.jpg?v=1712317760&width=1023",
    },
    {
      name: t.products.items.pestControl.name,
      desc: t.products.items.pestControl.desc,
      img: "https://agricultureguruji.com/wp-content/uploads/2018/01/Pest-and-Disease-control-in-Greenhouse-2.jpg",
    },
  ];
  const duplicated = [...products, ...products, ...products];
  return (
    <AnimatedSection
      id="products"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>{t.products.title}</SectionTitle>
      <div className="relative w-full overflow-hidden mask-gradient">
        <motion.div
          className="flex"
          animate={{ x: ["0%", `-${100 / 3}%`] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          drag="x"
          dragConstraints={sliderDragConstraints}
          whileTap={{ cursor: "grabbing" }}
        >
          {duplicated.map((p, i) => (
            <GlassCard key={i} item={p} index={i} />
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#65a30d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#84cc16] transition-all duration-300">
          {t.products.showAll}
        </button>
      </div>
      <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </AnimatedSection>
  );
};


// --- Why Us Section ---
const WhyUsSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-[#65a30d]" />,
      title: t.whyUs.features.sustainability.title,
      desc: t.whyUs.features.sustainability.desc,
    },
    {
      icon: <Award className="h-10 w-10 text-[#65a30d]" />,
      title: t.whyUs.features.premiumQuality.title,
      desc: t.whyUs.features.premiumQuality.desc,
    },
    {
      icon: <Globe className="h-10 w-10 text-[#65a30d]" />,
      title: t.whyUs.features.globalReach.title,
      desc: t.whyUs.features.globalReach.desc,
    },
    {
      icon: <Users className="h-10 w-10 text-[#65a30d]" />,
      title: t.whyUs.features.expertTeam.title,
      desc: t.whyUs.features.expertTeam.desc,
    },
  ];
  return (
    <AnimatedSection id="why-us" className="py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <SectionTitle>{t.whyUs.title}</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// --- Specialization Section ---
const SpecializationSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const specializations = [
    {
      title: t.specializations.items.dripIrrigation.title,
      desc: t.specializations.items.dripIrrigation.desc,
      img: "https://m.media-amazon.com/images/I/81jcMpPJVDL.jpg",
    },
    {
      title: t.specializations.items.soilHealth.title,
      desc: t.specializations.items.soilHealth.desc,
      img: "https://growers.ag/wp-content/uploads/2021/03/SoilNutrients-1024x680.png",
    },
    {
      title: t.specializations.items.advancedHarvesting.title,
      desc: t.specializations.items.advancedHarvesting.desc,
      img: "https://png.pngtree.com/background/20250128/original/pngtree-modern-turmeric-field-with-advanced-machinery-picture-image_15983214.jpg",
    },
    {
      title: t.specializations.items.geneticSelection.title,
      desc: t.specializations.items.geneticSelection.desc,
      img: "https://www.elicit-plant.com/app/uploads/2024/01/Comparaison-pousse-de-soja-subissant-stress-hydrique-ou-non-768x446.jpg",
    },
    {
      title: t.specializations.items.geneticSelection.title,
      desc: t.specializations.items.geneticSelection.desc,
      img: "https://www.whistlertechnologies.ca/wp-content/uploads/2024/10/DSC05243-scaled-e1729527785429-1024x998.jpg",
    },
  ];
  const duplicated = [
    ...specializations,
    ...specializations,
    ...specializations,
  ];
  return (
    <AnimatedSection
      id="specializations"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>{t.specializations.title}</SectionTitle>
      <div className="relative w-full overflow-hidden mask-gradient">
        <motion.div
          className="flex"
          animate={{ x: ["0%", `-${100 / 3}%`] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          drag="x"
          dragConstraints={sliderDragConstraints}
          whileTap={{ cursor: "grabbing" }}
        >
          {duplicated.map((s, i) => (
            <GlassCard key={i} item={s} index={i} />
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#65a30d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#84cc16] transition-all duration-300">
          {t.specializations.showAll}
        </button>
      </div>
      <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </AnimatedSection>
  );
};




// --- Footer Component ---
const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer
      id="contact"
      className="bg-black/30 border-t border-white/10 relative z-10"
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/MK-GROUP.png"
              alt="MK Jojoba Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400 max-w-xs">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-100">{t.footer.quickLinks}</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("home");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("about");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("products");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("projects");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("certifications");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Certifications
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("awards-slider");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Awards
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("companies");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Companies
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("partnerships");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Partnerships
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const element = document.getElementById("press");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Press
              </button>
            </li>
            <li>
              <Link
                href="/careers"
                className="text-gray-400 hover:text-[#65a30d] transition-colors cursor-pointer"
              >
                Career
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-100">{t.footer.contactUs}</h3>
          <p className="text-gray-400 mb-2">{t.footer.location}</p>
          <p className="text-gray-400 mb-2">info@mkgroup-eg.com</p>
          <p className="text-gray-400 mb-4">+20 106 772 6594</p>
          <button
            onClick={() => window.open("https://wa.me/201067726594", "_blank")}
            className="bg-[#65a30d] text-white py-2 px-4 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 text-sm font-medium"
          >
            {t.footer.chatWhatsApp}
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-100">{t.footer.followUs}</h3>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a
              href="https://wa.me/201067726594"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#65a30d] transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#65a30d] transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#65a30d] transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M8.5,18H5.5V10H8.5V18M7,8.5C6.17,8.5 5.5,7.83 5.5,7C5.5,6.17 6.17,5.5 7,5.5C7.83,5.5 8.5,6.17 8.5,7C8.5,7.83 7.83,8.5 7,8.5M18.5,18H15.5V13.5C15.5,12.57 15.15,12.07 14.43,12.07C13.5,12.07 13,12.8 13,13.5V18H10V10H13V11.25C13.4,10.5 14.2,10 15.25,10C17.5,10 18.5,11.5 18.5,13.25V18Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </div>
  </footer>
  );
}