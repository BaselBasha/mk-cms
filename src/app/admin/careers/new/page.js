"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "@/shared/AdminHeader";
import {
  Plus,
  X,
  Upload,
  FileText,
  Building,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Check,
  Star,
  Briefcase,
  ArrowLeft,
  LogOut,
  User,
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
  Shield,
  Globe,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ENDPOINTS } from "@/shared/endpoints";
import {
  createCareer,
  selectCareersLoading,
  selectCareersError,
  selectCareersSuccess,
  clearError,
  clearSuccess,
} from "@/redux/careersSlice";
import { uploadFile } from "@/shared/uploadFile";

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
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${hasError
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
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 resize-none ${hasError
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
const FormSelect = ({ label, name, options, formik, required = false }) => {
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
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white focus:outline-none transition-all duration-300 appearance-none ${hasError
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : isFocused
                ? "border-[#65a30d] focus:ring-2 focus:ring-[#65a30d]"
                : "border-white/10 hover:border-white/20"
            }`}
        >
          <option value="">Select {label}</option>
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
const FileUpload = ({ label, name, accept, formik, multiple = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedFile = await uploadFile(file);
        uploadedFiles.push(uploadedFile);

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      if (multiple) {
        formik.setFieldValue(name, [...(formik.values[name] || []), ...uploadedFiles]);
      } else {
        formik.setFieldValue(name, uploadedFiles[0]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${isDragOver
            ? "border-[#65a30d] bg-opacity-10 bg-[#65a30d]"
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
            {isDragOver ? "Drop files here" : "Click or drag files to upload"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept ? `Accepted formats: ${accept}` : "All file types accepted"}
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
    const currentItems = [...formik.values[name]];
    currentItems.splice(index, 1);
    formik.setFieldValue(name, currentItems);
  };

  const updateItem = (index, value) => {
    const currentItems = [...formik.values[name]];
    currentItems[index] = value;
    formik.setFieldValue(name, currentItems);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Plus className="w-4 h-4" />
        <span>{label}</span>
      </label>

      <div className="space-y-2">
        {(formik.values[name] || []).map((item, index) => (
          <div key={`${name}-${index}`} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
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
          <span>Add {label}</span>
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function AdminCareerForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux selectors
  const loading = useSelector(selectCareersLoading);
  const error = useSelector(selectCareersError);
  const success = useSelector(selectCareersSuccess);

  // Clear error and success messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        router.push('/admin/careers');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, router]);

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${ENDPOINTS.BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      url: result.url,
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      requirements: [],
      responsibilities: [],
      benefits: [],
      salary: {
        min: "",
        max: "",
        currency: "USD"
      },
      isActive: true,
      applicationDeadline: "",
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      department: Yup.string().required("Department is required"),
      location: Yup.string().required("Location is required"),
      type: Yup.string().required("Job type is required"),
      experience: Yup.string().required("Experience level is required"),
      requirements: Yup.array().min(1, "At least one requirement is required"),
      responsibilities: Yup.array().min(1, "At least one responsibility is required"),
      benefits: Yup.array().min(1, "At least one benefit is required"),
      salary: Yup.object({
        min: Yup.number().min(0, "Minimum salary must be positive"),
        max: Yup.number().min(0, "Maximum salary must be positive"),
        currency: Yup.string().required("Currency is required")
      }),
      applicationDeadline: Yup.date().required("Application deadline is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = {
          ...values,
          applicationDeadline: new Date(values.applicationDeadline).toISOString(),
          salary: {
            ...values.salary,
            min: parseFloat(values.salary.min) || 0,
            max: parseFloat(values.salary.max) || 0,
          }
        };

        await dispatch(createCareer(formData)).unwrap();
        formik.resetForm();
      } catch (error) {
        console.error('Submission failed:', error);
      }
    },
  });

  const departmentOptions = [
    "Engineering",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "HR",
    "IT",
    "Research & Development",
    "Quality Assurance",
    "Supply Chain"
  ];

  const typeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote"
  ];

  const experienceOptions = [
    "Entry Level",
    "Junior",
    "Mid Level",
    "Senior",
    "Executive"
  ];

  const currencyOptions = [
    "USD",
    "EUR",
    "GBP",
    "EGP"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
      <ParticleBackground />
      <AdminHeader currentPage="Careers" />

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
                Create New Job Position
              </h1>
              <p className="text-xl text-gray-400">
                Add a new career opportunity to the platform
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Status */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${success
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
          >
            {success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Job position created successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Failed to create job position. Please try again.</span>
              </>
            )}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <FormInput
                label="Job Title"
                name="title"
                placeholder="Enter job title"
                formik={formik}
                icon={<Briefcase className="w-4 h-4" />}
                required
              />

              <FormTextarea
                label="Summary"
                name="summary"
                placeholder="Brief description of the position"
                formik={formik}
                required
                rows={3}
              />

              <FormSelect
                label="Department"
                name="department"
                options={departmentOptions}
                formik={formik}
                required
              />

              <FormInput
                label="Location"
                name="location"
                placeholder="Job location"
                formik={formik}
                icon={<MapPin className="w-4 h-4" />}
                required
              />

              <FormSelect
                label="Job Type"
                name="type"
                options={typeOptions}
                formik={formik}
                required
              />

              <FormSelect
                label="Experience Level"
                name="experience"
                options={experienceOptions}
                formik={formik}
                required
              />

              <FormInput
                label="Application Deadline"
                name="applicationDeadline"
                type="date"
                formik={formik}
                icon={<Calendar className="w-4 h-4" />}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormTextarea
                label="Description"
                name="description"
                placeholder="Detailed job description"
                formik={formik}
                required
                rows={6}
              />

              <DynamicList
                label="Requirements"
                name="requirements"
                formik={formik}
                placeholder="Add a requirement..."
              />

              <DynamicList
                label="Responsibilities"
                name="responsibilities"
                formik={formik}
                placeholder="Add a responsibility..."
              />

              <DynamicList
                label="Benefits"
                name="benefits"
                formik={formik}
                placeholder="Add a benefit..."
              />

              {/* Salary Range */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span>Salary Range</span>
                </label>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      name="salary.min"
                      placeholder="Min"
                      value={formik.values.salary.min}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="salary.max"
                      placeholder="Max"
                      value={formik.values.salary.max}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <select
                      name="salary.currency"
                      value={formik.values.salary.currency}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <FileUpload
                label="Job Image"
                name="image"
                accept="image/*"
                formik={formik}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-lg hover:bg-[#84cc16] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Job Position</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
} 