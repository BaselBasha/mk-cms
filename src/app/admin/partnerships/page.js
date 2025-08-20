"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartnerships, deletePartnership } from "@/redux/partnershipsSlice";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  Handshake,
  Calendar,
  MapPin,
} from "lucide-react";

// Partnership Card Component
const PartnershipCard = ({ partnership, onEdit, onDelete, onView, t }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get partnership image
  const getPartnershipImage = () => {
    if (partnership.image) {
      if (Array.isArray(partnership.image) && partnership.image.length > 0) {
        // If image is an array, take the first one
        const firstImage = partnership.image[0];
        if (typeof firstImage === 'string') {
          return firstImage;
        } else if (firstImage && firstImage.url) {
          return firstImage.url;
        }
      } else if (typeof partnership.image === 'string') {
        // If image is a direct string
        return partnership.image;
      } else if (partnership.image.url) {
        // If image is an object with url property (backend structure)
        return partnership.image.url;
      }
    }
    return null;
  };

  const partnershipImage = getPartnershipImage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-[#65a30d]/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {partnershipImage ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={partnershipImage} 
                alt={partnership.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-[#65a30d]/20 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                <Building className="h-6 w-6 text-[#65a30d]" />
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 bg-[#65a30d]/20 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-[#65a30d]" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {partnership.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {partnership.partnerInformation?.name || partnership.partnerName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            partnership.status === 'active' ? 'bg-green-500/20 text-green-400' :
            partnership.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            partnership.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {partnership.status}
          </span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {partnership.description}
      </p>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
        {partnership.partnerInformation?.headquarters && (
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{partnership.partnerInformation.headquarters}</span>
          </div>
        )}
        {partnership.startDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(partnership.startDate).getFullYear()}</span>
          </div>
        )}
        {partnership.partnerInformation?.specialization && (
          <div className="flex items-center space-x-1">
            <Handshake className="h-4 w-4" />
            <span>{partnership.partnerInformation.specialization}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>{t.admin.partnerships.created} {new Date(partnership.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(partnership)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(partnership)}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(partnership)}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Partnerships Admin Page
export default function PartnershipsAdminPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: partnerships, loading, error } = useSelector((state) => state.partnerships);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnershipToDelete, setPartnershipToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPartnerships());
  }, [dispatch]);

  // Filter and sort partnerships
  const filteredPartnerships = partnerships
    .filter((partnership) => {
      const matchesSearch = partnership.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (partnership.partnerInformation?.name || partnership.partnerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partnership.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || partnership.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || partnership.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (partnership) => {
    router.push(`/admin/partnerships/edit/${partnership._id || partnership.id}`);
  };

  const handleView = (partnership) => {
    router.push(`/partnerships/${partnership._id || partnership.id}`);
  };

  const handleDelete = (partnership) => {
    setPartnershipToDelete(partnership);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (partnershipToDelete) {
      try {
        await dispatch(deletePartnership(partnershipToDelete._id || partnershipToDelete.id)).unwrap();
        setShowDeleteModal(false);
        setPartnershipToDelete(null);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
        <span className="ml-3 text-white">{t.admin.partnerships.loading}</span>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage={t.admin.partnerships.pageTitle} />

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
                {t.admin.partnerships.management}
              </h1>
              <p className="text-xl text-gray-400">
                {t.admin.partnerships.subtitle}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/admin/partnerships/new")}
              className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#84cc16] text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.partnerships.addPartnership}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t.admin.partnerships.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            >
              <option value="all">{t.admin.partnerships.allStatus}</option>
              <option value="active">{t.admin.partnerships.status.active}</option>
              <option value="pending">{t.admin.partnerships.status.pending}</option>
              <option value="completed">{t.admin.partnerships.status.completed}</option>
              <option value="terminated">{t.admin.partnerships.status.terminated}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            >
              <option value="all">{t.admin.partnerships.allCategories}</option>
              <option value="technology">{t.admin.partnerships.categories.technology}</option>
              <option value="agriculture">{t.admin.partnerships.categories.agriculture}</option>
              <option value="energy">{t.admin.partnerships.categories.energy}</option>
              <option value="infrastructure">{t.admin.partnerships.categories.infrastructure}</option>
              <option value="research">{t.admin.partnerships.categories.research}</option>
              <option value="education">{t.admin.partnerships.categories.education}</option>
            </select>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
              >
                <option value="createdAt">{t.admin.partnerships.sort.createdDate}</option>
                <option value="title">{t.admin.partnerships.sort.title}</option>
                <option value="partnerName">{t.admin.partnerships.sort.partnerName}</option>
                <option value="status">{t.admin.partnerships.sort.status}</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 bg-black/30 border border-white/10 rounded-lg text-white hover:bg-black/50 transition-colors"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Partnerships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPartnerships.map((partnership, index) => (
              <PartnershipCard
                key={partnership._id || partnership.id}
                partnership={partnership}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPartnerships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">{t.admin.partnerships.noPartnershipsFound}</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? t.admin.partnerships.tryAdjustingFilters
                : t.admin.partnerships.getStartedMessage}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
              <button
                onClick={() => router.push("/admin/partnerships/new")}
                className="bg-[#65a30d] hover:bg-[#84cc16] text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{t.admin.partnerships.addPartnership}</span>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">{t.admin.partnerships.confirmDelete}</h3>
              <p className="text-gray-300 mb-6">
                {t.admin.partnerships.deleteConfirm.replace('{title}', partnershipToDelete?.title)}
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  {t.admin.partnerships.cancel}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {t.admin.partnerships.confirmDeleteButton}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 