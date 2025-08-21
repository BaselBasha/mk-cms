"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProject, fetchProjectById } from "@/redux/projectsSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Plus, Save, AlertCircle } from "lucide-react";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import AdminHeader from "@/shared/AdminHeader";
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
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                        className="flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white cursor-pointer hover:border-blue-500 transition-colors"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        {t.admin.projectEditForm.chooseFiles}
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

    // Ensure formik.values[name] exists and is an array
    const items = Array.isArray(formik.values[name]) ? formik.values[name] : [];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">{label}</label>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={item || ""}
                            onChange={(e) => updateItem(index, e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>{t.admin.projectEditForm.addItem.replace('{item}', label)}</span>
                </button>
            </div>
        </div>
    );
};

export default function EditProjectPage({ params }) {
    const { language, isRTL } = useLanguage();
    const t = translations[language];
    const router = useRouter();
    const dispatch = useDispatch();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [projectId, setProjectId] = useState(null);

    useEffect(() => {
        const getProjectId = async () => {
            try {
                // Handle params as Promise in Next.js 15+
                const resolvedParams = params?.then ? await params : params;
                const id = resolvedParams?.id;
                setProjectId(id);

                if (id) {
                    const result = await dispatch(fetchProjectById(id)).unwrap();
                    setProject(result);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getProjectId();
    }, [dispatch, params]);

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        summary: Yup.string().required("Summary is required"),
        description: Yup.string().required("Description is required"),
        location: Yup.string().required("Location is required"),
        area: Yup.string().required("Area is required"),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().required("End date is required"),
        status: Yup.string().required("Status is required"),
        budget: Yup.string(),
        priority: Yup.string(),
        successPartner: Yup.string(),
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">{t.admin.projectEditForm.loadingProject}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{t.admin.projectEditForm.errorLoadingProject}</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        {t.admin.projectEditForm.goBack}
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">{t.admin.projectEditForm.projectNotFound}</div>
            </div>
        );
    }

    const initialValues = {
        title: project?.title || "",
        summary: project?.summary || "",
        description: project?.description || "",
        location: project?.location || "",
        area: project?.area || "",
        startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
        status: project?.status || "",
        budget: project?.budget || "",
        priority: project?.priority || "",
        successPartner: project?.successPartner || "",
        youtubeLinks: project?.youtubeLinks || [],
        images: project?.images || [],
        documents: project?.documents || [],
        keyMetrics: project?.keyMetrics || [],
        awards: project?.awards || [],
    };

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <AdminHeader currentPage="Projects" />
            
            {/* Header */}
            <div className="bg-black/30 border-b border-white/10 mt-20">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>{t.admin.projectEditForm.back}</span>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{t.admin.projectEditForm.editProject}</h1>
                                <p className="text-gray-400">{t.admin.projectEditForm.updateProjectInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-6 py-8">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setIsSubmitting(true);
                        try {
                            console.log('Form values:', values);
                            
                            // Handle images - separate already uploaded files from new files
                            const existingImages = values.images.filter(img => typeof img === 'string' || (img && img.url));
                            const newImages = values.images.filter(img => img instanceof File);
                            const imageUploads = await uploadMultipleFiles(newImages);
                            const allImages = [...existingImages, ...imageUploads];

                            // Handle documents - separate already uploaded files from new files
                            const existingDocuments = values.documents.filter(doc => typeof doc === 'string' || (doc && doc.url));
                            const newDocuments = values.documents.filter(doc => doc instanceof File);
                            const documentUploads = await uploadMultipleFiles(newDocuments);
                            const allDocuments = [...existingDocuments, ...documentUploads];

                            console.log('All images:', allImages);
                            console.log('All documents:', allDocuments);

                            const projectData = {
                                ...values,
                                images: allImages,
                                documents: allDocuments,
                            };

                            console.log('Project data being sent:', projectData);
                            // Get the project ID from the resolved params
                            const resolvedParams = params?.then ? await params : params;
                            const projectId = resolvedParams?.id;

                            await dispatch(updateProject({ 
                              id: projectId, 
                              data: projectData, 
                              lang: language 
                            })).unwrap();
                            setSubmitStatus("success");
                            setTimeout(() => {
                                router.push("/admin/projects");
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
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.projectEditForm.basicInformation}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label={t.admin.projectEditForm.projectTitle}
                                        name="title"
                                        required
                                        placeholder={t.admin.projectEditForm.titlePlaceholder}
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.summary}
                                        name="summary"
                                        required
                                        placeholder={t.admin.projectEditForm.summaryPlaceholder}
                                    />
                                    <div className="md:col-span-2">
                                        <FormInput
                                            label={t.admin.projectEditForm.description}
                                            name="description"
                                            as="textarea"
                                            rows={4}
                                            required
                                            placeholder={t.admin.projectEditForm.descriptionPlaceholder}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Project Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.projectEditForm.projectDetails}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label={t.admin.projectEditForm.location}
                                        name="location"
                                        required
                                        placeholder={t.admin.projectEditForm.locationPlaceholder}
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.area}
                                        name="area"
                                        required
                                        placeholder={t.admin.projectEditForm.areaPlaceholder}
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.startDate}
                                        name="startDate"
                                        type="date"
                                        required
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.endDate}
                                        name="endDate"
                                        type="date"
                                        required
                                    />
                                    <FormSelect
                                        label={t.admin.projectEditForm.status}
                                        name="status"
                                        required
                                        t={t}
                                        options={[
                                            { value: "planning", label: t.admin.projectEditForm.statusOptions.planning },
                                            { value: "in-progress", label: t.admin.projectEditForm.statusOptions.inProgress },
                                            { value: "completed", label: t.admin.projectEditForm.statusOptions.completed },
                                            { value: "on-hold", label: t.admin.projectEditForm.statusOptions.onHold },
                                            { value: "cancelled", label: t.admin.projectEditForm.statusOptions.cancelled },
                                        ]}
                                    />
                                    <FormSelect
                                        label={t.admin.projectEditForm.priority}
                                        name="priority"
                                        t={t}
                                        options={[
                                            { value: "low", label: t.admin.projectEditForm.priorityOptions.low },
                                            { value: "medium", label: t.admin.projectEditForm.priorityOptions.medium },
                                            { value: "high", label: t.admin.projectEditForm.priorityOptions.high },
                                            { value: "urgent", label: t.admin.projectEditForm.priorityOptions.urgent },
                                        ]}
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.budget}
                                        name="budget"
                                        placeholder={t.admin.projectEditForm.budgetPlaceholder}
                                    />
                                    <FormInput
                                        label={t.admin.projectEditForm.successPartner}
                                        name="successPartner"
                                        placeholder={t.admin.projectEditForm.successPartnerPlaceholder}
                                    />
                                </div>
                            </motion.div>

                            {/* Media & Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.projectEditForm.mediaAndLinks}</h2>
                                <div className="space-y-6">
                                    <DynamicList
                                        label={t.admin.projectEditForm.youtubeVideoLinks}
                                        name="youtubeLinks"
                                        formik={formik}
                                        placeholder={t.admin.projectEditForm.videoLinkPlaceholder}
                                        t={t}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FileUpload
                                            label={t.admin.projectEditForm.projectImages}
                                            name="images"
                                            accept="image/*"
                                            formik={formik}
                                            multiple
                                            t={t}
                                        />
                                        <FileUpload
                                            label={t.admin.projectEditForm.projectDocuments}
                                            name="documents"
                                            accept=".pdf,.doc,.docx,.txt"
                                            formik={formik}
                                            multiple
                                            t={t}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Additional Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.projectEditForm.additionalInformation}</h2>
                                <div className="space-y-6">
                                    <DynamicList
                                        label={t.admin.projectEditForm.keyMetrics}
                                        name="keyMetrics"
                                        formik={formik}
                                        placeholder={t.admin.projectEditForm.keyMetricsPlaceholder}
                                        t={t}
                                    />
                                    <DynamicList
                                        label={t.admin.projectEditForm.awards}
                                        name="awards"
                                        formik={formik}
                                        placeholder={t.admin.projectEditForm.awardsPlaceholder}
                                        t={t}
                                    />
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-between"
                            >
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    {t.admin.projectEditForm.cancel}
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>{isSubmitting ? t.admin.projectEditForm.updating : t.admin.projectEditForm.updateProject}</span>
                                </button>
                            </motion.div>

                            {/* Status Messages */}
                            {submitStatus === "success" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-green-600/20 border border-green-500/50 text-green-400 p-4 rounded-lg"
                                >
                                    {t.admin.projectEditForm.projectUpdated}
                                </motion.div>
                            )}

                            {submitStatus === "error" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-lg"
                                >
                                    {t.admin.projectEditForm.errorUpdating}
                                </motion.div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}