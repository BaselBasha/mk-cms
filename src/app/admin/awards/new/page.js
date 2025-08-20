"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  FileText,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Shield,
  Globe,
  Trophy,
  Star,
  Building,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { createAward } from '@/redux/awardsSlice';
import { ENDPOINTS } from "@/shared/endpoints";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";

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
    const numberOfParticles = 60;

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
        let color = "rgba(200, 164, 100, 0.2)";
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
        background: "linear-gradient(135deg, #1a2d27 0%, #33413d 100%)",
      }}
    />
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
  const [isFocused, setIsFocused] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        {icon && icon}
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setIsFocused(true)}
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
            hasError
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : isFocused
              ? "border-[#65a30d] focus:ring-2 focus:ring-[#65a30d]"
              : "border-white/10 hover:border-white/20"
          }`}
        />
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{formik.errors[name]}</span>
        </p>
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
  const [isFocused, setIsFocused] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <FileText className="w-4 h-4" />
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <textarea
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setIsFocused(true)}
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 resize-none ${
            hasError
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : isFocused
              ? "border-[#65a30d] focus:ring-2 focus:ring-[#65a30d]"
              : "border-white/10 hover:border-white/20"
          }`}
        />
        {hasError && (
          <div className="absolute right-3 top-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{formik.errors[name]}</span>
        </p>
      )}
    </div>
  );
};

// --- Form Select Component ---
const FormSelect = ({ label, name, options, formik, required = false, t }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Shield className="w-4 h-4" />
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setIsFocused(true)}
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white focus:outline-none transition-all duration-300 appearance-none ${
            hasError
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : isFocused
              ? "border-[#65a30d] focus:ring-2 focus:ring-[#65a30d]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <option value="">{t.admin.form.required.replace('This field is required', `Select ${label}`)}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hasError && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{formik.errors[name]}</span>
        </p>
      )}
    </div>
  );
};

