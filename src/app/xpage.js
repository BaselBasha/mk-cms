"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ArrowRight,
  CheckCircle,
  Globe,
  Droplets,
  Leaf,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Star,
  Users,
  Award,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/projectsSlice";
import { fetchCertifications } from "../redux/certificationsSlice";
import { fetchAwards } from "../redux/awardsSlice";
import { fetchNews } from "../redux/newsSlice";
import { fetchPartnerships } from "../redux/partnershipsSlice";

export default function MKGroupWebsite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const dispatch = useDispatch();
  const { items: projects, status: projectsStatus } = useSelector(
    (state) => state.projects
  );
  const { items: certifications, status: certificationsStatus } = useSelector(
    (state) => state.certifications
  );
  const { items: awards, status: awardsStatus } = useSelector(
    (state) => state.awards
  );
  const { items: news, status: newsStatus } = useSelector(
    (state) => state.news
  );
  const { items: partnerships, status: partnershipsStatus } = useSelector(
    (state) => state.partnerships
  );

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCertifications());
    dispatch(fetchAwards());
    dispatch(fetchNews());
    dispatch(fetchPartnerships());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      // Update active section based on scroll position
      const sections = ["home", "about", "services", "projects", "contact"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Auto-slide hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "Transform Desert",
      subtitle: "Into Sustainable Paradise",
      description:
        "Pioneering desert reclamation with innovative jojoba cultivation techniques",
      gradient: "from-emerald-900 via-emerald-800 to-teal-900",
      particles: "emerald",
    },
    {
      title: "Premium Investment",
      subtitle: "Opportunities Await",
      description:
        "Double your land productivity with proven sustainable farming solutions",
      gradient: "from-blue-900 via-blue-800 to-cyan-900",
      particles: "blue",
    },
    {
      title: "Future-Ready",
      subtitle: "Agriculture Solutions",
      description:
        "Creating green ecosystems in the world's most challenging environments",
      gradient: "from-purple-900 via-purple-800 to-indigo-900",
      particles: "purple",
    },
  ];

  const stats = [
    { value: "25K+", label: "Hectares Transformed", icon: Globe },
    { value: "150+", label: "Successful Projects", icon: CheckCircle },
    { value: "$50M+", label: "Investment Value", icon: TrendingUp },
    { value: "98%", label: "Success Rate", icon: Leaf },
  ];

  const services = [
    {
      icon: Globe,
      title: "Desert Reclamation",
      description:
        "Advanced soil rehabilitation and ecosystem restoration using cutting-edge biotechnology",
      features: [
        "Soil Analysis",
        "Microclimate Creation",
        "Biodiversity Enhancement",
      ],
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Leaf,
      title: "Jojoba Cultivation",
      description:
        "Premium jojoba farming with sustainable practices and maximum yield optimization",
      features: ["Organic Farming", "Premium Oil Production", "Export Quality"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Droplets,
      title: "Water Management",
      description:
        "Innovative irrigation systems and water conservation technologies",
      features: ["Smart Irrigation", "Water Recycling", "Drought Resistance"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Investment Solutions",
      description:
        "Comprehensive investment packages with guaranteed returns and growth",
      features: ["ROI Tracking", "Portfolio Management", "Risk Assessment"],
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Investment Director",
      company: "Desert Ventures",
      content:
        "MK Group transformed our barren investment into a thriving agricultural success story.",
      rating: 5,
    },
    {
      name: "Sarah Mohamed",
      role: "Environmental Engineer",
      company: "Green Solutions",
      content:
        "Their sustainable approach to desert reclamation is revolutionary and highly effective.",
      rating: 5,
    },
    {
      name: "Omar Khalil",
      role: "Agriculture Minister",
      company: "Ministry of Agriculture",
      content:
        "MK Group's projects are setting new standards for sustainable desert agriculture.",
      rating: 5,
    },
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Floating particles component
  const FloatingParticles = ({ color = "emerald" }) => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute bg-${color}-400 rounded-full opacity-20 animate-float`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Animated cursor */}
      <div
        className="fixed top-0 left-0 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full pointer-events-none z-50 opacity-60 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 8}px, ${
            mousePosition.y - 8
          }px)`,
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-2xl border-b border-gray-200/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                <Leaf className="w-7 h-7 text-white animate-pulse" />
              </div>
              <span
                className={`text-2xl font-bold transition-all duration-500 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                MK Group
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
              {["home", "about", "services", "projects", "contact"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`relative font-medium transition-all duration-500 capitalize group ${
                      isScrolled ? "text-gray-700" : "text-white"
                    } hover:text-emerald-500 transform hover:scale-105 ${
                      activeSection === section ? "text-emerald-500" : ""
                    }`}
                  >
                    {section}
                    {activeSection === section && (
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-expand" />
                    )}
                    <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-full transition-all duration-300" />
                  </button>
                )
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-2xl animate-pulse-slow">
                Get Started
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg transform hover:scale-110 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X
                    className={`w-6 h-6 ${
                      isScrolled ? "text-gray-900" : "text-white"
                    } animate-spin-slow`}
                  />
                ) : (
                  <Menu
                    className={`w-6 h-6 ${
                      isScrolled ? "text-gray-900" : "text-white"
                    } animate-bounce-slow`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200/30 animate-slide-down">
            <div className="px-4 py-6 space-y-4">
              {["home", "about", "services", "projects", "contact"].map(
                (section, index) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-300 capitalize transform hover:scale-105 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {section}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen overflow-hidden"
        ref={heroRef}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-all duration-2000`}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <FloatingParticles color={heroSlides[currentSlide].particles} />
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float" />
          <div className="absolute top-1/2 right-20 w-24 h-24 bg-emerald-500/20 rounded-full animate-float-reverse" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-teal-500/10 rounded-full animate-pulse-slow" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-5xl">
              <div className="animate-fade-in-up">
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                  <span className="block animate-slide-in-left">
                    {heroSlides[currentSlide].title}
                  </span>
                  <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-slide-in-right animate-text-shimmer">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl animate-fade-in-up-delay">
                  {heroSlides[currentSlide].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-2">
                  <button className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center animate-pulse-slow">
                    Explore Projects
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                  <button className="border-2 border-white/80 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-500 backdrop-blur-sm transform hover:scale-105 hover:shadow-2xl">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full transform hover:scale-125 ${
                index === currentSlide
                  ? "w-12 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-all duration-500 shadow-xl hover:shadow-emerald-500/25 animate-pulse-slow">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2 animate-count-up">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="about"
        className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transforming Desert
                <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text animate-text-shimmer">
                  Into Opportunity
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                MK Group pioneers sustainable desert reclamation through
                innovative jojoba cultivation. We transform barren landscapes
                into thriving agricultural ecosystems, creating value for
                investors while protecting our environment.
              </p>
              <div className="space-y-6 mb-8">
                {[
                  "Advanced soil rehabilitation techniques",
                  "Sustainable water management systems",
                  "Premium jojoba oil production",
                  "Guaranteed return on investment",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/25 animate-pulse-slow">
                Learn Our Story
              </button>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-20 animate-pulse-slow" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                      <Zap className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Our Vision
                    </h3>
                    <p className="text-gray-600 mt-2">
                      To be a global leader in creating sustainable green
                      economies in arid regions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-32 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
            Our Core Services
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto animate-fade-in-up-delay">
            We provide a comprehensive suite of services to ensure the success
            of your agricultural investment from start to finish.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r ${service.gradient} shadow-lg group-hover:scale-125 transition-all duration-500`}
                >
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-16 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="text-left space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              Our Flagship Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up-delay">
              Witness the tangible results of our commitment to sustainable
              agriculture and desert reclamation.
            </p>
          </div>
          {projectsStatus === "loading" ? (
            <p>Loading projects...</p>
          ) : projectsStatus === "failed" ? (
            <p>Failed to load projects.</p>
          ) : (
            <div className="space-y-12">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="lg:col-span-2">
                    <span
                      className={`inline-block px-4 py-1 text-sm font-semibold rounded-full mb-4 ${
                        project.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {project.status}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <span>{project.location}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Progress
                      </span>
                      <span className="font-bold text-emerald-600">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center space-y-4">
                    <div>
                      <span className="text-gray-500 font-medium">Area</span>
                      <p className="text-2xl font-bold text-gray-900">
                        {project.area}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">
                        Investment
                      </span>
                      <p className="text-2xl font-bold text-gray-900">
                        {project.investment}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Year</span>
                      <p className="text-2xl font-bold text-gray-900">
                        {project.year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-32 bg-gradient-to-br from-emerald-800 to-teal-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            What Our Partners Say
          </h2>
          <p className="text-xl text-gray-200 mb-16 max-w-3xl mx-auto animate-fade-in-up-delay">
            Our success is measured by the success and satisfaction of our
            partners and investors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-left animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-white text-lg mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-gray-300">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="animate-slide-in-left">
              <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Have a project in mind or want to learn more about our
                investment opportunities? We'd love to hear from you.
              </p>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Our Office
                    </h3>
                    <p className="text-gray-600">
                      123 Green Valley, Cairo, Egypt
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Email Us
                    </h3>
                    <p className="text-gray-600">contact@mkgroup.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Call Us
                    </h3>
                    <p className="text-gray-600">+20 123 456 7890</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 shadow-xl animate-slide-in-right">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-300"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 animate-pulse-slow"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">MK Group</span>
              </div>
              <p className="text-gray-400">
                Pioneering sustainable agriculture and desert reclamation for a
                greener future.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              {/* Add social media icons here */}
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
            &copy; {new Date().getFullYear()} MK Group. All Rights Reserved.
          </div>
        </div>
      </footer>

      <section
        id="certifications"
        className="py-32 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
            Certifications
          </h2>
          {certificationsStatus === "loading" ? (
            <p>Loading certifications...</p>
          ) : certificationsStatus === "failed" ? (
            <p>Failed to load certifications.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-6 py-4">
              {certifications.map((cert) => (
                <div
                  key={cert._id}
                  className="min-w-[220px] bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cert.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="awards"
        className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
            Awards
          </h2>
          {awardsStatus === "loading" ? (
            <p>Loading awards...</p>
          ) : awardsStatus === "failed" ? (
            <p>Failed to load awards.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-6 py-4">
              {awards.map((award) => (
                <div
                  key={award._id}
                  className="min-w-[220px] bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {award.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="news"
        className="py-32 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
            News from Press
          </h2>
          {newsStatus === "loading" ? (
            <p>Loading news...</p>
          ) : newsStatus === "failed" ? (
            <p>Failed to load news.</p>
          ) : (
            <div className="flex flex-wrap gap-6 py-4 justify-center">
              {news.map((item) => (
                <div
                  key={item._id}
                  className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="partnerships"
        className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
            Partnerships
          </h2>
          {partnershipsStatus === "loading" ? (
            <p>Loading partnerships...</p>
          ) : partnershipsStatus === "failed" ? (
            <p>Failed to load partnerships.</p>
          ) : (
            <div className="flex flex-wrap gap-6 py-4 justify-center">
              {partnerships.map((partner) => (
                <div
                  key={partner._id}
                  className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {partner.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
