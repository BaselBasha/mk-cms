"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAwards, deleteAward } from "@/redux/awardsSlice";
import { Edit, Trash2, Eye, Plus, Search, Calendar, Trophy, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { isSuperAdmin } from "@/shared/auth";

export default function AdminAwardsPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const dispatch = useDispatch();
  const { items: awards, loading, error } = useSelector((state) => state.awards);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [selectedAward, setSelectedAward] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAwards());
  }, [dispatch]);

  const handleDelete = async (awardId) => {
    try {
      await dispatch(deleteAward(awardId)).unwrap();
      setShowDeleteModal(false);
      setSelectedAward(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredAwards = awards?.filter(award => {
    const matchesSearch = award.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || award.category === categoryFilter;
    const matchesYear = !yearFilter || (award.awardDate && new Date(award.awardDate).getFullYear().toString() === yearFilter);
    return matchesSearch && matchesCategory && matchesYear;
  }) || [];

  const getCategoryColor = (category) => {
    const colors = {
      'excellence': 'bg-green-500',
      'innovation': 'bg-blue-500',
      'leadership': 'bg-purple-500',
      'service': 'bg-orange-500',
      'achievement': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.awards.loadingAwards}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage={t.admin.awards.pageTitle} />
      
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.admin.awards.management}</h1>
            <p className="text-gray-400">{t.admin.awards.subtitle}</p>
          </div>
          <Link
            href="/admin/awards/new"
            className="bg-[#65a30d] hover:bg-[#84cc16] text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{t.admin.awards.addNewAward}</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t.admin.awards.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">{t.admin.awards.allCategories}</option>
              <option value="excellence">{t.admin.awards.categories.excellence}</option>
              <option value="innovation">{t.admin.awards.categories.innovation}</option>
              <option value="leadership">{t.admin.awards.categories.leadership}</option>
              <option value="service">{t.admin.awards.categories.service}</option>
              <option value="achievement">{t.admin.awards.categories.achievement}</option>
            </select>

            {/* Year Filter */}
            <input
              type="number"
              placeholder={t.admin.awards.filterByYear}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {/* Results Count */}
            <div className="flex items-center justify-end text-gray-400">
              <span>{t.admin.awards.resultsCount.replace('{filtered}', filteredAwards.length).replace('{total}', awards?.length || 0)}</span>
            </div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award) => (
            <motion.div
              key={award._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Award Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                {award.image ? (
                  <img
                    src={typeof award.image === 'string' ? award.image : award.image.url}
                    alt={award.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gray-800 flex items-center justify-center ${award.image ? 'hidden' : ''}`}>
                  <Trophy className="h-12 w-12 text-gray-400" />
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(award.category)}`}>
                    {award.category}
                  </span>
                </div>

                {/* Year Badge */}
                {award.awardDate && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-500">
                      {new Date(award.awardDate).getFullYear()}
                    </span>
                  </div>
                )}
              </div>

              {/* Award Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2">{award.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{award.description}</p>

                {/* Award Details */}
                <div className="space-y-2 text-sm">
                  {award.awardingBody && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <span className="font-medium">{t.admin.awards.awardingBody}</span>
                      <span>{award.awardingBody}</span>
                    </div>
                  )}
                  
                  {award.category && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <span className="font-medium">{t.admin.awards.category}</span>
                      <span>{award.category}</span>
                    </div>
                  )}

                  {award.awardDate && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(award.awardDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4">
                  <Link
                    href={`/awards/${award._id}`}
                    target="_blank"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t.admin.awards.view}</span>
                  </Link>
                  
                  <Link
                    href={`/admin/awards/edit/${award._id}`}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{t.admin.awards.edit}</span>
                  </Link>
                  
                  {isSuperAdmin() && (
                    <button
                      onClick={() => {
                        setSelectedAward(award);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t.admin.awards.delete}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAwards.length === 0 && !loading && (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.admin.awards.noAwardsFound}</h3>
            <p className="text-gray-400 mb-6">{t.admin.awards.noAwardsSubtitle}</p>
            <Link
              href="/admin/awards/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.awards.addFirstAward}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedAward && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">{t.admin.awards.deleteAward}</h3>
            <p className="text-gray-400 mb-6">
              {t.admin.awards.deleteConfirm.replace('{title}', selectedAward.title)}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {t.admin.awards.cancel}
              </button>
              <button
                onClick={() => handleDelete(selectedAward._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.admin.awards.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 