// --- File Upload Component ---
const FileUpload = ({ label, name, accept, formik, multiple = false, required = false, t }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (multiple) {
      formik.setFieldValue(name, [...(formik.values[name] || []), ...files]);
    } else {
      formik.setFieldValue(name, files[0]);
    }
  };

  const removeFile = (index) => {
    if (multiple) {
      const files = [...formik.values[name]];
      files.splice(index, 1);
      formik.setFieldValue(name, files);
    } else {
      formik.setFieldValue(name, null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Upload className="w-4 h-4" />
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          hasError
            ? "border-red-500 bg-red-500/10"
            : isDragOver
            ? "border-[#65a30d] bg-[#65a30d]/10"
            : "border-white/20 hover:border-white/40"
        }`}
        onDragOver={handleDrag}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-400">
            {t.admin.form.dragDropFiles}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept.includes("image") && t.admin.form.imageTypes}
            {accept.includes("pdf") && t.admin.form.documentTypes}
          </p>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#65a30d] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-300">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Display uploaded files */}
      {formik.values[name] && (
        <div className="space-y-2">
          {multiple ? (
            formik.values[name].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{formik.values[name].name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile()}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {hasError && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{formik.errors[name]}</span>
        </p>
      )}
    </div>
  );
};

// --- Dynamic List Component ---
const DynamicList = ({ label, name, formik, placeholder = "Add item...", t }) => {
  const hasError = formik.touched[name] && formik.errors[name];

  const addItem = () => {
    const currentItems = formik.values[name] || [];
    formik.setFieldValue(name, [...currentItems, ""]);
  };

  const removeItem = (index) => {
    const currentItems = [...(formik.values[name] || [])];
    currentItems.splice(index, 1);
    // Ensure we always have at least one item
    if (currentItems.length === 0) {
      currentItems.push("");
    }
    formik.setFieldValue(name, currentItems);
  };

  const updateItem = (index, value) => {
    const currentItems = [...(formik.values[name] || [])];
    currentItems[index] = value;
    formik.setFieldValue(name, currentItems);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Plus className="w-4 h-4" />
        <span>{label}</span>
        <span className="text-red-400">*</span>
      </label>
      
      <div className="space-y-2">
        {(formik.values[name] || []).map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className={`flex-1 px-3 py-2 bg-black/20 backdrop-blur-md border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300 ${
                hasError ? "border-red-500" : "border-white/10"
              }`}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.awardForm.addItem.replace('{item}', label)}</span>
        </button>
      </div>
      
      {hasError && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{formik.errors[name]}</span>
        </p>
      )}
    </div>
  );
};

// --- Main Component ---
export default function AdminAwardForm() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [formLang, setFormLang] = useState(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();


  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      awardingBody: "",
      awardDate: "",
      category: "",
      level: "",
      features: [""], // Initialize with one empty feature
      image: null,
      documents: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      awardingBody: Yup.string().required("Awarding body is required"),
      awardDate: Yup.date().required("Award date is required"),
      category: Yup.string().required("Category is required"),
      level: Yup.string().required("Level is required"),
      features: Yup.array().of(Yup.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
      image: Yup.mixed().nullable().test('is-file-or-object', 'Award image must be a valid file or object', function(value) {
        // Allow null, File objects, or objects with url property
        if (!value) return true; // Allow null/undefined
        return value instanceof File || (value && typeof value === 'object' && value.url);
      }),
    }),
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      console.log('Form errors:', formik.errors);
      console.log('Form touched:', formik.touched);
      
      // Validate all fields
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        // Filter out empty features
        const filteredFeatures = values.features.filter(feature => feature.trim() !== "");
        
        if (filteredFeatures.length === 0) {
          console.log('No valid features found');
          setSubmitStatus('error');
          return;
        }

        // Upload image if provided
        let imageData = null;
        if (values.image && values.image instanceof File) {
          const imageUploads = await uploadMultipleFiles([values.image]);
          if (imageUploads[0]) {
            imageData = {
              url: imageUploads[0].url,
              name: imageUploads[0].name || "Award Image",
              type: imageUploads[0].type || "image",
              size: imageUploads[0].size || 0
            };
          }
        } else if (values.image && typeof values.image === 'object' && values.image.url) {
          // If image is already an object with url (from previous upload)
          imageData = values.image;
        }

        // Upload documents if provided
        let documentsData = [];
        if (values.documents && values.documents.length > 0) {
          const documentUploads = await uploadMultipleFiles(values.documents);
          documentsData = documentUploads.map((doc) => ({
            url: doc.url,
            name: doc.name || "Document",
            type: doc.type || "document",
            size: doc.size || 0
          }));
        }

        const awardData = {
          title: values.title,
          summary: values.summary,
          description: values.description,
          awardingBody: values.awardingBody,
          awardDate: new Date(values.awardDate).toISOString(),
          category: values.category,
          level: values.level,
          features: filteredFeatures,
          image: imageData,
          documents: documentsData,
        };

        console.log('Submitting award data:', awardData);

        await dispatch(createAward({ data: awardData, lang: formLang })).unwrap();
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/admin/awards');
        }, 2000);
      } catch (error) {
        console.error('Submission failed:', error);
        if (error.message) {
          console.error('Error message:', error.message);
        }
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const categoryOptions = [
    t.admin.awardForm.categories.excellence,
    t.admin.awardForm.categories.innovation,
    t.admin.awardForm.categories.quality,
    t.admin.awardForm.categories.sustainability,
    t.admin.awardForm.categories.leadership,
    t.admin.awardForm.categories.industryRecognition
  ];

  const levelOptions = [
    t.admin.awardForm.levels.local,
    t.admin.awardForm.levels.national,
    t.admin.awardForm.levels.regional,
    t.admin.awardForm.levels.international,
    t.admin.awardForm.levels.global
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader currentPage={t.admin.awards.pageTitle} />

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
                {t.admin.awards.addNewAward}
              </h1>
              <p className="text-xl text-gray-400">
                {t.admin.form.briefOverview}
              </p>
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
        </motion.div>

        {/* Submit Status */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                submitStatus === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{t.admin.awardForm.awardCreated}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>{t.admin.awardForm.errorCreating}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Debug Validation Errors */}
        {process.env.NODE_ENV === 'development' && Object.keys(formik.errors).length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold mb-2">Validation Errors (Debug):</h3>
            <ul className="space-y-1">
              {Object.entries(formik.errors).map(([field, error]) => (
                <li key={field} className="text-sm">
                  <strong>{field}:</strong> {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <FormInput
                label={t.admin.awardForm.awardTitle}
                name="title"
                placeholder={t.admin.awardForm.titlePlaceholder}
                formik={formik}
                icon={<Trophy className="w-4 h-4" />}
                required
              />

              <FormTextarea
                label={t.admin.awardForm.summary}
                name="summary"
                placeholder={t.admin.awardForm.summaryPlaceholder}
                formik={formik}
                required
                rows={3}
              />

              <FormInput
                label={t.admin.awardForm.awardingBody}
                name="awardingBody"
                placeholder={t.admin.awardForm.awardingBodyPlaceholder}
                formik={formik}
                icon={<Building className="w-4 h-4" />}
                required
              />

              <FormInput
                label={t.admin.awardForm.awardDate}
                name="awardDate"
                type="date"
                formik={formik}
                icon={<Calendar className="w-4 h-4" />}
                required
              />

              <FormSelect
                label={t.admin.awardForm.category}
                name="category"
                options={categoryOptions}
                formik={formik}
                required
                t={t}
              />

              <FormSelect
                label={t.admin.awardForm.level}
                name="level"
                options={levelOptions}
                formik={formik}
                required
                t={t}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormTextarea
                label={t.admin.awardForm.description}
                name="description"
                placeholder={t.admin.awardForm.descriptionPlaceholder}
                formik={formik}
                required
                rows={6}
              />

              <DynamicList
                label={t.admin.awardForm.keyFeatures}
                name="features"
                formik={formik}
                placeholder={t.admin.awardForm.featuresPlaceholder}
                t={t}
              />

              <FileUpload
                label={t.admin.awardForm.awardImage}
                name="image"
                accept="image/*"
                formik={formik}
                t={t}
              />

              <FileUpload
                label={t.admin.awardForm.supportingDocuments}
                name="documents"
                accept=".pdf,.doc,.docx"
                formik={formik}
                multiple
                t={t}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                // Mark all fields as touched to trigger validation
                const touchedFields = {};
                Object.keys(formik.values).forEach(key => {
                  touchedFields[key] = true;
                });
                formik.setTouched(touchedFields);
              }}
              className="flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-lg hover:bg-[#84cc16] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.admin.awardForm.creating}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.admin.awardForm.createAward}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
} 