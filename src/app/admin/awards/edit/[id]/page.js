"use client";

import React, { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchAwardById, updateAward } from "@/redux/awardsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Shield,
  Building,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/shared/AdminHeader";
import { ENDPOINTS } from "@/shared/endpoints";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";

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
          className={`w-full px-4 py-3 bg-black/20 backdrop-blur-md border rounded-xl text-white focus:outline-none transition-all duration-300 appearance-none ${
            hasError
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
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      const uploads = await uploadMultipleFiles(files);
      const currentFiles = formik.values[name] || [];
      formik.setFieldValue(name, [...currentFiles, ...uploads]);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const removeFile = (index) => {
    const currentFiles = formik.values[name] || [];
    formik.setFieldValue(name, currentFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Upload className="w-4 h-4" />
        <span>{label}</span>
      </label>
      
      <div className="space-y-3">
        <div className="relative">
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
            className="flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white cursor-pointer hover:border-[#65a30d] transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Choose Files
          </label>
        </div>

        {/* Display uploaded files */}
        {formik.values[name] && formik.values[name].length > 0 && (
          <div className="space-y-2">
            {formik.values[name].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  {file.url && (
                    <img
                      src={file.url}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-white text-sm">{file.name || `File ${index + 1}`}</p>
                    <p className="text-gray-400 text-xs">{file.size}</p>
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
          <div key={index} className="flex items-center space-x-2">
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

// --- Image Upload Component ---
const ImageUpload = ({ label, name, formik }) => {
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    console.log('File selected:', files[0]?.name);
    
    try {
      const uploads = await uploadMultipleFiles(files);
      console.log('Upload result:', uploads);
      
      if (uploads.length > 0) {
        console.log('Setting new image:', uploads[0]);
        formik.setFieldValue(name, uploads[0]);
        // Clear the removeImage flag when a new image is uploaded
        formik.setFieldValue('removeImage', false);
        console.log('Form values after upload:', formik.values);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const removeImage = () => {
    formik.setFieldValue(name, null);
  };

  const removeCurrentImage = () => {
    formik.setFieldValue('removeImage', true);
    formik.setFieldValue('currentImage', null);
  };

  // Determine what to show based on the current state
  const hasCurrentImage = formik.values.currentImage && !formik.values.removeImage;
  const hasNewImage = formik.values[name] && !formik.values.removeImage;
  const showUploadArea = !hasCurrentImage && !hasNewImage;

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Upload className="w-4 h-4" />
        <span>{label}</span>
      </label>
      
      {/* Current Image Display */}
      {hasCurrentImage && (
        <div className="relative">
          <img
            src={typeof formik.values.currentImage === 'string' ? formik.values.currentImage : formik.values.currentImage.url}
            alt="Current award image"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeCurrentImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-${name}`}
          />
          <label
            htmlFor={`image-${name}`}
            className="flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white cursor-pointer hover:border-[#65a30d] transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Choose Image
          </label>
        </div>
      )}

      {/* New Image Preview */}
      {hasNewImage && (
        <div className="relative">
          <img
            src={typeof formik.values[name] === 'string' ? formik.values[name] : formik.values[name].url}
            alt="New award image"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function EditAwardPage({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentItem: award, loading } = useSelector((state) => state.awards);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Unwrap params using React.use() to fix the console error
  const unwrappedParams = use(params);
  const awardId = unwrappedParams.id;

  useEffect(() => {
    if (awardId) {
      dispatch(fetchAwardById(awardId));
    }
  }, [dispatch, awardId]);

  const formik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      description: "",
      awardingBody: "",
      awardDate: "",
      category: "",
      level: "",
      features: [],
      image: null,
      documents: [],
      currentImage: null,
      removeImage: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      awardingBody: Yup.string().required("Awarding body is required"),
      awardDate: Yup.date().required("Award date is required"),
      category: Yup.string().required("Category is required"),
      level: Yup.string().required("Level is required"),
      features: Yup.array().min(1, "At least one feature is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitStatus(null);

      console.log('Form submission values:', values);

      try {
        // Prepare award data
        const awardData = {
          title: values.title,
          summary: values.summary,
          description: values.description,
          awardingBody: values.awardingBody,
          awardDate: new Date(values.awardDate).toISOString(),
          category: values.category,
          level: values.level,
          features: values.features,
          documents: values.documents,
        };

        // Handle image data
        if (values.removeImage) {
          // If removeImage is true, set image to null regardless of other values
          awardData.image = null;
          console.log('Setting image to null (removeImage is true)');
        } else if (values.image) {
          // If there's a new uploaded image, use it
          awardData.image = values.image;
          console.log('Using new uploaded image:', values.image);
        } else if (values.currentImage) {
          // If no new image but there's a current image, keep it
          awardData.image = values.currentImage;
          console.log('Keeping current image:', values.currentImage);
        } else {
          // No image at all
          awardData.image = null;
          console.log('No image to set');
        }

        console.log('Final award data:', awardData);

        await dispatch(updateAward({ id: awardId, data: awardData })).unwrap();
        setSubmitStatus('success');
        
        // Redirect after successful update
        setTimeout(() => {
          router.push('/admin/awards');
        }, 2000);
      } catch (error) {
        console.error('Update failed:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Update form values when award data is loaded
  useEffect(() => {
    if (award) {
      console.log('Loading award data:', award);
      formik.setValues({
        title: award.title || "",
        summary: award.summary || "",
        description: award.description || "",
        awardingBody: award.awardingBody || "",
        awardDate: award.awardDate ? new Date(award.awardDate).toISOString().split('T')[0] : "",
        category: award.category || "",
        level: award.level || "",
        features: award.features || [],
        image: null, // Always start with no new image
        documents: award.documents || [],
        currentImage: award.image || null, // Set current image from award data
        removeImage: false, // Always start with removeImage as false
      });
    }
  }, [award]);

  const categoryOptions = [
    "Excellence",
    "Innovation", 
    "Quality",
    "Sustainability",
    "Leadership",
    "Industry Recognition"
  ];

  const levelOptions = [
    "Local",
    "National",
    "Regional", 
    "International",
    "Global"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65a30d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
      <AdminHeader currentPage="Awards" />

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
                Edit Award
              </h1>
              <p className="text-xl text-gray-400">
                Update award information and details
              </p>
            </div>
            <Link
              href="/admin/awards"
              className="flex items-center space-x-2 text-[#65a30d] hover:text-[#84cc16] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Awards</span>
            </Link>
          </div>
        </motion.div>

        {/* Submit Status */}
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              submitStatus === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {submitStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Award updated successfully! Redirecting...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Failed to update award. Please try again.</span>
              </>
            )}
          </motion.div>
        )}

                 {/* Form */}
         <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto" key={award?._id || 'loading'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <FormInput
                label="Award Title"
                name="title"
                placeholder="Enter award title"
                formik={formik}
                icon={<Trophy className="w-4 h-4" />}
                required
              />

              <FormTextarea
                label="Summary"
                name="summary"
                placeholder="Brief description of the award"
                formik={formik}
                required
                rows={3}
              />

              <FormInput
                label="Awarding Body"
                name="awardingBody"
                placeholder="Organization that granted the award"
                formik={formik}
                icon={<Building className="w-4 h-4" />}
                required
              />

              <FormInput
                label="Award Date"
                name="awardDate"
                type="date"
                formik={formik}
                icon={<Calendar className="w-4 h-4" />}
                required
              />

              <FormSelect
                label="Category"
                name="category"
                options={categoryOptions}
                formik={formik}
                required
              />

              <FormSelect
                label="Level"
                name="level"
                options={levelOptions}
                formik={formik}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormTextarea
                label="Description"
                name="description"
                placeholder="Detailed description of the award and its significance"
                formik={formik}
                required
                rows={6}
              />

              <DynamicList
                label="Key Features"
                name="features"
                formik={formik}
                placeholder="Add a key feature..."
              />

              <ImageUpload
                label="Award Image"
                name="image"
                formik={formik}
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

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-[#65a30d] text-white px-8 py-3 rounded-lg hover:bg-[#84cc16] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Award</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
} 