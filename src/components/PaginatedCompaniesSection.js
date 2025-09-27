import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPublicCompanies } from "@/redux/companiesSlice";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";

// --- Glass Card Component for Companies ---
const GlassCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg cursor-pointer"
      onClick={() => {
        if (item.website) {
          window.open(item.website, "_blank");
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
        <p className="text-gray-300 line-clamp-2">{item.desc}</p>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#65a30d] rounded-2xl transition-all duration-300"></div>
    </motion.div>
  );
};

// --- Animated Section Component ---
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

// --- Main Horizontal Scroll Companies Section ---
const PaginatedCompaniesSection = () => {
  const dispatch = useDispatch();
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const [allCompanies, setAllCompanies] = useState([]);

  const {
    publicItems: companies,
    loading: paginationLoading,
    error,
  } = useSelector((state) => state.companies);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPublicCompanies());
  }, [dispatch]);

  // Update local state when companies are loaded
  useEffect(() => {
    if (companies && companies.length > 0) {
      setAllCompanies(companies);
    }
  }, [companies]);

  // Transform companies for display with proper image handling
  const displayCompanies = allCompanies.map((company) => {
    let imageUrl = "https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png"; // fallback

    if (company.logo && company.logo.url) {
      imageUrl = company.logo.url;
    } else if (company.image && company.image.url) {
      imageUrl = company.image.url;
    } else if (typeof company.image === "string") {
      imageUrl = company.image;
    } else if (company.logo && typeof company.logo === "string") {
      imageUrl = company.logo;
    }

    return {
      name: company.name,
      desc: company.summary || company.description,
      img: imageUrl,
      id: company._id || company.id,
      website: company.website,
    };
  });

  // Duplicate for seamless scroll
  const duplicated = [
    ...displayCompanies,
    ...displayCompanies,
    ...displayCompanies,
  ];

  // Always render, show loading or empty state
  const shouldShowLoader =
    paginationLoading && (!allCompanies || allCompanies.length === 0);
  const shouldShowEmpty =
    !paginationLoading && (!allCompanies || allCompanies.length === 0);

  return (
    <AnimatedSection
      id="companies"
      className="py-20 md:py-28 overflow-hidden bg-transparent"
    >
      <SectionTitle>{t.companies.title}</SectionTitle>

      {shouldShowLoader && (
        <div className="flex justify-center py-12">
          <LoaderSpinner size="lg" text="Loading companies..." />
        </div>
      )}

      {shouldShowEmpty && (
        <div className="text-center py-12">
          <p className="text-gray-400">No companies available at the moment.</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Error loading companies: {error}</p>
          <button
            onClick={() => {
              dispatch(fetchPublicCompanies());
            }}
            className="bg-[#65a30d] text-white px-6 py-2 rounded-lg hover:bg-[#84cc16] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Companies Horizontal Scroll */}
      {allCompanies && allCompanies.length > 0 && (
        <>
          {paginationLoading ? (
            <div className="flex justify-center py-12">
              <LoaderSpinner size="lg" text="Loading companies..." />
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
                  {duplicated.map((company, i) => (
                    <div key={i} className="flex-shrink-0 w-80 mx-6">
                      <GlassCard item={company} index={i} />
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
          href="/companies"
          className="inline-flex items-center bg-[#65a30d] text-white px-8 py-3 rounded-full hover:bg-[#84cc16] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#65a30d]/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{t.companies?.viewAll || "View All Companies"}</span>
        </motion.a>
      </div>
    </AnimatedSection>
  );
};

export default PaginatedCompaniesSection;