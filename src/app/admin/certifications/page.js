"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertifications, deleteCertification } from "@/redux/certificationsSlice";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { isSuperAdmin } from "@/shared/auth";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Shield
} from "lucide-react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 50;

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
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() - 0.5) * 0.5;
        const directionY = (Math.random() - 0.5) * 0.5;
        const color = `rgba(101, 163, 13, ${Math.random() * 0.3 + 0.1})`;

        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => particle.update());
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// Certification Card Component
const CertificationCard = ({ certification, onEdit, onView, onDelete, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
  >
    {/* Image Section */}
    <div className="mb-4">
      <div className="relative h-32 bg-white/90 rounded-lg flex items-center justify-center overflow-hidden">
        {certification.image?.url ? (
          <img
            src={certification.image.url}
            alt={certification.title}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`flex items-center justify-center w-full h-full ${certification.image?.url ? 'hidden' : ''}`}
          style={{ display: certification.image?.url ? 'none' : 'flex' }}
        >
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-[#65a30d]/20 rounded-lg flex items-center justify-center">
          <Award className="h-6 w-6 text-[#65a30d]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-2">{certification.title}</h3>
          <p className="text-sm text-gray-400 truncate max-w-[150px]">{certification.issuingBody}</p>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          certification.priority === "high"
            ? "bg-red-500/20 text-red-300 border border-red-500/30"
            : certification.priority === "medium"
            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            : "bg-green-500/20 text-green-300 border border-green-500/30"
        }`}
      >
        {certification.priority} {t.admin.certifications.priority}
      </div>
    </div>

    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
      {certification.summary}
    </p>

    <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
      <div className="flex items-center space-x-1">
        <Calendar className="h-3 w-3" />
        <span>{t.admin.certifications.issued} {new Date(certification.issueDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <CheckCircle className="h-3 w-3" />
        <span>{t.admin.certifications.valid} {new Date(certification.validUntil).toLocaleDateString()}</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(certification)}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
        >
          <Eye className="h-3 w-3" />
          <span>{t.admin.certifications.view}</span>
        </button>
        <button
          onClick={() => onEdit(certification)}
          className="flex items-center space-x-1 px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-lg hover:bg-yellow-600/30 transition-colors"
        >
          <Edit className="h-3 w-3" />
          <span>{t.admin.certifications.edit}</span>
        </button>
        {isSuperAdmin() && (
          <button
            onClick={() => onDelete(certification)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>{t.admin.certifications.delete}</span>
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// Main Component
export default function CertificationsAdminPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: certifications, loading, error } = useSelector((state) => state.certifications);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchCertifications());
  }, [dispatch, language]); // Add language dependency

  // Filter and sort certifications
  const filteredCertifications = certifications
    .filter((cert) => {
      const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.issuingBody.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || cert.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (certification) => {
    router.push(`/admin/certifications/edit/${certification._id}`);
  };

  const handleView = (certification) => {
    router.push(`/certifications`);
  };

  const handleDelete = (certification) => {
    setCertificationToDelete(certification);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (certificationToDelete) {
      try {
        await dispatch(deleteCertification(certificationToDelete._id)).unwrap();
        setShowDeleteModal(false);
        setCertificationToDelete(null);
      } catch (error) {
        console.error("Failed to delete certification:", error);
        const msg = (error && error.message) || (language === 'ar' ? 'لا تملك صلاحية الحذف' : 'You do not have permission to delete this item');
        setToast({ type: 'error', message: msg });
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#65a30d] border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">{t.admin.certifications.loadingCertifications}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl text-red-400 mb-4">{t.admin.certifications.errorLoading}</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader currentPage={t.admin.certifications.pageTitle} />
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>
      
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg border ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-green-500/20 border-green-500/30 text-green-200'}`}>
          {toast.message}
        </div>
      )}
      
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {t.admin.certifications.management}
              </h1>
              <p className="text-xl text-gray-400">
                {t.admin.certifications.subtitle}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/admin/certifications/new")}
              className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#528000] text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.certifications.addCertification}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t.admin.certifications.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            >
              <option value="all">{t.admin.certifications.allStatus}</option>
              <option value="active">{t.admin.certifications.status.active}</option>
              <option value="expired">{t.admin.certifications.status.expired}</option>
              <option value="pending">{t.admin.certifications.status.pending}</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            >
              <option value="all">{t.admin.certifications.allCategories}</option>
              <option value="quality">{t.admin.certifications.categories.quality}</option>
              <option value="environmental">{t.admin.certifications.categories.environmental}</option>
              <option value="organic">{t.admin.certifications.categories.organic}</option>
              <option value="food-safety">{t.admin.certifications.categories.foodSafety}</option>
              <option value="accreditation">{t.admin.certifications.categories.accreditation}</option>
              <option value="national">{t.admin.certifications.categories.national}</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            >
              <option value="createdAt-desc">{t.admin.certifications.sort.newestFirst}</option>
              <option value="createdAt-asc">{t.admin.certifications.sort.oldestFirst}</option>
              <option value="title-asc">{t.admin.certifications.sort.titleAZ}</option>
              <option value="title-desc">{t.admin.certifications.sort.titleZA}</option>
              <option value="priority-desc">{t.admin.certifications.sort.priorityHighLow}</option>
              <option value="priority-asc">{t.admin.certifications.sort.priorityLowHigh}</option>
            </select>
          </div>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCertifications.map((certification) => (
              <CertificationCard
                key={certification._id}
                certification={certification}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                t={t}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCertifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.admin.certifications.noCertificationsFound}</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? t.admin.certifications.tryAdjustingFilters
                : t.admin.certifications.getStartedMessage}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
              <button
                onClick={() => router.push("/admin/certifications/new")}
                className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#528000] text-white rounded-xl font-medium transition-colors mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>{t.admin.certifications.addCertification}</span>
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{t.admin.certifications.deleteCertification}</h3>
                  <p className="text-sm text-gray-400">{t.admin.certifications.deleteWarning}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {t.admin.certifications.deleteConfirm.replace('{title}', certificationToDelete?.title)}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCertificationToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  {t.admin.certifications.cancel}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {t.admin.certifications.confirmDelete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 