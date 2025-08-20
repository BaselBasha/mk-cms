"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  FileText,
  Image,
  Video,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  Eye,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '@/redux/projectsSlice';
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";

// --- Particle Background Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;

    let particlesArray = [];
    const numberOfParticles = 50;

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
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.2 - 0.1;
        let directionY = Math.random() * 0.2 - 0.1;
        let color = "rgba(101, 163, 13, 0.2)";
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      init();
    };

    init();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background:
          "linear-gradient(135deg, #0f1419 0%, #1a2d27 50%, #0f1419 100%)",
      }}
    />
  );
};

// --- Admin Header Component ---
const AdminHeader = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-4">
              <img
                src="/MK-GROUP.png"
                alt="MK Group Logo"
                className="h-10 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">
                  {t.admin.header.title}
                </h1>
                <p className="text-sm text-gray-400">{t.admin.projects.addNewProject}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#65a30d] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t.admin.actions.back}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#65a30d]" />
                </div>
                <span className="text-white font-medium hidden sm:block">
                  Admin
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2"
                  >
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{t.admin.header.settings}</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <LogOut className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{t.admin.header.logout}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Form Input Component ---
const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  formik,
  icon,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all ${
            formik.touched[name] && formik.errors[name]
              ? "border-red-500"
              : "border-white/10 hover:border-white/20"
          }`}
        />
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm flex items-center"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {formik.errors[name]}
        </motion.p>
      )}
    </div>
  );
};

// --- Form Textarea Component ---
const FormTextarea = ({
  label,
  name,
  placeholder,
  formik,
  required = false,
  rows = 4,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all resize-none ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10 hover:border-white/20"
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm flex items-center"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {formik.errors[name]}
        </motion.p>
      )}
    </div>
  );
};

// --- Form Select Component ---
const FormSelect = ({ label, name, options, formik, required = false, t }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <option value="" className="bg-gray-800">
          {t.admin.form.required.replace('This field is required', `Select ${label}`)}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-gray-800"
          >
            {option.label}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm flex items-center"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {formik.errors[name]}
        </motion.p>
      )}
    </div>
  );
};

// --- File Upload Component ---
const FileUpload = ({ label, name, accept, formik, multiple = false, t }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      formik.setFieldValue(name, multiple ? files : files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      formik.setFieldValue(name, multiple ? files : files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? "border-[#65a30d] bg-[#65a30d]/10"
            : "border-white/20 hover:border-white/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#65a30d]/20 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-[#65a30d]" />
          </div>
          <p className="text-gray-300 font-medium">
            {t.admin.form.dragDropFiles}
          </p>
          <p className="text-gray-400 text-sm">
            {accept.includes("image") && t.admin.form.imageTypes}
            {accept.includes("video") && t.admin.form.videoTypes}
            {accept.includes("pdf") && t.admin.form.documentTypes}
          </p>
        </div>
      </div>

      {formik.values[name] && (
        <div className="mt-2">
          {multiple ? (
            <div className="space-y-2">
              {formik.values[name].map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-2"
                >
                  <span className="text-white text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = formik.values[name].filter(
                        (_, i) => i !== index
                      );
                      formik.setFieldValue(name, newFiles);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <span className="text-white text-sm">
                {formik.values[name].name}
              </span>
              <button
                type="button"
                onClick={() => formik.setFieldValue(name, null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Dynamic List Component ---
const DynamicList = ({ label, name, formik, placeholder = "Add item...", t }) => {
  const addItem = () => {
    const currentItems = formik.values[name] || [];
    formik.setFieldValue(name, [...currentItems, ""]);
  };

  const removeItem = (index) => {
    const currentItems = formik.values[name] || [];
    formik.setFieldValue(
      name,
      currentItems.filter((_, i) => i !== index)
    );
  };

  const updateItem = (index, value) => {
    const currentItems = formik.values[name] || [];
    const newItems = [...currentItems];
    newItems[index] = value;
    formik.setFieldValue(name, newItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="space-y-2">
        {(formik.values[name] || []).map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-[#65a30d]/20 hover:bg-[#65a30d]/30 border border-[#65a30d]/30 rounded-xl text-[#65a30d] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t.admin.form.addItem.replace('{item}', label)}</span>
        </button>
      </div>
    </div>
  );
};

// --- Main Project Form Component ---
export default function AdminProjectForm() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [formLang, setFormLang] = useState(language);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.projects
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Project title is required"),
    summary: Yup.string().required("Project summary is required"),
    description: Yup.string().required("Project description is required"),
    budget: Yup.string(),
    location: Yup.string().required("Project location is required"),
    area: Yup.string().required("Project area is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
    status: Yup.string().required("Project status is required"),
    priority: Yup.string(),
    successPartner: Yup.string(),
  });

  // Form configuration
  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      budget: "",
      location: "",
      area: "",
      startDate: "",
      endDate: "",
      status: "",
      priority: "",
      successPartner: "",
      youtubeLinks: [],
      images: [],
      documents: [],
      keyMetrics: [],
      awards: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log('[UI][Projects] Submitting with lang:', formLang);
        try { console.log('[UI][Projects] Raw values:', JSON.stringify(values)); } catch (_) {}
        const imageUploads = await uploadMultipleFiles(values.images);
        const documentUploads = await uploadMultipleFiles(values.documents);
        
        console.log('[UI][Projects] Image uploads:', imageUploads);
        console.log('[UI][Projects] Document uploads:', documentUploads);

        // Map enums if saving in Arabic to satisfy Project-ar schema
        let mappedStatus = values.status;
        let mappedPriority = values.priority;
        if (formLang === 'ar') {
          const statusMap = {
            'planning': 'تخطيط',
            'in-progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'on-hold': 'معلق',
            'cancelled': 'ملغي',
          };
          const priorityMap = {
            'low': 'منخفض',
            'medium': 'متوسط',
            'high': 'عالي',
            'urgent': 'عاجل',
          };
          mappedStatus = statusMap[values.status] || values.status;
          mappedPriority = priorityMap[values.priority] || values.priority;
        }

        const projectData = {
          ...values,
          status: mappedStatus,
          priority: mappedPriority,
          images: imageUploads,
          documents: documentUploads,
        };

        try { console.log('[UI][Projects] Final payload:', JSON.stringify(projectData)); } catch (_) {}
        await dispatch(createProject({ data: projectData, lang: formLang })).unwrap();
        setSubmitStatus("success");
        setTimeout(() => {
          formik.resetForm();
          router.push('/admin/projects');
        }, 2000);
      } catch (error) {
        setSubmitStatus("error");
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const statusOptions = [
    { value: "planning", label: t.admin.projects.status.planning },
    { value: "in-progress", label: t.admin.projects.status.inProgress },
    { value: "completed", label: t.admin.projects.status.completed },
    { value: "on-hold", label: t.admin.projects.status.onHold },
    { value: "cancelled", label: t.admin.projects.status.cancelled },
  ];

  const priorityOptions = [
    { value: "low", label: t.admin.projects.priority.low },
    { value: "medium", label: t.admin.projects.priority.medium },
    { value: "high", label: t.admin.projects.priority.high },
    { value: "urgent", label: t.admin.projects.priority.urgent },
  ];

  return (
    <div 
      className="bg-transparent text-gray-200 font-sans min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {t.admin.projects.addNewProject}
          </h1>
          <p className="text-xl text-gray-400">
            {t.admin.form.briefOverview}
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <label className="text-sm text-gray-300">Language</label>
            <select
              value={formLang}
              onChange={(e) => setFormLang(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center"
            >
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <span className="text-green-400">
                {t.admin.form.projectCreated}
              </span>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center"
            >
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-400">
                {t.admin.form.errorCreating}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  onSubmit={formik.handleSubmit}
  className="space-y-8"
>
  {/* Basic Information */}
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-white mb-6">
      {t.admin.form.basicInformation}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <FormInput
          label={t.admin.form.projectTitle}
          name="title"
          placeholder={t.admin.form.enterProjectTitle}
          formik={formik}
          icon={<FileText className="h-4 w-4" />}
          required
        />
      </div>
      <div className="md:col-span-2">
        <FormTextarea
          label={t.admin.form.projectSummary}
          name="summary"
          placeholder={t.admin.form.briefOverview}
          formik={formik}
          required
          rows={3}
        />
      </div>
      <div className="md:col-span-2">
        <FormTextarea
          label={t.admin.form.projectDescription}
          name="description"
          placeholder={t.admin.form.detailedDescription}
          formik={formik}
          required
          rows={6}
        />
      </div>
    </div>
  </div>

  {/* Project Details */}
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-white mb-6">
      {t.admin.form.projectDetails}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        label={t.admin.form.budget}
        name="budget"
        placeholder={t.admin.form.budgetExample}
        formik={formik}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <FormInput
        label={t.admin.form.location}
        name="location"
        placeholder={t.admin.form.projectLocation}
        formik={formik}
        icon={<MapPin className="h-4 w-4" />}
        required
      />
      <FormInput
        label={t.admin.form.areaCoverage}
        name="area"
        placeholder={t.admin.form.areaExample}
        formik={formik}
        required
      />
      <FormInput
        label={t.admin.form.successPartner}
        name="successPartner"
        placeholder={t.admin.form.partnerOrganization}
        formik={formik}
        icon={<Users className="h-4 w-4" />}
      />
      <DynamicList
        label={t.admin.form.youtubeVideoLinks}
        name="youtubeLinks"
        formik={formik}
        placeholder={t.admin.form.videoLinkExample}
        t={t}
      />
      <FormInput
        label={t.admin.form.startDate}
        name="startDate"
        type="date"
        formik={formik}
        icon={<Calendar className="h-4 w-4" />}
        required
      />
      <FormInput
        label={t.admin.form.endDate}
        name="endDate"
        type="date"
        formik={formik}
        icon={<Calendar className="h-4 w-4" />}
        required
      />
      <FormSelect
        label={t.admin.form.status}
        name="status"
        options={statusOptions}
        formik={formik}
        required
        t={t}
      />
      <FormSelect
        label={t.admin.form.priority}
        name="priority"
        options={priorityOptions}
        formik={formik}
        required
        t={t}
      />
    </div>
  </div>

  {/* Media Attachments */}
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-white mb-6">
      {t.admin.form.mediaAttachments}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUpload
        label={t.admin.form.projectImages}
        name="images"
        accept="image/*"
        formik={formik}
        multiple
        t={t}
      />
      <FileUpload
        label={t.admin.form.projectDocuments}
        name="documents"
        accept=".pdf,.doc,.docx"
        formik={formik}
        multiple
        t={t}
      />
    </div>
  </div>

  {/* Key Metrics */}
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-white mb-6">
      {t.admin.form.keyMetrics}
    </h2>
    <DynamicList
      label={t.admin.form.keyMetrics}
      name="keyMetrics"
      formik={formik}
      placeholder={t.admin.form.metricsExample}
      t={t}
    />
  </div>

  {/* Awards */}
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
    <h2 className="text-2xl font-bold text-white mb-6">
      {t.admin.form.awardsRecognition}
    </h2>
    <DynamicList
      label={t.admin.form.awards}
      name="awards"
      formik={formik}
      placeholder={t.admin.form.awardsExample}
      t={t}
    />
  </div>

  {/* Form Actions */}
  <div className="flex items-center justify-between pt-8">
    <Link
      href="/admin"
      className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
    >
      <X className="h-4 w-4" />
      <span>{t.admin.form.cancel}</span>
    </Link>

    <div className="flex items-center space-x-4">
      <button
        type="button"
        className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
      >
        <Eye className="h-4 w-4" />
        <span>{t.admin.form.preview}</span>
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center space-x-2 px-8 py-3 bg-[#65a30d] hover:bg-[#65a30d]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            <span>{t.admin.form.saving}</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{t.admin.form.saveProject}</span>
          </>
        )}
      </button>
    </div>
  </div>
</motion.form>


      </div>
    </div>
  );
}