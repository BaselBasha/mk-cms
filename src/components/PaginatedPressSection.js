import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPublicPress } from '@/redux/pressSlice';
import LoaderSpinner from '@/components/LoaderSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';

// --- Press Card Component ---
const PressCard = ({ item, index }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-80 h-96 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg cursor-pointer"
      onClick={() => {
        if (item.id) {
          window.location.href = `/press/${item.id}`;
        }
      }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <img
        src={item.img}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
        onError={(e) => {
          e.target.src = "https://mkgroup-eg.com/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-27-at-14.21.40_47a11d61.jpg";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
        <p className="text-gray-300 line-clamp-3">{item.description}</p>
        {item.publishDate && (
          <p className="text-[#65a30d] text-sm mt-2">{new Date(item.publishDate).toLocaleDateString()}</p>
        )}
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

// --- Main Paginated Press Section ---
const PaginatedPressSection = () => {
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === 'ar';

  const [startIndex, setStartIndex] = useState(0);
  const [allPressArticles, setAllPressArticles] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const cardWidth = 320; // w-80 (320px)
  const gap = 24; // space-x-6 (24px)
  const stepSize = cardWidth + gap; // Distance to move per step
  
  const { 
    publicItems: pressArticles, 
    loading: paginationLoading, 
    error 
  } = useSelector(state => state.press);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPublicPress());
  }, [dispatch]);

  // Update local state when press articles are loaded
  useEffect(() => {
    if (pressArticles && pressArticles.length > 0) {
      setAllPressArticles(pressArticles);
      setStartIndex(0);
    }
  }, [pressArticles]);

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

  // Transform press articles for display
  const displayPress = allPressArticles.map((press) => ({
    title: press.title,
    description: press.description || press.content,
    publishDate: press.publishDate || press.date,
    img: press.image && Array.isArray(press.image) && press.image.length > 0
        ? press.image[0]
        : "https://mkgroup-eg.com/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-27-at-14.21.40_47a11d61.jpg",
    id: press._id || press.id,
  }));

  // Calculate how many cards can fit in the container
  const cardsPerView = containerWidth > 0 ? Math.max(1, Math.floor(containerWidth / stepSize)) : 1;
  const totalContentWidth = displayPress.length * stepSize - gap;
  const maxShift = Math.max(0, totalContentWidth - containerWidth);
  const maxStartIndex = Math.max(0, displayPress.length - cardsPerView);
  
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
  const shouldShowLoader = paginationLoading && (!allPressArticles || allPressArticles.length === 0);
  const shouldShowEmpty = !paginationLoading && (!allPressArticles || allPressArticles.length === 0);

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
            {t.latestNews}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t.pressDescription}
          </p>
        </motion.div>

        {shouldShowLoader && (
          <div className="flex justify-center py-12">
            <LoaderSpinner size="lg" text="Loading press articles..." />
          </div>
        )}

        {shouldShowEmpty && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No press articles available at the moment.</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error loading press articles: {error}</p>
            <button 
              onClick={() => {
                dispatch(fetchPublicPress());
              }}
              className="px-6 py-2 bg-[#65a30d] text-white rounded-lg hover:bg-[#84cc16] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Press Articles Horizontal Scroll */}
        {allPressArticles && allPressArticles.length > 0 && (
          <div className="container mx-auto px-6">
            {paginationLoading ? (
              <div className="flex justify-center py-12">
                <LoaderSpinner size="lg" text="Loading press articles..." />
              </div>
            ) : (
              <>
                <div className="relative">
                  {/* Navigation Buttons - only show if more than 5 elements */}
                  {displayPress.length > 5 && (
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

                  {/* Press Articles Container with Smooth Sliding Carousel */}
                  <div 
                    className="overflow-hidden" 
                    ref={containerRef}
                    style={{ paddingRight: '20px', paddingLeft: '20px' }} // Account for button spacing
                  >
                    <motion.div
                      className={`flex space-x-6 ${displayPress.length <= 5 ? 'justify-center' : ''}`}
                      animate={{
                        x: displayPress.length <= 5 ? 0 : (isRTL ? currentTranslation : -currentTranslation),
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      {displayPress.map((article, index) => (
                        <motion.div
                          key={article.id || index}
                          className={`flex-shrink-0 w-80 ${index === displayPress.length - 1 ? 'mr-6' : ''}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            ease: 'easeOut',
                          }}
                        >
                          <PressCard item={article} index={index} />
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
          <Link href="/press">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#65a30d] to-[#84cc16] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#65a30d]/30 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.viewAllPress}
            </motion.button>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PaginatedPressSection;