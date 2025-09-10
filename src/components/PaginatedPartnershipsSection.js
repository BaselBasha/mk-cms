import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPublicPartnerships } from '@/redux/partnershipsSlice';
import LoaderSpinner from '@/components/LoaderSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';

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
          e.target.src = "https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png";
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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.status === "active" 
              ? "bg-green-500/20 text-green-400" 
              : item.status === "completed"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-500/20 text-gray-400"
          }`}>
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
const AnimatedSection = ({ children, className = "" }) => {
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 60 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  return (
    <motion.section
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

// --- Main Paginated Partnerships Section ---
const PaginatedPartnershipsSection = () => {
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === 'ar';

  const [startIndex, setStartIndex] = useState(0);
  const [allPartnerships, setAllPartnerships] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const cardWidth = 320; // w-80 (320px)
  const gap = 24; // space-x-6 (24px)
  const stepSize = cardWidth + gap; // Distance to move per step
  
  const { 
    publicItems: partnerships, 
    loading: paginationLoading, 
    error 
  } = useSelector(state => state.partnerships);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPublicPartnerships());
  }, [dispatch]);

  // Update local state when partnerships are loaded
  useEffect(() => {
    if (partnerships && partnerships.length > 0) {
      setAllPartnerships(partnerships);
      setStartIndex(0);
    }
  }, [partnerships]);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Calculate how many cards can fit in the container
  const cardsPerView = containerWidth > 0 ? Math.max(1, Math.floor(containerWidth / stepSize)) : 1;
  const totalContentWidth = displayPartnerships.length * stepSize - gap;
  const maxShift = Math.max(0, totalContentWidth - containerWidth);
  const maxStartIndex = Math.max(0, displayPartnerships.length - cardsPerView);
  
  // Ensure startIndex doesn't exceed maxStartIndex
  const validatedStartIndex = Math.min(startIndex, maxStartIndex);

  // Navigation handlers
  const handlePrevious = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(prev + 1, maxStartIndex));
  };

  // Calculate current translation using validated index
  const currentTranslation = Math.min(validatedStartIndex * stepSize, maxShift);

  // Check if navigation buttons should be disabled
  const isPrevDisabled = validatedStartIndex <= 0;
  const isNextDisabled = validatedStartIndex >= maxStartIndex;

  // Always render, show loading or empty state
  const shouldShowLoader = paginationLoading && (!allPartnerships || allPartnerships.length === 0);
  const shouldShowEmpty = !paginationLoading && (!allPartnerships || allPartnerships.length === 0);

  return (
    <AnimatedSection className="py-20 relative">
      {/* Content */}
      <div className="relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            {t.ourPartnerships}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t.partnershipsDescription}
          </p>
        </motion.div>

        {shouldShowLoader && (
          <div className="flex justify-center py-12">
            <LoaderSpinner size="lg" text="Loading partnerships..." />
          </div>
        )}

        {shouldShowEmpty && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No partnerships available at the moment.</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error loading partnerships: {error}</p>
            <button 
              onClick={() => {
                dispatch(fetchPublicPartnerships());
              }}
              className="px-6 py-2 bg-[#65a30d] text-white rounded-lg hover:bg-[#84cc16] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Partnerships Horizontal Scroll */}
        {allPartnerships && allPartnerships.length > 0 && (
          <div className="container mx-auto px-6">
            {paginationLoading ? (
              <div className="flex justify-center py-12">
                <LoaderSpinner size="lg" text="Loading partnerships..." />
              </div>
            ) : (
              <>
                <div className="relative">
                  {/* Navigation Buttons - only show if more than 5 elements */}
                  {displayPartnerships.length > 5 && (
                    <>
                      <button
                        onClick={isRTL ? handleNext : handlePrevious}
                        disabled={isRTL ? isNextDisabled : isPrevDisabled}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#65a30d]/80 hover:bg-[#65a30d] text-white p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#65a30d]/80"
                        style={{ marginLeft: '-20px' }}
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        onClick={isRTL ? handlePrevious : handleNext}
                        disabled={isRTL ? isPrevDisabled : isNextDisabled}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#65a30d]/80 hover:bg-[#65a30d] text-white p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#65a30d]/80"
                        style={{ marginRight: '-20px' }}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Partnerships Container with Smooth Sliding Carousel */}
                  <div 
                    className="overflow-hidden" 
                    ref={containerRef}
                    style={{ paddingRight: '20px', paddingLeft: '20px' }} // Account for button spacing
                  >
                    <motion.div
                      className={`flex space-x-6 ${displayPartnerships.length <= 5 ? 'justify-center' : ''}`}
                      animate={{
                        x: displayPartnerships.length <= 5 ? 0 : (isRTL ? currentTranslation : -currentTranslation),
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      {displayPartnerships.map((partnership, index) => (
                        <motion.div
                          key={partnership.id || index}
                          className={`flex-shrink-0 w-80 ${index === displayPartnerships.length - 1 ? 'mr-6' : ''}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            ease: 'easeOut',
                          }}
                        >
                          <GlassCard item={partnership} index={index} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
                
              </>
            )}
          </div>
        )}

        {/* View all button */}
        <div className="flex justify-center mt-8">
          <Link href="/partnerships">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#65a30d] to-[#84cc16] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#65a30d]/30 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.viewAllPartnerships}
            </motion.button>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PaginatedPartnershipsSection;