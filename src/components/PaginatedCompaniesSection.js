import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPublicCompanies } from '@/redux/companiesSlice';
import LoaderSpinner from '@/components/LoaderSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';

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
          window.open(item.website, '_blank');
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
            'https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png';
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
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-100 mb-4">
      {children}
    </h2>
    <div className="w-24 h-1 bg-gradient-to-r from-[#65a30d] to-[#84cc16] mb-16 mx-auto rounded-full"></div>
  </motion.div>
);

// --- Main Horizontal Scroll Companies Section ---
const PaginatedCompaniesSection = () => {
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === 'ar';

  const [startIndex, setStartIndex] = useState(0);
  const [allCompanies, setAllCompanies] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const cardWidth = 320; // w-80 (320px)
  const gap = 24; // space-x-6 (24px)
  const stepSize = cardWidth + gap; // Distance to move per step

  const { publicItems: companies, loading: paginationLoading, error } =
    useSelector((state) => state.companies);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPublicCompanies());
  }, [dispatch]);

  // Update local state when companies are loaded
  useEffect(() => {
    if (companies && companies.length > 0) {
      setAllCompanies(companies);
      setStartIndex(0);
    }
  }, [companies]);

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

  // Transform companies for display with proper image handling
  const displayCompanies = allCompanies.map((company) => {
    let imageUrl =
      'https://mkgroup-eg.com/wp-content/uploads/2024/05/NVU.png'; // fallback

    if (company.logo && company.logo.url) {
      imageUrl = company.logo.url;
    } else if (company.image && company.image.url) {
      imageUrl = company.image.url;
    } else if (typeof company.image === 'string') {
      imageUrl = company.image;
    } else if (company.logo && typeof company.logo === 'string') {
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

  // Calculate how many cards can fit in the container
  const cardsPerView = containerWidth > 0 ? Math.max(1, Math.floor(containerWidth / stepSize)) : 1;
  const totalContentWidth = displayCompanies.length * stepSize - gap;
  const maxShift = Math.max(0, totalContentWidth - containerWidth);
  const maxStartIndex = Math.max(0, displayCompanies.length - cardsPerView);
  
  // Ensure startIndex doesn't exceed maxStartIndex
  const validatedStartIndex = Math.min(startIndex, maxStartIndex);

  // Navigation handlers
  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxStartIndex));
  };

  // Calculate current translation using validated index
  const currentTranslation = Math.min(validatedStartIndex * stepSize, maxShift);

  // Check if navigation buttons should be disabled
  const isPrevDisabled = validatedStartIndex <= 0;
  const isNextDisabled = validatedStartIndex >= maxStartIndex;

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
        <div className="container mx-auto px-6">
          {paginationLoading ? (
            <div className="flex justify-center py-12">
              <LoaderSpinner size="lg" text="Loading companies..." />
            </div>
          ) : (
            <>
               <div className="relative">
                 {/* Navigation Buttons - only show if more than 5 elements */}
                 {displayCompanies.length > 5 && (
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

                 {/* Companies Container with Smooth Sliding Carousel */}
                 <div 
                   className="overflow-hidden" 
                   ref={containerRef}
                   style={{ paddingRight: '20px', paddingLeft: '20px' }} // Account for button spacing
                 >
                   <motion.div
                     className={`flex space-x-6 ${displayCompanies.length <= 5 ? 'justify-center' : ''}`}
                     animate={{
                       x: displayCompanies.length <= 5 ? 0 : (isRTL ? currentTranslation : -currentTranslation),
                     }}
                     transition={{ duration: 0.5, ease: 'easeInOut' }}
                   >
                    {displayCompanies.map((company, index) => (
                      <motion.div
                        key={company.id || index}
                        className={`flex-shrink-0 w-80 ${index === displayCompanies.length - 1 ? 'mr-6' : ''}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: 'easeOut',
                        }}
                      >
                        <GlassCard item={company} index={index} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              
            </>
          )}
        </div>
      )}
    </AnimatedSection>
  );
};

export default PaginatedCompaniesSection;