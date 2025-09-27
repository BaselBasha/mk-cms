import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPartnerships } from "@/redux/partnershipsSlice";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { ArrowLeft } from "lucide-react";

// --- Glass Card Component for Partnerships ---
const GlassCard = ({ item, index }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg cursor-pointer"
      onClick={() => {
        if (item.id) {
          window.location.href = `/partnerships/${item.id}`;
        }
      }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <img
        src={item.img}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
        onError={(e) => {
          e.target.src =
            "https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
        {item.duration && (
          <p className="text-gray-300 text-sm mb-2">{item.duration}</p>
        )}
        <p className="text-gray-300 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.status === "active"
                ? "bg-green-500/20 text-green-400"
                : item.status === "completed"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {getStatusText(item.status)}
          </span>
          {item.priority && (
            <span className="text-[#65a30d] text-xs font-medium">
              {item.priority}
            </span>
          )}
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#65a30d] rounded-2xl transition-all duration-300"></div>
    </motion.div>
  );
};

// --- Animated Section Component ---
const AnimatedSection = ({ children, className = "", id }) => {
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// --- Section Title Component ---
const SectionTitle = ({ children }) => (
  <motion.h2
    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-16 text-center leading-tight py-4"
    style={{
      minHeight: "55px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.h2>
);

// --- Main Infinite Scroll Partnerships Section ---
const PaginatedPartnershipsSection = () => {
  const dispatch = useDispatch();
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const [allPartnerships, setAllPartnerships] = useState([]);

  const {
    publicItems: partnerships,
    loading: paginationLoading,
    error,
  } = useSelector((state) => state.partnerships);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPublicPartnerships());
  }, [dispatch]);

  // Update local state when partnerships are loaded
  useEffect(() => {
    if (partnerships && partnerships.length > 0) {
      setAllPartnerships(partnerships);
    }
  }, [partnerships]);

  // Transform partnerships for display
  const displayPartnerships = allPartnerships.map((partnership) => {
    // Handle partnership image - check multiple possible fields
    let imageUrl = "https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png"; // fallback

    if (partnership.logo && partnership.logo.url) {
      imageUrl = partnership.logo.url;
    } else if (partnership.image && partnership.image.url) {
      imageUrl = partnership.image.url;
    } else if (typeof partnership.image === "string") {
      imageUrl = partnership.image;
    } else if (partnership.logo && typeof partnership.logo === "string") {
      imageUrl = partnership.logo;
    }

    return {
      name: partnership.name || partnership.companyName,
      description: partnership.description,
      img: imageUrl,
      duration: partnership.duration,
      id: partnership._id || partnership.id,
      status: partnership.status,
      priority: partnership.priority,
    };
  });

  // Duplicate for seamless scroll
  const duplicated = [
    ...displayPartnerships,
    ...displayPartnerships,
    ...displayPartnerships,
  ];

  // Always render, show loading or empty state
  const shouldShowLoader =
    paginationLoading && (!allPartnerships || allPartnerships.length === 0);
  const shouldShowEmpty =
    !paginationLoading && (!allPartnerships || allPartnerships.length === 0);

  return (
    <AnimatedSection
      id="partnerships"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>{t.ourPartnerships}</SectionTitle>

      {shouldShowLoader && (
        <div className="flex justify-center py-12">
          <LoaderSpinner size="lg" text="Loading partnerships..." />
        </div>
      )}

      {shouldShowEmpty && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No partnerships available at the moment.
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">
            Error loading partnerships: {error}
          </p>
          <button
            onClick={() => {
              dispatch(fetchPublicPartnerships());
            }}
            className="bg-[#65a30d] text-white px-6 py-2 rounded-lg hover:bg-[#84cc16] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Partnerships Horizontal Scroll */}
      {allPartnerships && allPartnerships.length > 0 && (
        <>
          {paginationLoading ? (
            <div className="flex justify-center py-12">
              <LoaderSpinner size="lg" text="Loading partnerships..." />
            </div>
          ) : (
            <>
              <div className="mb-8"></div>
              <div className="relative w-full overflow-hidden mask-gradient">
                <motion.div
                  className="flex"
                  animate={{ x: ["0%", `-${100 / 3}%`] }}
                  transition={{
                    ease: "linear",
                    duration: 20,
                    repeat: Infinity,
                  }}
                  drag="x"
                  dragConstraints={
                    isRTL ? { left: 0, right: 1000 } : { left: -1000, right: 0 }
                  }
                  whileTap={{ cursor: "grabbing" }}
                >
                  {duplicated.map((partnership, i) => (
                    <div key={i} className="flex-shrink-0 w-80 mx-6">
                      <GlassCard item={partnership} index={i} />
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
            </>
          )}
        </>
      )}

      {/* View all button */}
      <div className="text-center mt-12">
        <motion.a
          href="/partnerships"
          className="inline-flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All Partnerships</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </motion.a>
      </div>
    </AnimatedSection>
  );
};

export default PaginatedPartnershipsSection;
