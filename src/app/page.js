"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Leaf, Globe, Users, Wind, Sun, Menu, X } from "lucide-react";

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
    canvas.height = document.documentElement.scrollHeight; // Cover entire scrollable height

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
        let color = "rgba(101, 163, 13, 0.3)"; // Match project detail page
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
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        background: "linear-gradient(135deg, #1a2d27 0%, #33413d 100%)", // Match project detail page
      }}
    />
  );
};

// --- Main Page Component ---
export default function App() {
  return (
    <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative">
      <ParticleBackground />
      <Header />
      <main>
        <HeroSection />
        <WhoAreWeSection />
        <CertificationsSection />
        <ProductsSection />
        <ProjectsSection />
        <CertificationsImageSlider />
        <WhyUsSection />
        <SpecializationSection />
        <PartnershipsSection />
        <PressSection />
      </main>
      <Footer />
    </div>
  );
}

// --- Reusable Animation Component ---
const AnimatedSection = ({ children, className }) => {
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

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// --- Header Component ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "About", "Products", "Projects", "Contact"];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/50 backdrop-blur-lg border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src="/MK-GROUP.png"
              alt="MK Jojoba Logo"
              className="h-12 w-auto"
            />
          </motion.div>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-300 hover:text-[#65a30d] transition-colors duration-300 font-medium tracking-wider"
              >
                {link}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden md:inline-block bg-[#65a30d] text-white py-2 px-6 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20"
          >
            Get in Touch
          </a>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-gray-300"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={32} className="text-gray-300" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-200 text-3xl font-light hover:text-[#65a30d] transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

// --- Hero Section ---
const HeroSection = () => (
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
        The Future is{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65a30d] to-[#84cc16]">
          MK-Group
        </span>
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300"
      >
        Almisria Alkhaligia: Cultivating tomorrow's resources from the heart of
        the desert.
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
        Explore Our Vision
      </motion.a>
    </motion.div>
  </section>
);

// --- Section Title Component ---
const SectionTitle = ({ children }) => (
  <motion.div variants={itemVariants}>
    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-100 mb-4">
      {children}
    </h2>
    <div className="w-24 h-1 bg-gradient-to-r from-[#65a30d] to-[#84cc16] mb-16 mx-auto rounded-full"></div>
  </motion.div>
);

// --- Who Are We Section ---
const WhoAreWeSection = () => (
  <AnimatedSection id="about" className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div variants={itemVariants} className="relative">
          <img
            src="https://mkgroup-eg.com/wp-content/uploads/2022/11/DJI_0339-2048x1365.jpg"
            alt="Jojoba Field"
            className="rounded-lg w-full h-auto object-cover"
          />
          <div className="absolute -inset-2 border-2 border-[#65a30d]/30 rounded-lg -z-10 transform rotate-2"></div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-bold text-gray-100 mb-4">Who We Are</h2>
          <div className="w-20 h-1 bg-[#65a30d] mb-6"></div>
          <p className="text-lg text-gray-400 mb-4">
            Since 2002, MK Jojoba has pioneered desert land reclamation. We see
            not arid waste, but a canvas for life, cultivating high-quality
            Jojoba to unlock a sustainable, green future.
          </p>
          <p className="text-gray-400 mb-6">
            Our mission blends ecological integrity with economic prosperity,
            delivering premium Jojoba oil to a global market that values purity
            and sustainability.
          </p>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

// --- Certifications Section (Infinite Scroller) ---
const CertificationsSection = () => {
  const logos = [
    { name: "ISO 9001", icon: <Award className="h-10 w-10 text-[#65a30d]" /> },
    {
      name: "Organic Certified",
      icon: <Leaf className="h-10 w-10 text-[#65a30d]" />,
    },
    {
      name: "Global G.A.P.",
      icon: <Globe className="h-10 w-10 text-[#65a30d]" />,
    },
    {
      name: "Fair Trade",
      icon: <Users className="h-10 w-10 text-[#65a30d]" />,
    },
    { name: "EcoCert", icon: <Sun className="h-10 w-10 text-[#65a30d]" /> },
    {
      name: "Non-GMO Project",
      icon: <Wind className="h-10 w-10 text-[#65a30d]" />,
    },
  ];
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="py-20 md:py-28">
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
    </div>
  );
};

// --- Certifications Image Slider Section ---
const CertificationsImageSlider = () => {
  const certs = [
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/International-Accreditation-Service-IAS.png",
      alt: "International Accreditation Service IAS",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO-140012015-n.png",
      alt: "ISO 14001:2015",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO.png",
      alt: "ISO",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/bio-inspecta.png",
      alt: "Bio Inspecta",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/usda-organic.png",
      alt: "USDA Organic",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/IAF.png",
      alt: "IAF",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/BRSM.png",
      alt: "BRSM",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/iso-22000_2018.png",
      alt: "ISO 22000:2018",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO-9001_2015.png",
      alt: "ISO 9001:2015",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/ISO-140012015-n.png",
      alt: "ISO 14001:2015",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/EGAC.png",
      alt: "EGAC",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/Team-Quality.png",
      alt: "Team Quality",
    },
    {
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/International-Accreditation-Service-IAS.png",
      alt: "International Accreditation Service IAS",
    },
  ];
  // Duplicate for seamless scroll
  const duplicated = [...certs, ...certs, ...certs];
  return (
    <AnimatedSection className="py-16 bg-transparent">
      <SectionTitle>Our Certifications</SectionTitle>
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
              />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#65a30d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#84cc16] transition-all duration-300">
          Show All
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

// --- Glass Card Component for Scrolling Sections ---
const GlassCard = ({ item, index }) => (
  <motion.div
    variants={itemVariants}
    className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg"
  >
    <img
      src={item.img}
      alt={item.name || item.title}
      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="relative h-full flex flex-col justify-end p-6 text-white">
      <h3 className="text-2xl font-bold mb-2">{item.name || item.title}</h3>
      <p className="text-gray-300">{item.desc || item.area}</p>
    </div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#65a30d] rounded-2xl transition-all duration-300"></div>
  </motion.div>
);

// Utility for drag constraints
const sliderDragConstraints = { left: -1000, right: 0 };

// --- Products Section ---
const ProductsSection = () => {
  const products = [
    {
      name: "Seeds",
      desc: "Cold-pressed, virgin oil for cosmetics and skincare.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/unnamed-file.png",
    },

    {
      name: "Jojoba Wax",
      desc: "Natural wax for industrial and cosmetic applications.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/pure-75ml-and-mix50ml.jpg",
    },

    {
      name: "Seeding",
      desc: "High-yield, drought-resistant seedlings for cultivation.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/9802741e-1650-4027-aa12-6468aa8083f6.jpg",
    },
    {
      name: "Organic Oil",
      desc: "High-yield, drought-resistant seedlings for cultivation.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-01-at-19.33.16_9b87c9bbmm.jpg",
    },
    {
      name: "Organic Oil",
      desc: "High-yield, drought-resistant seedlings for cultivation.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/pure-75ml-and-mix50ml.jpg",
    },
    {
      name: "Pest-Control",
      desc: "High-yield, drought-resistant seedlings for cultivation.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/Termite-Pest-Control-Frisco-TX.jpg",
    },
  ];
  const duplicated = [...products, ...products, ...products];
  return (
    <AnimatedSection
      id="products"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>Our Products</SectionTitle>
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
          Show All
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

// --- Projects Section ---
const ProjectsSection = () => {
  const projects = [
    {
      name: "Wadi El Natrun Reclamation",
      area: "5,000 Hectares",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/07/%D9%85%D8%B4%D8%B1%D9%88%D8%B9-%D9%87%D9%8A%D8%A6%D8%A9-%D8%AA%D9%86%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%B5%D8%B9%D9%8A%D8%AF.jpg",
    },
    {
      name: "Sinai Greening Initiative",
      area: "10,000 Hectares",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/07/%D8%A7%D9%84%D9%82%D8%A7%D8%A8%D8%B6%D9%87-%D9%84%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1.jpg",
    },
    {
      name: "New Valley Agro-Forestry",
      area: "7,500 Hectares",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/The-Jojoba-Company-farm.jpg",
    },
    {
      name: "Red Sea Coastline Restoration",
      area: "2,000 Hectares",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/07/%D9%85%D8%A8%D8%A7%D8%AF%D8%B1%D8%A9-%D9%88%D8%A7%D8%AF%D9%8A-%D8%A7%D9%84%D8%AC%D9%88%D8%AC%D9%88%D8%A8%D8%A7.jpg",
    },
  ];
  const duplicated = [...projects, ...projects, ...projects];
  return (
    <AnimatedSection
      id="projects"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>Our Landmark Projects</SectionTitle>
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
          Show All
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
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-[#65a30d]" />,
      title: "Sustainability",
      desc: "Eco-friendly practices that conserve water and protect biodiversity.",
    },
    {
      icon: <Award className="h-10 w-10 text-[#65a30d]" />,
      title: "Premium Quality",
      desc: "Rigorous quality control from seed to oil, ensuring the finest product.",
    },
    {
      icon: <Globe className="h-10 w-10 text-[#65a30d]" />,
      title: "Global Reach",
      desc: "A trusted supplier for international markets in cosmetics, and more.",
    },
    {
      icon: <Users className="h-10 w-10 text-[#65a30d]" />,
      title: "Expert Team",
      desc: "Decades of combined experience in agronomy and desert agriculture.",
    },
  ];
  return (
    <AnimatedSection className="py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <SectionTitle>Why Choose Us?</SectionTitle>
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
  const specializations = [
    {
      title: "Drip Irrigation Systems",
      desc: "Maximizing water efficiency in arid climates.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/shutterstock_767486674-1.jpg",
    },
    {
      title: "Soil Health & Enrichment",
      desc: "Revitalizing desert soil with organic matter.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/DJI_0187-Medium.png",
    },
    {
      title: "Advanced Harvesting",
      desc: "Utilizing modern technology for peak efficiency.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/Premium-Agribusiness-Consulting-Service.jpeg",
    },
    {
      title: "Genetic Selection",
      desc: "Cultivating proprietary varieties for higher yield.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/0.png",
    },
    {
      title: "Genetic Selection",
      desc: "Cultivating proprietary varieties for higher yield.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/money-2724241_1920.webp",
    },
  ];
  const duplicated = [
    ...specializations,
    ...specializations,
    ...specializations,
  ];
  return (
    <AnimatedSection className="py-20 md:py-28 overflow-hidden bg-transparent">
      <SectionTitle>Our Specializations</SectionTitle>
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
          Show All
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

const PartnershipsSection = () => {
  const partnerships = [
    {
      name: "GreenTech Solutions",
      desc: "Collaborating on sustainable irrigation systems.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/NVU.png",
    },
    {
      name: "AgroGlobal Inc.",
      desc: "Joint research in crop genetics and yield improvement.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/NVG.png",
    },
    {
      name: "Desert Bloom Initiative",
      desc: "Pioneering desert agriculture and land reclamation.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/MU.png",
    },
    {
      name: "EcoCert Europe",
      desc: "Certification and quality assurance for organic produce.",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/11/MU-2.png",
    },
  ];
  const duplicated = [...partnerships, ...partnerships, ...partnerships];
  return (
    <AnimatedSection className="py-20 md:py-28 overflow-hidden bg-transparent">
      <SectionTitle>Our Partnerships</SectionTitle>
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
          Show All
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

// --- Press Section ---
const PressSection = () => {
  const press = [
    {
      quote: "A model for sustainable agriculture in the Middle East.",
      source: "Global Agriculture Today",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-27-at-14.21.40_47a11d61.jpg",
    },
    {
      quote: "MK Jojoba's innovative techniques are turning the desert green.",
      source: "Eco-Innovators Magazine",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/391613460_673580461542316_1959068305070372405_n.jpg",
    },
    {
      quote: "The quality of their Jojoba oil is unparalleled in the market.",
      source: "Cosmetics Business Weekly",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/04/394630000_678251917741837_7520882499018497547_n-1024x1024-1.jpg",
    },
    {
      quote: "MK Jojoba's innovative techniques are turning the desert green.",
      source: "Eco-Innovators Magazine",
      img: "https://mkgroup-eg.com/wp-content/uploads/2022/05/374684208_673593778207651_2171150138347886782_n.jpg",
    },
    {
      quote: "The quality of their Jojoba oil is unparalleled in the market.",
      source: "Cosmetics Business Weekly",
      img: "https://mkgroup-eg.com/wp-content/uploads/2024/05/post1.png",
    },
  ];
  const duplicated = [...press, ...press, ...press];
  return (
    <AnimatedSection className="py-20 md:py-28 overflow-hidden bg-transparent">
      <SectionTitle>In The Press</SectionTitle>
      <div className="relative w-full overflow-hidden mask-gradient">
        <motion.div
          className="flex items-stretch"
          animate={{ x: ["0%", `-${100 / 3}%`] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          drag="x"
          dragConstraints={sliderDragConstraints}
          whileTap={{ cursor: "grabbing" }}
        >
          {duplicated.map((item, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-96 max-w-full bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center mx-6"
            >
              <img
                src={item.img}
                alt={item.source}
                className="w-full h-40 object-cover rounded-xl mb-6 shadow"
              />
              <p className="text-lg italic text-gray-300 mb-6 text-center">
                “{item.quote}”
              </p>
              <p className="font-bold text-right text-[#65a30d] w-full">
                - {item.source}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#65a30d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#84cc16] transition-all duration-300">
          Show All
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
const Footer = () => (
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
            Pioneering the future of desert agriculture since 2002.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-100">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="text-gray-400 hover:text-[#65a30d]">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="text-gray-400 hover:text-[#65a30d]">
                About Us
              </a>
            </li>
            <li>
              <a
                href="#products"
                className="text-gray-400 hover:text-[#65a30d]"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className="text-gray-400 hover:text-[#65a30d]"
              >
                Projects
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-100">Contact Us</h3>
          <p className="text-gray-400 mb-2">New Cairo, Egypt</p>
          <p className="text-gray-400 mb-2">info@mk-jojoba.com</p>
          <p className="text-gray-400">+20 123 456 7890</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-100">Follow Us</h3>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M8.5,18H5.5V10H8.5V18M7,8.5C6.17,8.5 5.5,7.83 5.5,7C5.5,6.17 6.17,5.5 7,5.5C7.83,5.5 8.5,6.17 8.5,7C8.5,7.83 7.83,8.5 7,8.5M18.5,18H15.5V13.5C15.5,12.57 15.15,12.07 14.43,12.07C13.5,12.07 13,12.8 13,13.5V18H10V10H13V11.25C13.4,10.5 14.2,10 15.25,10C17.5,10 18.5,11.5 18.5,13.25V18Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Almisria Alkhaligia Company. All
          Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);
