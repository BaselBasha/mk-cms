"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, deleteProject } from "@/redux/projectsSlice";
import { Edit, Trash2, Eye, Plus, Search, Filter, Calendar, MapPin, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { isSuperAdmin } from "@/shared/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AdminProjectsPage() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const dispatch = useDispatch();
  const { items: projects, loading, error } = useSelector((state) => state.projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, language]); // Add language dependency

  const handleDelete = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesPriority = !priorityFilter || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      'completed': 'bg-green-500',
      'on-hold': 'bg-orange-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-orange-500',
      'urgent': 'bg-red-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.projects.loadingProjects}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage={t.admin.projects.pageTitle} />
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>
      
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10 mt-20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t.admin.projects.pageTitle}</h1>
              <p className="text-gray-400">{t.admin.projects.subtitle}</p>
            </div>
            <Link
              href="/admin/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.projects.addNewProject}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t.admin.projects.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">{t.admin.projects.allStatus}</option>
              <option value="planning">{t.admin.projects.status.planning}</option>
              <option value="in-progress">{t.admin.projects.status.inProgress}</option>
              <option value="completed">{t.admin.projects.status.completed}</option>
              <option value="on-hold">{t.admin.projects.status.onHold}</option>
              <option value="cancelled">{t.admin.projects.status.cancelled}</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">{t.admin.projects.allPriority}</option>
              <option value="low">{t.admin.projects.priority.low}</option>
              <option value="medium">{t.admin.projects.priority.medium}</option>
              <option value="high">{t.admin.projects.priority.high}</option>
              <option value="urgent">{t.admin.projects.priority.urgent}</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-gray-400">
              <span>{filteredProjects.length} {t.admin.projects.resultsCount} {projects?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={typeof project.images[0] === 'string' ? project.images[0] : project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">{t.admin.projects.noImage}</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Priority Badge */}
                {project.priority && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{project.summary}</p>

                {/* Project Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{t.admin.projects.location}: {project.location}</span>
                  </div>
                  
                  {project.budget && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <DollarSign className="h-4 w-4" />
                      <span>{t.admin.projects.budget}: {project.budget}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{t.admin.projects.startDate}: {new Date(project.startDate).toLocaleDateString()} - {t.admin.projects.endDate}: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4">
                  <Link
                    href={`/projects/${project._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t.admin.projects.view}</span>
                  </Link>
                  
                  <Link
                    href={`/admin/projects/edit/${project._id}`}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{t.admin.projects.edit}</span>
                  </Link>
                  
                  {isSuperAdmin() && (
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t.admin.projects.delete}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.admin.projects.noProjectsFound}</h3>
            <p className="text-gray-400 mb-6">{t.admin.projects.noProjectsSubtitle}</p>
            <Link
              href="/admin/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t.admin.projects.addFirstProject}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">{t.admin.projects.deleteProject}</h3>
            <p className="text-gray-400 mb-6">
              {t.admin.projects.deleteConfirmation} &ldquo;{selectedProject.title}&rdquo;? {t.admin.projects.deleteWarning}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {t.admin.projects.cancel}
              </button>
              <button
                onClick={() => handleDelete(selectedProject._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.admin.projects.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 