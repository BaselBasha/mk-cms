"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createCertification } from "@/redux/certificationsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
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
} from "lucide-react";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import Link from "next/link";

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

const FormSelect = ({ label, name, options, formik, required = false, t }) => (
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
      <option value="">{t.admin.form.required.replace('This field is required', `Select ${label}`)}</option>
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

const FileUpload = ({ label, name, accept, formik, multiple = false, t }) => {
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const removeFile = (index) => {
    const currentFiles = formik.values[name] || [];
    if (multiple) {
      formik.setFieldValue(
        name,
        currentFiles.filter((_, i) => i !== index)
      );
    } else {
      formik.setFieldValue(name, null);
    }
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
              {t.admin.form.dragDropFiles}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.includes("image") && t.admin.form.imageTypes}
              {accept.includes("pdf") && t.admin.form.documentTypes}
            </p>
          </label>
        </div>

        {/* Display uploaded files */}
        {formik.values[name] && (
          <div className="space-y-2">
            {multiple ? (
              formik.values[name].map((file, index) => (
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
              ))
            ) : (
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm">
                      {formik.values[name].name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {(formik.values[name].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile()}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
          <span>{t.admin.certificationForm.addItem.replace('{item}', label)}</span>
        </button>
      </div>
    </div>
  );
};

export default function AdminCertificationForm() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string().required(t.admin.form.required),
    summary: Yup.string().required(t.admin.form.required),
    description: Yup.string().required(t.admin.form.required),
    issuingBody: Yup.string().required(t.admin.form.required),
    issueDate: Yup.date().required(t.admin.form.required),
    validUntil: Yup.date().required(t.admin.form.required),
    category: Yup.string().required(t.admin.form.required),
    priority: Yup.string().required(t.admin.form.required),
    status: Yup.string().required(t.admin.form.required),
    image: Yup.mixed(),
    documents: Yup.array(),
    features: Yup.array(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      issuingBody: "",
      issueDate: "",
      validUntil: "",
      category: "",
      priority: "",
      status: "",
      image: null,
      documents: [],
      features: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const imageUploads = await uploadMultipleFiles(
          values.image ? [values.image] : []
        );
        const documentUploads = await uploadMultipleFiles(values.documents);

        const certificationData = {
          ...values,
          image: imageUploads[0]
            ? {
                url: imageUploads[0].url,
                name: imageUploads[0].name || "Certification Image",
                type: imageUploads[0].type || "image",
                size: imageUploads[0].size || 0,
              }
            : null,
          documents: documentUploads.map((doc) => ({
            url: doc.url,
            name: doc.name || "Document",
            type: doc.type || "document",
            size: doc.size || 0,
          })),
        };

        await dispatch(createCertification(certificationData)).unwrap();
        setSubmitStatus("success");
        setTimeout(() => {
          router.push("/admin/certifications");
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
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <AdminHeader currentPage={t.admin.certifications.pageTitle} />
      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {t.admin.certifications.addNewCertification}
          </h1>
          <p className="text-xl text-gray-400">
            {t.admin.form.briefOverview}
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
                {t.admin.certificationForm.certificationCreated}
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
                {t.admin.certificationForm.errorCreating}
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
              {t.admin.certificationForm.basicInformation}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label={t.admin.certificationForm.certificationTitle}
                name="title"
                placeholder={t.admin.certificationForm.titlePlaceholder}
                formik={formik}
                icon={<Award className="h-4 w-4" />}
                required
              />
              <FormInput
                label={t.admin.certificationForm.issuingBody}
                name="issuingBody"
                placeholder={t.admin.certificationForm.issuingBodyPlaceholder}
                formik={formik}
                icon={<Globe className="h-4 w-4" />}
                required
              />
              <div className="md:col-span-2">
                <FormTextarea
                  label={t.admin.certificationForm.summary}
                  name="summary"
                  placeholder={t.admin.certificationForm.summaryPlaceholder}
                  formik={formik}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <FormTextarea
                  label={t.admin.certificationForm.description}
                  name="description"
                  placeholder={t.admin.certificationForm.descriptionPlaceholder}
                  formik={formik}
                  rows={6}
                  required
                />
              </div>
            </div>
          </div>

          {/* Certification Details */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t.admin.certificationForm.certificationDetails}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label={t.admin.certificationForm.issueDate}
                name="issueDate"
                type="date"
                formik={formik}
                icon={<Calendar className="h-4 w-4" />}
                required
              />
              <FormInput
                label={t.admin.certificationForm.validUntil}
                name="validUntil"
                type="date"
                formik={formik}
                icon={<Calendar className="h-4 w-4" />}
                required
              />
              <FormSelect
                label={t.admin.certificationForm.category}
                name="category"
                formik={formik}
                required
                t={t}
                options={[
                  { value: "Quality", label: t.admin.certificationForm.categories.quality },
                  { value: "Environmental", label: t.admin.certificationForm.categories.environmental },
                  { value: "Organic", label: t.admin.certificationForm.categories.organic },
                  { value: "Food Safety", label: t.admin.certificationForm.categories.foodSafety },
                  { value: "Accreditation", label: t.admin.certificationForm.categories.accreditation },
                  { value: "National", label: t.admin.certificationForm.categories.national },
                ]}
              />
              <FormSelect
                label={t.admin.certificationForm.priority}
                name="priority"
                formik={formik}
                required
                t={t}
                options={[
                  { value: "High", label: t.admin.certificationForm.priorities.high },
                  { value: "Medium", label: t.admin.certificationForm.priorities.medium },
                  { value: "Low", label: t.admin.certificationForm.priorities.low },
                ]}
              />
              <FormSelect
                label={t.admin.certificationForm.status}
                name="status"
                formik={formik}
                required
                t={t}
                options={[
                  { value: "active", label: t.admin.certificationForm.statuses.active },
                  { value: "expired", label: t.admin.certificationForm.statuses.expired },
                  { value: "pending", label: t.admin.certificationForm.statuses.pending },
                ]}
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t.admin.certificationForm.features}</h2>
            <DynamicList
              label={t.admin.certificationForm.certificationFeatures}
              name="features"
              formik={formik}
              placeholder={t.admin.certificationForm.featuresPlaceholder}
              t={t}
            />
          </div>

          {/* Media Attachments */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t.admin.certificationForm.mediaAttachments}
            </h2>
            <FileUpload
              label={t.admin.certificationForm.certificationImage}
              name="image"
              accept="image/*"
              formik={formik}
              t={t}
            />
            <FileUpload
              label={t.admin.certificationForm.documents}
              name="documents"
              accept=".pdf,.doc,.docx"
              formik={formik}
              multiple
              t={t}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-8">
            <Link
              href="/admin/certifications"
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>{t.admin.certificationForm.cancel}</span>
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
                    <span>{t.admin.certificationForm.saving}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{t.admin.certificationForm.saveCertification}</span>
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