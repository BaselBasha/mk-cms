"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Building,
  Star,
  Check,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import {
  fetchPublicCareers,
  selectPublicCareers,
  selectCareersLoading,
  selectCareersError,
} from "../../redux/careersSlice";

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
        let color = "rgba(200, 164, 100, 0.3)";
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
        <motion.a
          href="/"
          className="flex items-center space-x-2 text-gray-300 hover:text-[#65a30d] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </motion.a>
      </div>
    </header>
  );
};

// --- Hero Section ---
const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center text-white text-center">
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center"
      >
        <Briefcase className="w-12 h-12 text-white" />
      </motion.div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Join Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65a30d] to-[#84cc16]">
          Team
        </span>
      </h1>
      <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-300 leading-relaxed">
        Build your career with a company that's leading the future of sustainable agriculture
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 text-sm text-gray-400"
      >
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#65a30d]" />
          <span>50+ Team Members</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-[#65a30d]" />
          <span>Multiple Departments</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-[#65a30d]" />
          <span>Growth Opportunities</span>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

// --- Job Card Component ---
const JobCard = ({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#65a30d]/20 transition-all duration-500"
    whileHover={{ y: -10, scale: 1.02 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#65a30d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {/* Job Header */}
    <div className="p-8 border-b border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white group-hover:text-[#65a30d] transition-colors duration-300 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.type === "Full-time"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : job.type === "Part-time"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : job.type === "Contract"
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : job.type === "Internship"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
          }`}>
            {job.type}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.experience === "Entry Level"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : job.experience === "Junior"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : job.experience === "Mid Level"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : job.experience === "Senior"
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}>
            {job.experience}
          </div>
        </div>
      </div>

      <p className="text-gray-400 leading-relaxed mb-4">
        {job.summary}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Posted {job.postedDate}</span>
          </div>
          {job.salary && job.salary.min && job.salary.max && (
            <div className="flex items-center space-x-1 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary.min} - {job.salary.max} {job.salary.currency}</span>
            </div>
          )}
        </div>
        {job.applicationDeadline && (
          <div className="flex items-center space-x-1 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        )}
      </div>
    </div>

    {/* Job Details */}
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Requirements:
          </h4>
          <div className="space-y-2">
            {job.requirements.slice(0, 3).map((req, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm text-gray-400">
                <Check className="w-3 h-3 text-[#65a30d] flex-shrink-0" />
                <span>{req}</span>
              </div>
            ))}
            {job.requirements.length > 3 && (
              <div className="text-sm text-gray-500">
                +{job.requirements.length - 3} more requirements
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Benefits:
          </h4>
          <div className="space-y-2">
            {job.benefits.slice(0, 3).map((benefit, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm text-gray-400">
                <Star className="w-3 h-3 text-[#65a30d] flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
            {job.benefits.length > 3 && (
              <div className="text-sm text-gray-500">
                +{job.benefits.length - 3} more benefits
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const subject = `Application for ${job.title} position`;
            const body = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.title} position at ${job.department} department.\n\nPlease find my application attached.\n\nBest regards,\n[Your Name]`;
            const mailtoLink = `mailto:hamza.alaydi.99@outlook.sa?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, '_blank');
          }}
          className="bg-[#65a30d] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#528000] transition-colors duration-300 flex items-center space-x-2 cursor-pointer z-10 relative"
          type="button"
        >
          <Mail className="w-4 h-4" />
          <span>Apply Now</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// --- Filter Component ---
const FilterSection = ({
  departments,
  activeDepartment,
  onDepartmentChange,
  searchTerm,
  onSearchChange,
  experienceLevels,
  activeExperience,
  onExperienceChange,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    <div className="container mx-auto px-6">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Department Filters */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">Department:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {departments.map((dept) => (
              <motion.button
                key={dept}
                onClick={() => onDepartmentChange(dept)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeDepartment === dept
                    ? "bg-[#65a30d] text-white shadow-lg"
                    : "bg-black/20 text-gray-300 hover:bg-white/5 border border-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dept}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Experience Level Filters */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">Experience Level:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {experienceLevels.map((level) => (
              <motion.button
                key={level}
                onClick={() => onExperienceChange(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeExperience === level
                    ? "bg-[#65a30d] text-white shadow-lg"
                    : "bg-black/20 text-gray-300 hover:bg-white/5 border border-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Statistics Section ---
const StatsSection = ({
  totalJobs,
  departments,
  experienceLevels,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="py-20"
  >
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Open Positions",
            value: totalJobs,
            icon: Briefcase,
          },
          {
            title: "Departments",
            value: departments.length - 1,
            icon: Building,
          },
          {
            title: "Experience Levels",
            value: experienceLevels.length - 1,
            icon: Users,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center">
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function CareersPage() {
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [activeExperience, setActiveExperience] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  // Redux selectors
  const careers = useSelector(selectPublicCareers);
  const loading = useSelector(selectCareersLoading);
  const error = useSelector(selectCareersError);

  // Load careers data
  useEffect(() => {
    dispatch(fetchPublicCareers());
  }, [dispatch]);

  const departments = [
    "All",
    "Engineering",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "HR",
    "IT",
    "Research & Development",
    "Quality Assurance",
    "Supply Chain",
  ];

  const experienceLevels = [
    "All",
    "Entry Level",
    "Junior",
    "Mid Level",
    "Senior",
    "Executive",
  ];

  const filteredCareers = careers.filter((career) => {
    const matchesDepartment =
      activeDepartment === "All" || career.department === activeDepartment;
    const matchesExperience =
      activeExperience === "All" || career.experience === activeExperience;
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesExperience && matchesSearch;
  });

  if (loading && careers.length === 0) {
    return (
      <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative min-h-screen">
        <ParticleBackground />
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#65a30d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading careers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-gray-200 font-sans overflow-x-hidden relative min-h-screen">
      <ParticleBackground />
      <Header />

      <main>
        <HeroSection />

        <StatsSection
          totalJobs={careers.length}
          departments={departments}
          experienceLevels={experienceLevels}
        />

        <FilterSection
          departments={departments}
          activeDepartment={activeDepartment}
          onDepartmentChange={setActiveDepartment}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          experienceLevels={experienceLevels}
          activeExperience={activeExperience}
          onExperienceChange={setActiveExperience}
        />

        <section className="py-20">
          <div className="container mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDepartment + activeExperience + searchTerm}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {filteredCareers.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredCareers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">
                  No jobs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 