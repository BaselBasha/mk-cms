"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPress, deletePress } from "@/redux/pressSlice";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Globe,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { isSuperAdmin } from "@/shared/auth";

export default function AdminPressPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: press, loading, error } = useSelector((state) => state.press);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchPress());
  }, [dispatch]);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await dispatch(deletePress(id)).unwrap();
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPress = press.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.publication.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["news", "interview", "feature", "review", "announcement"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
        <AdminHeader currentPage={t.admin.press.pageTitle} />
        <div className="container mx-auto px-6 py-8 mt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#65a30d] border-t-transparent"></div>
            <span className="ml-3 text-white">{t.admin.press.loading}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage={t.admin.press.pageTitle} />
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{t.admin.press.management}</h1>
              <p className="text-xl text-gray-400">
                {t.admin.press.subtitle}
              </p>
            </div>
            <Link
              href="/admin/press/new"
              className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#84cc16] text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.press.addArticle}</span>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t.admin.press.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
          >
            <option value="">{t.admin.press.allCategories}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {t.admin.press.categories[category]}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPress.map((article) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                {/* Article Image */}
                {article.image && article.image.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image[0]}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {article.isActive ? t.admin.press.status.active : t.admin.press.status.inactive}
                    </span>
                    <span className="px-3 py-1 bg-[#65a30d]/20 text-[#65a30d] rounded-full text-xs font-medium">
                      {t.admin.press.categories[article.category] || article.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  {/* Article Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{t.admin.press.author}: {article.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Globe className="h-4 w-4" />
                      <span>{t.admin.press.publication}: {article.publication}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t.admin.press.publishDate}: {new Date(article.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/press/edit/${article._id}`}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-sm">{t.admin.press.edit}</span>
                      </Link>
                      {isSuperAdmin() && (
                        <button
                          onClick={() => setDeleteId(article._id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm">{t.admin.press.delete}</span>
                        </button>
                      )}
                    </div>
                    <Link
                      href={`/press/${article._id}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{t.admin.press.view}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPress.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              {searchTerm || filterCategory ? t.admin.press.noArticlesFound : t.admin.press.noArticlesYet}
            </div>
            {!searchTerm && !filterCategory && (
              <Link
                href="/admin/press/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#84cc16] text-white rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{t.admin.press.addFirstArticle}</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">{t.admin.press.confirmDelete}</h3>
              </div>
              <p className="text-gray-300 mb-6">
                {t.admin.press.deleteConfirm}
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {t.admin.press.cancel}
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>{t.admin.press.deleting}</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>{t.admin.press.confirmDeleteButton}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 