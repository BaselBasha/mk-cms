"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  FileText,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Globe,
  Link as LinkIcon,
  Image as ImageIcon,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { createPress } from '@/redux/pressSlice';
import { uploadFile } from "@/shared/uploadFile";
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
        let color = "rgba(52, 65, 85, 0.18)"; // blue-gray accent
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
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", // blue-gray gradient
      }}
    />
  );
};

// --- Admin Header Component ---
const AdminHeader = () => {
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">Add New Press Article</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#334155] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-[#334155]/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#334155]" />
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
                      <span className="text-white">Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <LogOut className="h-4 w-4 text-gray-400" />
                      <span className="text-white">Logout</span>
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
          } pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all ${
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
        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all resize-none ${
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

// --- File Upload Component ---
const FileUpload = ({ label, name, accept, formik, multiple = false }) => {
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
            ? "border-[#334155] bg-[#334155]/10"
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
          <div className="w-12 h-12 bg-[#334155]/20 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-[#334155]" />
          </div>
          <p className="text-gray-300 font-medium">
            Drag & drop files here or click to browse
          </p>
          <p className="text-gray-400 text-sm">
            {accept.includes("image") && "Images: JPG, PNG, GIF"}
            {accept.includes("pdf") && "Documents: PDF, DOC, DOCX"}
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
const DynamicList = ({ label, name, formik, placeholder = "Add item..." }) => {
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
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all"
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
          className="flex items-center space-x-2 px-4 py-2 bg-[#334155]/20 hover:bg-[#334155]/30 border border-[#334155]/30 rounded-xl text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add {label}</span>
        </button>
      </div>
    </div>
  );
};

// --- Main Press Form Component ---
export default function AdminPressForm() {
  const dispatch = useDispatch();
  const { loading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.press
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Article title is required"),
    summary: Yup.string().required("Summary is required"),
    content: Yup.string().required("Content is required"),
    author: Yup.string().required("Author is required"),
    publishDate: Yup.date().required("Publish date is required"),
    source: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    image: Yup.mixed(),
    videos: Yup.array(),
    documents: Yup.array(),
  });

  // Form configuration
  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      content: "",
      author: "",
      publishDate: "",
      source: "",
      tags: [],
      image: null,
      videos: [],
      documents: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const imageUploads = await uploadMultipleFiles(
          values.image ? [values.image] : []
        );
        const videoUploads = await uploadMultipleFiles(values.videos);
        const documentUploads = await uploadMultipleFiles(values.documents);

        const pressData = {
          ...values,
          image: imageUploads[0]?.url || null,
          videos: videoUploads.map((f) => f.url),
          documents: documentUploads.map((f) => f.url),
        };

        await dispatch(createPress(pressData)).unwrap();
        setSubmitStatus("success");
        setTimeout(() => {
          formik.resetForm();
          setSubmitStatus(null);
        }, 3000);
      } catch (error) {
        setSubmitStatus("error");
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-transparent text-gray-200 font-sans min-h-screen">
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
            Add New Press Article
          </h1>
          <p className="text-xl text-gray-400">
            Create a new press/news article with all required details and media
          </p>
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
                Article created successfully!
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
                Error creating article. Please try again.
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
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="Article Title"
                  name="title"
                  placeholder="Enter article title"
                  formik={formik}
                  icon={<Newspaper className="h-4 w-4" />}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <FormTextarea
                  label="Summary"
                  name="summary"
                  placeholder="Brief summary of the article"
                  formik={formik}
                  required
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <FormTextarea
                  label="Content"
                  name="content"
                  placeholder="Full article content"
                  formik={formik}
                  required
                  rows={8}
                />
              </div>
            </div>
          </div>
          {/* Article Details */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Article Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Author"
                name="author"
                placeholder="Author name"
                formik={formik}
                icon={<User className="h-4 w-4" />}
                required
              />
              <FormInput
                label="Publish Date"
                name="publishDate"
                type="date"
                formik={formik}
                icon={<Calendar className="h-4 w-4" />}
                required
              />
              <FormInput
                label="Source"
                name="source"
                placeholder="Source or publication"
                formik={formik}
                icon={<Globe className="h-4 w-4" />}
              />
            </div>
          </div>
          {/* Media Attachments */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Media Attachments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="Article Image"
                name="image"
                accept="image/*"
                formik={formik}
                multiple={false}
              />
              <FileUpload
                label="Article Videos"
                name="videos"
                accept="video/*"
                formik={formik}
                multiple
              />
              <FileUpload
                label="Supporting Documents"
                name="documents"
                accept=".pdf,.doc,.docx"
                formik={formik}
                multiple
              />
            </div>
          </div>
          {/* Tags */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Tags</h2>
            <DynamicList
              label="Tags"
              name="tags"
              formik={formik}
              placeholder="e.g., Agriculture, Innovation, Award"
            />
          </div>
          {/* Form Actions */}
          <div className="flex items-center justify-between pt-8">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-[#334155] hover:bg-[#1e293b]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Article</span>
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