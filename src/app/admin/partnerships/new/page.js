"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createPartnership } from "@/redux/partnershipsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  Award,
  Calendar,
  User,
  Globe,
  FileText,
  Play,
  Link as LinkIcon,
  Target,
  Users,
  Building,
  MapPin,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import Link from "next/link";
import AdminHeader from "@/shared/AdminHeader";

// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 50;

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
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() - 0.5) * 0.5;
        const directionY = (Math.random() - 0.5) * 0.5;
        const color = `rgba(101, 163, 13, ${Math.random() * 0.3 + 0.1})`;

        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => particle.update());
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// Form Components
const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  formik,
  icon,
  required = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">
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
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={`w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d] transition-colors ${
          icon ? "pl-10" : ""
        } ${
          formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
        }`}
      />
    </div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-400 text-sm">{formik.errors[name]}</p>
    )}
  </div>
);

const FormTextarea = ({
  label,
  name,
  placeholder,
  formik,
  required = false,
  rows = 4,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <textarea
      name={name}
      rows={rows}
      placeholder={placeholder}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
      className={`w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d] transition-colors resize-none ${
        formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
      }`}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-400 text-sm">{formik.errors[name]}</p>
    )}
  </div>
);

const FormSelect = ({ label, name, options, formik, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      name={name}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
      className={`w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d] transition-colors ${
        formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-400 text-sm">{formik.errors[name]}</p>
    )}
  </div>
);

const FileUpload = ({ label, name, accept, formik, multiple = false }) => {
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const currentFiles = formik.values[name] || [];
    formik.setFieldValue(name, [...currentFiles, ...files]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentFiles = formik.values[name] || [];
    formik.setFieldValue(name, [...currentFiles, ...files]);
  };

  const removeFile = (index) => {
    const currentFiles = formik.values[name] || [];
    formik.setFieldValue(
      name,
      currentFiles.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="space-y-3">
        <div
          className="relative border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-[#65a30d] transition-colors"
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            id={`file-${name}`}
          />
          <label
            htmlFor={`file-${name}`}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-400 text-center">
              Drag and drop files here, or{" "}
              <span className="text-[#65a30d]">click to browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept} {multiple ? "files" : "file"}
            </p>
          </label>
        </div>

        {/* Display uploaded files */}
        {formik.values[name] && formik.values[name].length > 0 && (
          <div className="space-y-2">
            {formik.values[name].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="space-y-3">
        {(formik.values[name] || []).map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item || ""}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-[#65a30d] hover:bg-[#528000] text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add {label}</span>
        </button>
      </div>
    </div>
  );
};

const DynamicObjectList = ({ label, name, formik, fields, placeholder }) => {
  const addItem = () => {
    const currentItems = formik.values[name] || [];
    const newItem = {};
    fields.forEach((field) => {
      newItem[field.name] = "";
    });
    formik.setFieldValue(name, [...currentItems, newItem]);
  };

  const removeItem = (index) => {
    const currentItems = formik.values[name] || [];
    formik.setFieldValue(
      name,
      currentItems.filter((_, i) => i !== index)
    );
  };

  const updateItem = (index, field, value) => {
    const currentItems = formik.values[name] || [];
    const newItems = [...currentItems];
    newItems[index] = { ...newItems[index], [field]: value };
    formik.setFieldValue(name, newItems);
  };

  const renderField = (field, item, index) => {
    const value = item[field.name] || "";

    // If field has options, render as select
    if (field.options) {
      return (
        <select
          key={field.name}
          value={value}
          onChange={(e) => updateItem(index, field.name, e.target.value)}
          className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
        >
          <option value="">{field.placeholder}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Otherwise render as text input
    return (
      <input
        key={field.name}
        type="text"
        value={value}
        onChange={(e) => updateItem(index, field.name, e.target.value)}
        placeholder={field.placeholder}
        className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="space-y-4">
        {(formik.values[name] || []).map((item, index) => (
          <div
            key={index}
            className="p-4 bg-black/20 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Item {index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((field) => renderField(field, item, index))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-[#65a30d] hover:bg-[#528000] text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add {label}</span>
        </button>
      </div>
    </div>
  );
};

export default function AdminPartnershipForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    summary: Yup.string().required("Summary is required"),
    description: Yup.string().required("Description is required"),
    startDate: Yup.date().required("Start date is required"),
    nextMilestone: Yup.string(),
    status: Yup.string().required("Status is required"),
    priority: Yup.string().required("Priority is required"),
    partnerInformation: Yup.object().shape({
      name: Yup.string().required("Partner name is required"),
      founded: Yup.string(),
      headquarters: Yup.string(),
      employees: Yup.string(),
      specialization: Yup.string(),
      website: Yup.string(),
      ceo: Yup.string(),
      revenue: Yup.string(),
    }),
    partnerLinks: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        url: Yup.string().url("Invalid URL").required("URL is required"),
        type: Yup.string()
          .oneOf(["website", "press", "research", "case-study"], "Invalid type")
          .required("Type is required"),
      })
    ),
    timeline: Yup.array(),
    achievements: Yup.array(),
    attachments: Yup.array(),
    youtubeLinks: Yup.array(),
    image: Yup.array().min(1, "Poster image is required"),
    galleryImages: Yup.array().min(1, "At least one gallery image is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      startDate: "",
      nextMilestone: "",
      status: "",
      priority: "",
      partnerInformation: {
        name: "",
        founded: "",
        headquarters: "",
        employees: "",
        specialization: "",
        website: "",
        ceo: "",
        revenue: "",
      },
      partnerLinks: [],
      timeline: [],
      achievements: [],
      image: [], // poster
      galleryImages: [], // media gallery
      youtubeLinks: [],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      startDate: Yup.date().required("Start date is required"),
      nextMilestone: Yup.string(),
      status: Yup.string().required("Status is required"),
      priority: Yup.string().required("Priority is required"),
      partnerInformation: Yup.object().shape({
        name: Yup.string().required("Partner name is required"),
        founded: Yup.string(),
        headquarters: Yup.string(),
        employees: Yup.string(),
        specialization: Yup.string(),
        website: Yup.string(),
        ceo: Yup.string(),
        revenue: Yup.string(),
      }),
      partnerLinks: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          url: Yup.string().url("Invalid URL").required("URL is required"),
          type: Yup.string()
            .oneOf(
              ["website", "press", "research", "case-study"],
              "Invalid type"
            )
            .required("Type is required"),
        })
      ),
      timeline: Yup.array(),
      achievements: Yup.array(),
      image: Yup.array().min(1, "Poster image is required"),
      galleryImages: Yup.array().min(
        1,
        "At least one gallery image is required"
      ),
      youtubeLinks: Yup.array(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        // Handle single image upload for the poster
        let posterImageData = null;
        if (values.image && values.image.length > 0) {
          const imageUploads = await uploadMultipleFiles(values.image);
          if (imageUploads.length > 0) {
            posterImageData = {
              url: imageUploads[0].url,
              name: imageUploads[0].name || "Partnership Poster",
              type: "image",
              size: imageUploads[0].size || 0,
              uploadedAt: new Date().toISOString(),
            };
          }
        }

        // Handle multiple image uploads for the gallery
        let galleryImageUploads = [];
        if (values.galleryImages && values.galleryImages.length > 0) {
          galleryImageUploads = await uploadMultipleFiles(values.galleryImages);
        }

        const partnershipData = {
          ...values,
          image: posterImageData,
          attachments: galleryImageUploads
            .filter((file) => file && file.url) // Filter out any failed uploads
            .map((file, index) => ({
              type: "image", // All gallery images are treated as 'image'
              url: file.url,
              title: file.name || `Gallery Image ${index + 1}`,
              description: `Gallery image ${index + 1}`,
            })),
        };

        // Remove the temporary fields from the data sent to backend
        delete partnershipData.image; // Remove the file array
        delete partnershipData.galleryImages; // Remove the file array

        await dispatch(createPartnership(partnershipData)).unwrap();
        setSubmitStatus("success");

        // Navigate to partnerships list after successful creation
        setTimeout(() => {
          router.push("/admin/partnerships");
        }, 2000);
      } catch (error) {
        setSubmitStatus("error");
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
      <ParticleBackground />
      <AdminHeader currentPage="Partnerships" />
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Add New Partnership
          </h1>
          <p className="text-xl text-gray-400">
            Create a new partnership entry with all required details and media
          </p>
        </motion.div>
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
                Partnership created successfully!
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
                Error creating partnership. Please try again.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
              <FormInput
                label="Partnership Title"
                name="title"
                placeholder="e.g., GreenTech Solutions Partnership"
                formik={formik}
                icon={<Award className="h-4 w-4" />}
                required
              />
              <FormInput
                label="Next Milestone"
                name="nextMilestone"
                placeholder="e.g., Sub-Saharan Africa Expansion - Q3 2024"
                formik={formik}
                icon={<Target className="h-4 w-4" />}
              />
              <div className="md:col-span-2">
                <FormTextarea
                  label="Summary"
                  name="summary"
                  placeholder="Brief description of the partnership"
                  formik={formik}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <FormTextarea
                  label="Description"
                  name="description"
                  placeholder="Detailed description of the partnership"
                  formik={formik}
                  rows={6}
                  required
                />
              </div>
            </div>
          </div>

          {/* Partnership Details */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Partnership Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Start Date"
                name="startDate"
                type="date"
                formik={formik}
                icon={<Calendar className="h-4 w-4" />}
                required
              />
              <FormSelect
                label="Status"
                name="status"
                formik={formik}
                required
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <FormSelect
                label="Priority"
                name="priority"
                formik={formik}
                required
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </div>
          </div>

          {/* Partner Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Partner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Partner Name"
                name="partnerInformation.name"
                placeholder="e.g., GreenTech Solutions"
                formik={formik}
                icon={<Building className="h-4 w-4" />}
                required
              />
              <FormInput
                label="Founded"
                name="partnerInformation.founded"
                placeholder="e.g., 2015"
                formik={formik}
                icon={<Calendar className="h-4 w-4" />}
              />
              <FormInput
                label="Headquarters"
                name="partnerInformation.headquarters"
                placeholder="e.g., Dubai, UAE"
                formik={formik}
                icon={<MapPin className="h-4 w-4" />}
              />
              <FormInput
                label="Employees"
                name="partnerInformation.employees"
                placeholder="e.g., 250+"
                formik={formik}
                icon={<Users className="h-4 w-4" />}
              />
              <FormInput
                label="Specialization"
                name="partnerInformation.specialization"
                placeholder="e.g., Smart Irrigation & Water Management"
                formik={formik}
                icon={<Target className="h-4 w-4" />}
              />
              <FormInput
                label="Website"
                name="partnerInformation.website"
                placeholder="e.g., https://greentech-solutions.com"
                formik={formik}
                icon={<Globe className="h-4 w-4" />}
              />
              <FormInput
                label="CEO"
                name="partnerInformation.ceo"
                placeholder="e.g., Dr. Ahmad Hassan"
                formik={formik}
                icon={<User className="h-4 w-4" />}
              />
              <FormInput
                label="Revenue"
                name="partnerInformation.revenue"
                placeholder="e.g., $45M (2023)"
                formik={formik}
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Partner Links */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Partner Links
            </h2>
            <DynamicObjectList
              label="Partner Links"
              name="partnerLinks"
              formik={formik}
              fields={[
                { name: "title", placeholder: "Link Title" },
                { name: "url", placeholder: "URL" },
                {
                  name: "type",
                  placeholder: "Type",
                  options: [
                    { value: "website", label: "Website" },
                    { value: "press", label: "Press" },
                    { value: "research", label: "Research" },
                    { value: "case-study", label: "Case Study" },
                  ],
                },
              ]}
            />
          </div>

          {/* Timeline */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Timeline</h2>
            <DynamicObjectList
              label="Timeline Events"
              name="timeline"
              formik={formik}
              fields={[
                { name: "year", placeholder: "Year" },
                { name: "event", placeholder: "Event" },
                { name: "description", placeholder: "Description" },
              ]}
            />
          </div>

          {/* Achievements */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
            <DynamicObjectList
              label="Achievements"
              name="achievements"
              formik={formik}
              fields={[
                { name: "title", placeholder: "Achievement Title" },
                { name: "description", placeholder: "Description" },
              ]}
            />
          </div>

          {/* Media & Links */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Media & Links
            </h2>
            <div className="space-y-6">
              {/* Poster Image (single, required) */}
              <FileUpload
                label="Poster Image (Main Cover, Required)"
                name="image"
                accept="image/*"
                formik={formik}
                multiple={false}
              />
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-400 text-sm">{formik.errors.image}</p>
              )}

              {/* Media Gallery Images (multiple, required) */}
              <FileUpload
                label="Media Gallery Images (Multiple, Required)"
                name="galleryImages"
                accept="image/*"
                formik={formik}
                multiple={true}
              />
              {formik.touched.galleryImages && formik.errors.galleryImages && (
                <p className="text-red-400 text-sm">
                  {formik.errors.galleryImages}
                </p>
              )}

              <DynamicList
                label="YouTube Video Links"
                name="youtubeLinks"
                formik={formik}
                placeholder="https://youtu.be/VIDEO_ID"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-8">
            <Link
              href="/admin/partnerships"
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-[#65a30d] hover:bg-[#528000] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Partnership</span>
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