"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, deleteCompany } from "@/redux/companiesSlice";
import { Edit, Trash2, Eye, Plus, Search, AlertCircle, Globe, Calendar, Layers } from "lucide-react";
import { useCallback, useState as useReactState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { isSuperAdmin } from "@/shared/auth";

export default function AdminCompaniesPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const dispatch = useDispatch();
  const { items: companies, loading } = useSelector((state) => state.companies);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const [toast, setToast] = useReactState(null);
  const handleDelete = async (companyId) => {
    try {
      await dispatch(deleteCompany(companyId)).unwrap();
      setShowDeleteModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Delete failed:", error);
      const msg = (error && error.message) || (language === 'ar' ? 'لا تملك صلاحية الحذف' : 'You do not have permission to delete');
      setToast({ type: 'error', message: msg });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading companies...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage="Companies" />
      
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10 mt-20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Companies Management</h1>
              <p className="text-gray-400">Manage all companies</p>
            </div>
            <Link
              href="/admin/companies/new"
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 transition-colors`}
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin?.nav?.addNewCompany || 'Add New Company'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث في الشركات...' : 'Search companies...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Company Logo */}
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                {company.logo?.url ? (
                  <img
                    src={company.logo.url}
                    alt={company.name}
                    className="object-contain max-h-36"
                  />
                ) : (
                  <div className="text-gray-400">No Logo</div>
                )}
              </div>

              {/* Company Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2">{company.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{company.summary}</p>

                <div className="space-y-2 text-sm text-gray-300">
                  {company.website && (
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                      <Globe className="h-4 w-4" />
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.established && (
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                      <Calendar className="h-4 w-4" />
                      <span>{company.established}</span>
                    </div>
                  )}
                  
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 pt-4`}>
                  <Link
                    href={`/admin/companies/edit/${company._id}`}
                    className={`flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-1 transition-colors`}
                  >
                    <Edit className="h-4 w-4" />
                    <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </Link>
                  {isSuperAdmin() && (
                    <button
                      onClick={() => { setSelectedCompany(company); setShowDeleteModal(true); }}
                      className={`flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-1 transition-colors`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{language === 'ar' ? 'حذف' : 'Delete'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && !loading && (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{language === 'ar' ? 'لا توجد شركات' : 'No companies found'}</h3>
            <p className="text-gray-400 mb-6">{language === 'ar' ? 'حاول تعديل البحث' : 'Try adjusting your search'}</p>
            <Link
              href="/admin/companies/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin?.nav?.addNewCompany || 'Add New Company'}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg border ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-green-500/20 border-green-500/30 text-green-200'}`}>
          {toast.message}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">{language === 'ar' ? 'حذف الشركة' : 'Delete Company'}</h3>
            <p className="text-gray-400 mb-6">
              {language === 'ar' ? 'هل أنت متأكد أنك تريد حذف' : 'Are you sure you want to delete'} &ldquo;{selectedCompany.name}&rdquo;? {language === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}
            </p>
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(selectedCompany._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


