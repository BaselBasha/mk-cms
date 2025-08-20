"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCareers, deleteCareer } from "@/redux/careersSlice";
import { Edit, Trash2, Eye, Plus, Search, Calendar, MapPin, DollarSign, AlertCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";

export default function AdminCareersPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const dispatch = useDispatch();
  const { items: careers, loading, error } = useSelector((state) => state.careers);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCareers());
  }, [dispatch]);

  const handleDelete = async (careerId) => {
    try {
      await dispatch(deleteCareer(careerId)).unwrap();
      setShowDeleteModal(false);
      setSelectedCareer(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredCareers = careers?.filter(career => {
    const matchesSearch = career.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || career.type === typeFilter;
    const matchesLocation = !locationFilter || career.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  }) || [];

  const getTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-green-500',
      'Part-time': 'bg-blue-500',
      'Contract': 'bg-yellow-500',
      'Internship': 'bg-purple-500',
      'Remote': 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.careers.loadingCareers}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage={t.admin.careers.pageTitle} />
      
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.admin.careers.management}</h1>
            <p className="text-gray-400">{t.admin.careers.subtitle}</p>
          </div>
          <Link
            href="/admin/careers/new"
            className="bg-[#65a30d] hover:bg-[#84cc16] text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{t.admin.careers.addNewCareer}</span>
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
                placeholder={t.admin.careers.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">{t.admin.careers.allTypes}</option>
              <option value="Full-time">{t.admin.careers.types.fullTime}</option>
              <option value="Part-time">{t.admin.careers.types.partTime}</option>
              <option value="Contract">{t.admin.careers.types.contract}</option>
              <option value="Internship">{t.admin.careers.types.internship}</option>
              <option value="Remote">{t.admin.careers.types.remote}</option>
            </select>

            {/* Location Filter */}
            <input
              type="text"
              placeholder={t.admin.careers.filterByLocation}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {/* Results Count */}
            <div className="flex items-center justify-end text-gray-400">
              <span>{t.admin.careers.resultsCount.replace('{filtered}', filteredCareers.length).replace('{total}', careers?.length || 0)}</span>
            </div>
          </div>
        </div>

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <motion.div
              key={career._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Career Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(career.type)}`}>
                    {career.type}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(career.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Career Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2">{career.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{career.description}</p>

                {/* Career Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{career.location}</span>
                  </div>
                  
                  {career.salary && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {typeof career.salary === 'object' 
                          ? `${career.salary.min || ''} - ${career.salary.max || ''} ${career.salary.currency || ''}`
                          : career.salary
                        }
                      </span>
                    </div>
                  )}

                  {career.applicationDeadline && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{t.admin.careers.deadline} {new Date(career.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {career.requirements && career.requirements.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-white mb-2">{t.admin.careers.requirements}</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {career.requirements.slice(0, 3).map((req, index) => (
                        <li key={`req-${career._id}-${index}`} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                      {career.requirements.length > 3 && (
                        <li key={`req-more-${career._id}`} className="text-gray-500">+{career.requirements.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4">
                  <Link
                    href={`/careers/`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t.admin.careers.view}</span>
                  </Link>
                  
                  <Link
                    href={`/admin/careers/edit/${career._id}`}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{t.admin.careers.edit}</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setSelectedCareer(career);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t.admin.careers.delete}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCareers.length === 0 && !loading && (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.admin.careers.noCareersFound}</h3>
            <p className="text-gray-400 mb-6">{t.admin.careers.noCareersSubtitle}</p>
            <Link
              href="/admin/careers/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.careers.addFirstCareer}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedCareer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">{t.admin.careers.deleteCareer}</h3>
            <p className="text-gray-400 mb-6">
              {t.admin.careers.deleteConfirm.replace('{title}', selectedCareer.title)}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {t.admin.careers.cancel}
              </button>
              <button
                onClick={() => handleDelete(selectedCareer._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.admin.careers.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 