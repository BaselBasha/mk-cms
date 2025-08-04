"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updatePartnership, fetchPartnershipById } from "@/redux/partnershipsSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { ArrowLeft, Upload, X, Plus, Save, AlertCircle, Award, Calendar, User, Globe, FileText, Play, Link, Target, Users, Building, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { uploadMultipleFiles } from "@/shared/uploadMultipleFiles";
import { AnimatePresence } from "framer-motion";

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

const FormSelect = ({ label, name, options, required = false, ...props }) => (
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
            <option value="">Select {label}</option>
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
                        Add More Files
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
                                            {isExistingFile(file) ? 'Existing file' : getFileSize(file)}
                                        </p>
                                        {isExistingFile(file) && (
                                            <a 
                                                href={file.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 text-xs"
                                            >
                                                View file
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

const DynamicList = ({ label, name, formik, placeholder }) => {
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
        fields.forEach(field => {
            newItem[field.name] = "";
        });
        formik.setFieldValue(name, [...currentItems, newItem]);
    };

    const removeItem = (index) => {
        const currentItems = formik.values[name] || [];
        formik.setFieldValue(name, currentItems.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const currentItems = formik.values[name] || [];
        const newItems = [...currentItems];
        newItems[index] = { ...newItems[index], [field]: value };
        formik.setFieldValue(name, newItems);
    };



    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">{label}</label>
            <div className="space-y-4">
                {(formik.values[name] || []).map((item, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg border border-white/10">
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
                            {fields.map((field) => {
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
                            })}
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

export default function EditPartnershipPage({ params }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [partnership, setPartnership] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [partnershipId, setPartnershipId] = useState(null);

    useEffect(() => {
        const getPartnershipId = async () => {
            try {
                const resolvedParams = params?.then ? await params : params;
                const id = resolvedParams?.id;
                setPartnershipId(id);

                if (id) {
                    const result = await dispatch(fetchPartnershipById(id)).unwrap();
                    setPartnership(result);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getPartnershipId();
    }, [dispatch, params]);

    const validationSchema = Yup.object({
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
                title: Yup.string().required("Link title is required"),
                url: Yup.string().required("Link URL is required"),
                type: Yup.string().required("Link type is required"),
            })
        ),
        timeline: Yup.array().of(
            Yup.object().shape({
                year: Yup.string().required("Year is required"),
                event: Yup.string().required("Event is required"),
                description: Yup.string().required("Description is required"),
            })
        ),
        achievements: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required("Achievement title is required"),
                description: Yup.string().required("Description is required"),
            })
        ),
        attachments: Yup.array(),
        youtubeLinks: Yup.array().of(Yup.string().url("Must be a valid URL")),
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading partnership...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Error Loading Partnership</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-[#65a30d] hover:bg-[#528000] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!partnership) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Partnership not found</div>
            </div>
        );
    }

    const initialValues = {
        title: partnership?.title || "",
        summary: partnership?.summary || "",
        description: partnership?.description || "",
        startDate: partnership?.startDate ? new Date(partnership.startDate).toISOString().split('T')[0] : "",
        nextMilestone: partnership?.nextMilestone || "",
        status: partnership?.status || "",
        priority: partnership?.priority || "",
        partnerInformation: {
            name: partnership?.partnerInformation?.name || "",
            founded: partnership?.partnerInformation?.founded || "",
            headquarters: partnership?.partnerInformation?.headquarters || "",
            employees: partnership?.partnerInformation?.employees || "",
            specialization: partnership?.partnerInformation?.specialization || "",
            website: partnership?.partnerInformation?.website || "",
            ceo: partnership?.partnerInformation?.ceo || "",
            revenue: partnership?.partnerInformation?.revenue || "",
        },
        partnerLinks: partnership?.partnerLinks || [],
        timeline: partnership?.timeline || [],
        achievements: partnership?.achievements || [],
        attachments: partnership?.attachments || [],
        image: partnership?.image ? (Array.isArray(partnership.image) ? partnership.image : [partnership.image]) : [],
        youtubeLinks: partnership?.youtubeLinks || [],
    };

    console.log('Partnership data loaded:', partnership);
    console.log('Initial image values:', initialValues.image);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
            <AdminHeader currentPage="Partnerships" />

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
                                Edit Partnership
                            </h1>
                            <p className="text-xl text-gray-400">
                                Update partnership information and details
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
                            <Award className="h-5 w-5 text-green-400 mr-3" />
                            <span className="text-green-400">
                                Partnership updated successfully!
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
                                Error updating partnership. Please try again.
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize={false}
                    validateOnMount={false}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={async (values) => {
                        setIsSubmitting(true);
                        try {
                            // Handle attachments - separate already uploaded files from new files
                            const existingAttachments = values.attachments.filter(att => typeof att === 'object' && att.url);
                            const newAttachments = values.attachments.filter(att => att instanceof File);
                            const attachmentUploads = await uploadMultipleFiles(newAttachments);
                            const allAttachments = [
                                ...existingAttachments,
                                ...attachmentUploads.map((file, index) => ({
                                    type: file.type.startsWith('image/') ? 'image' : 
                                           file.type.startsWith('video/') ? 'video' : 'document',
                                    url: file.url,
                                    title: file.name || `Attachment ${index + 1}`,
                                    description: `Uploaded ${file.name}`
                                }))
                            ];

                            // Handle partnership images - separate already uploaded files from new files
                            const existingImages = values.image.filter(img => {
                                if (typeof img === 'string') {
                                    return true;
                                } else if (typeof img === 'object' && img) {
                                    return img.url || img instanceof File;
                                }
                                return false;
                            });
                            const newImages = values.image.filter(img => img instanceof File);
                            
                            // Process existing images to ensure they have the correct structure
                            const processedExistingImages = existingImages.map(img => {
                                console.log('Processing existing image:', img);
                                
                                if (typeof img === 'string') {
                                    return {
                                        url: img,
                                        name: 'Partnership Image',
                                        type: 'image/jpeg',
                                        size: 0
                                    };
                                } else if (typeof img === 'object' && img.url) {
                                    // Ensure it has the required fileSchema structure
                                    return {
                                        url: img.url,
                                        name: img.name || img.title || 'Partnership Image',
                                        type: img.type || 'image/jpeg',
                                        size: img.size || 0
                                    };
                                } else if (typeof img === 'object' && img.path) {
                                    return {
                                        url: img.path,
                                        name: img.title || 'Partnership Image',
                                        type: 'image/jpeg',
                                        size: 0
                                    };
                                } else {
                                    console.log('Skipping invalid image:', img);
                                    return null;
                                }
                            }).filter(img => img !== null);

                            let allImages = [...processedExistingImages];
                            
                            if (newImages.length > 0) {
                                try {
                                    const imageUploads = await uploadMultipleFiles(newImages);
                                    const uploadedImages = imageUploads.map((file, index) => ({
                                        url: file.url,
                                        name: file.name || `Image ${index + 1}`,
                                        type: file.type,
                                        size: file.size
                                    }));
                                    allImages = [...allImages, ...uploadedImages];
                                } catch (error) {
                                    console.error('Image upload failed:', error);
                                }
                            }

                            // Filter out any invalid image objects and ensure proper structure
                            const validImages = allImages.filter(img => {
                                return img && img.url && typeof img.url === 'string';
                            });

                            console.log('Valid images before processing:', validImages);

                            // Ensure all images have the required url field and proper fileSchema structure
                            const validatedImages = validImages.map(img => {
                                const validatedImg = {
                                    url: img.url,
                                    name: img.name || img.title || 'Partnership Image',
                                    type: img.type || 'image/jpeg',
                                    size: img.size || 0
                                };
                                console.log('Validated image:', validatedImg);
                                return validatedImg;
                            });

                            // Validate attachments to ensure they have required fields
                            const validAttachments = allAttachments.filter(att => {
                                return att && att.url && typeof att.url === 'string';
                            });
                            
                            // Create partnership data without the image field first
                            const { image: _, ...valuesWithoutImage } = values;
                            
                            const partnershipData = {
                                ...valuesWithoutImage,
                                attachments: validAttachments,
                            };
                            
                            // Handle image field - backend expects a single fileSchema object, not an array
                            if (validatedImages.length > 0) {
                                // Take the first image as the main partnership image
                                const selectedImage = validatedImages[0];
                                // Ensure the image has all required fields
                                if (selectedImage && selectedImage.url) {
                                    partnershipData.image = selectedImage;
                                } else {
                                    partnershipData.image = null;
                                }
                            } else {
                                // If no images, set to null to avoid validation errors
                                partnershipData.image = null;
                            }

                            const resolvedParams = params?.then ? await params : params;
                            const partnershipId = resolvedParams?.id;

                            console.log('Partnership data being sent:', partnershipData);
                            console.log('Image data:', partnershipData.image);

                            const result = await dispatch(updatePartnership({ id: partnershipId, data: partnershipData })).unwrap();
                            setSubmitStatus("success");
                            setTimeout(() => {
                                router.push("/admin/partnerships");
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
                                <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Partnership Title"
                                        name="title"
                                        required
                                        placeholder="Enter partnership title"
                                    />
                                    <FormInput
                                        label="Next Milestone"
                                        name="nextMilestone"
                                        placeholder="e.g., Sub-Saharan Africa Expansion - Q3 2024"
                                    />
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label="Summary"
                                            name="summary"
                                            rows={3}
                                            required
                                            placeholder="Brief description of the partnership"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label="Description"
                                            name="description"
                                            rows={6}
                                            required
                                            placeholder="Detailed description of the partnership"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Partnership Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Partnership Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        required
                                    />
                                    <FormSelect
                                        label="Status"
                                        name="status"
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
                                        required
                                        options={[
                                            { value: "high", label: "High" },
                                            { value: "medium", label: "Medium" },
                                            { value: "low", label: "Low" },
                                        ]}
                                    />
                                </div>
                            </motion.div>

                            {/* Partner Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Partner Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Partner Name"
                                        name="partnerInformation.name"
                                        required
                                        placeholder="Enter partner company name"
                                    />
                                    <FormInput
                                        label="Founded"
                                        name="partnerInformation.founded"
                                        placeholder="e.g., 2015"
                                    />
                                    <FormInput
                                        label="Headquarters"
                                        name="partnerInformation.headquarters"
                                        placeholder="e.g., Dubai, UAE"
                                    />
                                    <FormInput
                                        label="Employees"
                                        name="partnerInformation.employees"
                                        placeholder="e.g., 250+"
                                    />
                                    <FormInput
                                        label="Specialization"
                                        name="partnerInformation.specialization"
                                        placeholder="e.g., Smart Irrigation & Water Management"
                                    />
                                    <FormInput
                                        label="Website"
                                        name="partnerInformation.website"
                                        placeholder="e.g., https://greentech-solutions.com"
                                    />
                                    <FormInput
                                        label="CEO"
                                        name="partnerInformation.ceo"
                                        placeholder="e.g., Dr. Ahmad Hassan"
                                    />
                                    <FormInput
                                        label="Revenue"
                                        name="partnerInformation.revenue"
                                        placeholder="e.g., $45M (2023)"
                                    />
                                </div>
                            </motion.div>

                            {/* Partner Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Partner Links</h2>
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
                                            ]
                                        },
                                    ]}
                                />
                            </motion.div>

                            {/* Timeline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Timeline</h2>
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
                            </motion.div>

                            {/* Achievements */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
                                <DynamicObjectList
                                    label="Achievements"
                                    name="achievements"
                                    formik={formik}
                                    fields={[
                                        { name: "title", placeholder: "Achievement Title" },
                                        { name: "description", placeholder: "Description" },
                                    ]}
                                />
                            </motion.div>

                            {/* Media & Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <h2 className="text-xl font-semibold text-white mb-6">Media & Links</h2>
                                <div className="space-y-6">
                                    <FileUpload
                                        label="Partnership Image (Main)"
                                        name="image"
                                        accept="image/*"
                                        formik={formik}
                                        multiple={false}
                                    />
                                    <DynamicList
                                        label="YouTube Video Links"
                                        name="youtubeLinks"
                                        formik={formik}
                                        placeholder="https://youtu.be/VIDEO_ID"
                                    />
                                    <FileUpload
                                        label="Attachments (Images, Videos, Documents)"
                                        name="attachments"
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                        formik={formik}
                                        multiple
                                    />
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex items-center justify-between"
                            >
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-[#65a30d] hover:bg-[#528000] disabled:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:cursor-not-allowed"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>{isSubmitting ? "Updating..." : "Update Partnership"}</span>
                                </button>
                            </motion.div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
} 