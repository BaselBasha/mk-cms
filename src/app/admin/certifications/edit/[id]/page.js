"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateCertification, fetchCertificationById } from "@/redux/certificationsSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { ArrowLeft, Upload, X, Plus, Save, AlertCircle, Award, Calendar, FileText, CheckCircle } from "lucide-react";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";

// Form Components
const FormInput = ({ label, name, type = "text", required = false, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <Field
            name={name}
            type={type}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
            {...props}
        />
    </div>
);

const FormSelect = ({ label, name, options, required = false, t, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <Field
            as="select"
            name={name}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#65a30d]"
            {...props}
        >
            <option value="">{t.admin.form.select} {label}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Field>
    </div>
);

const FormTextarea = ({ label, name, required = false, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <Field
            as="textarea"
            name={name}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d] resize-none"
            {...props}
        />
    </div>
);

const FileUpload = ({ label, name, accept, formik, multiple = false, t }) => {
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

    const getFileIcon = (file) => {
        if (file.type) {
            if (file.type.startsWith('image/')) return '🖼️';
            if (file.type.startsWith('video/')) return '🎥';
            if (file.type.includes('pdf')) return '📄';
            if (file.type.includes('doc')) return '📝';
        }
        if (file.url) {
            if (file.url.includes('.jpg') || file.url.includes('.png') || file.url.includes('.jpeg')) return '🖼️';
            if (file.url.includes('.mp4') || file.url.includes('.mov')) return '🎥';
            if (file.url.includes('.pdf')) return '📄';
            if (file.url.includes('.doc')) return '📝';
        }
        return '📎';
    };

    const getFileDisplayName = (file) => {
        if (file.name) return file.name;
        if (file.title) return file.title;
        if (file.url) return file.url.split('/').pop();
        return 'Unknown file';
    };

    const getFileSize = (file) => {
        if (file.size) return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
        return 'Unknown size';
    };

    const isExistingFile = (file) => {
        return file.url && !(file instanceof File);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">{label}</label>
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
                        {t.admin.certificationEditForm.addMoreFiles}
                    </label>
                </div>

                {/* Display existing and new files */}
                {formik.values[name] && formik.values[name].length > 0 && (
                    <div className="space-y-2">
                        {formik.values[name].map((file, index) => (
                            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                                isExistingFile(file) ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-black/20'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{getFileIcon(file)}</span>
                                    <div>
                                        <p className="text-white text-sm">{getFileDisplayName(file)}</p>
                                        <p className="text-gray-400 text-xs">
                                            {isExistingFile(file) ? t.admin.certificationEditForm.existingFile : getFileSize(file)}
                                        </p>
                                        {isExistingFile(file) && (
                                            <a 
                                                href={file.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 text-xs"
                                            >
                                                {t.admin.certificationEditForm.viewFile}
                                            </a>
                                        )}
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

const ImageUpload = ({ label, name, formik, existingImage, t }) => {
    const handleImageChange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            const uploads = await uploadMultipleFiles(files);
            if (uploads.length > 0) {
                formik.setFieldValue(name, uploads[0]);
                formik.setFieldValue('removeImage', false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const removeImage = () => {
        formik.setFieldValue(name, null);
        formik.setFieldValue('removeImage', true);
    };

    const currentImage = formik.values[name];
    const hasExistingImage = existingImage?.url && !formik.values.removeImage;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">{label}</label>
            <div className="space-y-3">
                {/* Current Image Display */}
                {hasExistingImage && (
                    <div className="relative">
                        <div className="bg-white/90 rounded-lg p-4 flex items-center justify-center">
                            <img
                                src={existingImage.url}
                                alt="Current certification image"
                                className="max-h-32 max-w-full object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-400 text-center">
                            {t.admin.certificationEditForm.currentImage}
                        </div>
                    </div>
                )}

                {/* New Image Upload */}
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id={`image-${name}`}
                    />
                    <label
                        htmlFor={`image-${name}`}
                        className="flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white cursor-pointer hover:border-[#65a30d] transition-colors"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        {hasExistingImage ? t.admin.certificationEditForm.replaceImage : t.admin.certificationEditForm.uploadImage}
                    </label>
                </div>

                {/* New Image Preview */}
                {currentImage && (
                    <div className="relative">
                        <div className="bg-white/90 rounded-lg p-4 flex items-center justify-center">
                            <img
                                src={currentImage.url}
                                alt="New certification image"
                                className="max-h-32 max-w-full object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                formik.setFieldValue(name, null);
                                formik.setFieldValue('removeImage', false);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="mt-2 text-xs text-gray-400 text-center">
                            {t.admin.certificationEditForm.newImagePreview}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DynamicList = ({ label, name, formik, placeholder, t }) => {
    const addItem = () => {
        const currentItems = formik.values[name] || [];
        formik.setFieldValue(name, [...currentItems, ""]);
    };

    const removeItem = (index) => {
        const currentItems = formik.values[name] || [];
        formik.setFieldValue(name, currentItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, value) => {
        const currentItems = formik.values[name] || [];
        const newItems = [...currentItems];
        newItems[index] = value;
        formik.setFieldValue(name, newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">{label}</label>
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center space-x-2 px-3 py-1 bg-[#65a30d] hover:bg-[#528000] text-white rounded-lg text-sm transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>{t.admin.certificationEditForm.add}</span>
                </button>
            </div>
            <div className="space-y-3">
                {(formik.values[name] || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-400 hover:text-red-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function EditCertificationPage({ params }) {
    const { language, isRTL } = useLanguage();
    const t = translations[language];
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentItem: certification, loading, error } = useSelector((state) => state.certifications);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const getCertificationId = async () => {
            try {
                const resolvedParams = params?.then ? await params : params;
                const certificationId = resolvedParams?.id;
                if (certificationId) {
                    await dispatch(fetchCertificationById(certificationId)).unwrap();
                }
            } catch (error) {
                console.error("Error fetching certification:", error);
            }
        };
        getCertificationId();
    }, [dispatch, params]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        summary: Yup.string().required("Summary is required"),
        description: Yup.string().required("Description is required"),
        issuingBody: Yup.string().required("Issuing body is required"),
        issueDate: Yup.date().required("Issue date is required"),
        validUntil: Yup.date().required("Valid until date is required"),
        priority: Yup.string().required("Priority is required"),
        category: Yup.string().required("Category is required"),
        features: Yup.array().of(Yup.string()),
        documents: Yup.array(),
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">{t.admin.certificationEditForm.loadingCertification}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{t.admin.certificationEditForm.errorLoadingCertification}</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-[#65a30d] hover:bg-[#528000] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        {t.admin.certificationEditForm.goBack}
                    </button>
                </div>
            </div>
        );
    }

    if (!certification) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">{t.admin.certificationEditForm.certificationNotFound}</div>
            </div>
        );
    }

    const initialValues = {
        title: certification?.title || "",
        summary: certification?.summary || "",
        description: certification?.description || "",
        issuingBody: certification?.issuingBody || "",
        issueDate: certification?.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : "",
        validUntil: certification?.validUntil ? new Date(certification.validUntil).toISOString().split('T')[0] : "",
        priority: certification?.priority || "",
        category: certification?.category || "",
        features: certification?.features || [],
        documents: certification?.documents || [], // Load existing documents
        image: null,
        removeImage: false,
    };

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <AdminHeader currentPage="Certifications" />

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
                                {t.admin.certificationEditForm.editCertification}
                            </h1>
                            <p className="text-xl text-gray-400">
                                {t.admin.certificationEditForm.updateCertificationInfo}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Submit Status */}
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
                                {t.admin.certificationEditForm.certificationUpdated}
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
                                {t.admin.certificationEditForm.errorUpdating}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={async (values, { setSubmitting }) => {
                        setIsSubmitting(true);
                        setSubmitStatus(null);

                        try {
                            // Handle image upload
                            let imageData = null;
                            if (values.image) {
                                const imageUploads = await uploadMultipleFiles([values.image]);
                                if (imageUploads && imageUploads.length > 0 && imageUploads[0]) {
                                    imageData = imageUploads[0];
                                }
                            }

                            // Handle file uploads - separate existing documents from new files
                            const existingDocuments = values.documents.filter(doc => typeof doc === 'object' && doc.url);
                            const newDocuments = values.documents.filter(doc => doc instanceof File);
                            let documentsData = [...existingDocuments];

                            if (newDocuments.length > 0) {
                                const documentUploads = await uploadMultipleFiles(newDocuments);
                                const uploadedDocs = documentUploads.filter(file => file && file.url).map(file => ({
                                    url: file.url,
                                    name: file.name,
                                    type: file.type,
                                    size: file.size
                                }));
                                documentsData = [...documentsData, ...uploadedDocs];
                            }

                            const certificationData = {
                                title: values.title,
                                summary: values.summary,
                                description: values.description,
                                issuingBody: values.issuingBody,
                                issueDate: values.issueDate,
                                validUntil: values.validUntil,
                                priority: values.priority,
                                category: values.category,
                                features: values.features,
                                documents: documentsData,
                            };

                            // Handle image data
                            if (values.removeImage) {
                                certificationData.image = null;
                            } else if (imageData) {
                                certificationData.image = imageData;
                            }

                            const resolvedParams = params?.then ? await params : params;
                            const certificationId = resolvedParams?.id;

                            await dispatch(updateCertification({ 
                              id: certificationId, 
                              data: certificationData, 
                              lang: language 
                            })).unwrap();
                            setSubmitStatus("success");
                            setTimeout(() => {
                                router.push("/admin/certifications");
                            }, 2000);
                        } catch (error) {
                            setSubmitStatus("error");
                            console.error("Update error:", error);
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                >
                    {(formik) => (
                        <Form className="max-w-4xl mx-auto space-y-8">
                            {/* Basic Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.certificationEditForm.basicInformation}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label={t.admin.certificationEditForm.certificationTitle}
                                        name="title"
                                        required
                                        placeholder={t.admin.certificationEditForm.titlePlaceholder}
                                    />
                                    <FormInput
                                        label={t.admin.certificationEditForm.issuingBody}
                                        name="issuingBody"
                                        required
                                        placeholder={t.admin.certificationEditForm.issuingBodyPlaceholder}
                                    />
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label={t.admin.certificationEditForm.summary}
                                            name="summary"
                                            rows={3}
                                            required
                                            placeholder={t.admin.certificationEditForm.summaryPlaceholder}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label={t.admin.certificationEditForm.description}
                                            name="description"
                                            rows={6}
                                            required
                                            placeholder={t.admin.certificationEditForm.descriptionPlaceholder}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Certification Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.certificationEditForm.certificationDetails}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label={t.admin.certificationEditForm.issueDate}
                                        name="issueDate"
                                        type="date"
                                        required
                                    />
                                    <FormInput
                                        label={t.admin.certificationEditForm.validUntil}
                                        name="validUntil"
                                        type="date"
                                        required
                                    />
                                    <FormSelect
                                        label={t.admin.certificationEditForm.category}
                                        name="category"
                                        required
                                        t={t}
                                        options={[
                                            { value: "Quality", label: t.admin.certificationEditForm.categoryOptions.quality },
                                            { value: "Environmental", label: t.admin.certificationEditForm.categoryOptions.environmental },
                                            { value: "Organic", label: t.admin.certificationEditForm.categoryOptions.organic },
                                            { value: "Food Safety", label: t.admin.certificationEditForm.categoryOptions.foodSafety },
                                            { value: "Accreditation", label: t.admin.certificationEditForm.categoryOptions.accreditation },
                                            { value: "National", label: t.admin.certificationEditForm.categoryOptions.national },
                                        ]}
                                    />
                                    <FormSelect
                                        label={t.admin.certificationEditForm.priority}
                                        name="priority"
                                        required
                                        t={t}
                                        options={[
                                            { value: "High", label: t.admin.certificationEditForm.priorityOptions.high },
                                            { value: "Medium", label: t.admin.certificationEditForm.priorityOptions.medium },
                                            { value: "Low", label: t.admin.certificationEditForm.priorityOptions.low },
                                        ]}
                                    />
                                </div>
                            </motion.div>

                            {/* Features */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.certificationEditForm.features}</h2>
                                <DynamicList
                                    label={t.admin.certificationEditForm.certificationFeatures}
                                    name="features"
                                    formik={formik}
                                    placeholder={t.admin.certificationEditForm.featurePlaceholder}
                                    t={t}
                                />
                            </motion.div>

                            {/* Image Upload */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.certificationEditForm.certificationImage}</h2>
                                <div className="grid grid-cols-1 gap-6">
                                                                     <ImageUpload
                                     label={t.admin.certificationEditForm.certificationImage}
                                     name="image"
                                     formik={formik}
                                     existingImage={certification?.image}
                                     t={t}
                                 />
                                </div>
                            </motion.div>

                            {/* Files */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                                                 <h2 className="text-xl font-semibold text-white mb-6">{t.admin.certificationEditForm.files}</h2>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FileUpload
                                         label={t.admin.certificationEditForm.certificationDocuments}
                                         name="documents"
                                         accept=".pdf,.doc,.docx"
                                         formik={formik}
                                         multiple
                                         t={t}
                                     />
                                 </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-end space-x-4"
                            >
                                                                 <button
                                     type="button"
                                     onClick={() => router.back()}
                                     className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                 >
                                     {t.admin.certificationEditForm.cancel}
                                 </button>
                                 <button
                                     type="submit"
                                     disabled={isSubmitting}
                                     className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#528000] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     <Save className="h-5 w-5" />
                                     <span>{isSubmitting ? t.admin.certificationEditForm.updating : t.admin.certificationEditForm.updateCertification}</span>
                                 </button>
                            </motion.div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
} 