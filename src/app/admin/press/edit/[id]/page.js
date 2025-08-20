"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPressById, updatePress } from "@/redux/pressSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/shared/AdminHeader";
import { Save, AlertCircle, Plus, Trash2, Upload, X } from "lucide-react";
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
    <Field name={name}>
      {({ field, meta }) => meta.touched && meta.error && (
        <div className="text-red-400 text-sm">{meta.error}</div>
      )}
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
    <Field name={name}>
      {({ field, meta }) => meta.touched && meta.error && (
        <div className="text-red-400 text-sm">{meta.error}</div>
      )}
    </Field>
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
    <Field name={name}>
      {({ field, meta }) => meta.touched && meta.error && (
        <div className="text-red-400 text-sm">{meta.error}</div>
      )}
    </Field>
  </div>
);

const DynamicList = ({ label, name, formik, placeholder = "Add item...", t }) => {
  const addItem = () => {
    const currentValues = formik.values[name] || [];
    formik.setFieldValue(name, [...currentValues, ""]);
  };

  const removeItem = (index) => {
    const currentValues = formik.values[name] || [];
    const newValues = currentValues.filter((_, i) => i !== index);
    formik.setFieldValue(name, newValues);
  };

  const updateItem = (index, value) => {
    const currentValues = formik.values[name] || [];
    const newValues = [...currentValues];
    newValues[index] = value;
    formik.setFieldValue(name, newValues);
  };

  const values = formik.values[name] || [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#65a30d]"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-3 bg-[#65a30d]/20 hover:bg-[#65a30d]/30 text-[#65a30d] rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t.admin.pressEditForm.addItem.replace('{item}', label)}</span>
        </button>
      </div>
    </div>
  );
};

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
            className="flex items-center justify-center w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white cursor-pointer hover:border-[#65a30d] transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            {t.admin.pressEditForm.chooseFiles}
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

export default function EditPressPage({ params }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.press);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [press, setPress] = useState(null);

  // Unwrap params for Next.js 15+
  const resolvedParams = use(params);
  const pressId = resolvedParams.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await dispatch(fetchPressById(pressId)).unwrap();
        setPress(result);
      } catch (err) {
        setPress(null);
      }
    }
    fetchData();
  }, [dispatch, pressId]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    summary: Yup.string().required("Summary is required"),
    content: Yup.string().required("Content is required"),
    author: Yup.string().required("Author is required"),
    publication: Yup.string().required("Publication is required"),
    publishDate: Yup.date().required("Publish date is required"),
    url: Yup.string().url("Must be a valid URL"),
    image: Yup.array().of(Yup.object().shape({
      url: Yup.string().required(),
      name: Yup.string(),
      type: Yup.string(),
      size: Yup.number()
    })),
    isActive: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
    category: Yup.string().oneOf(["news", "interview", "feature", "review", "announcement"]),
    youtubeLinks: Yup.array().of(Yup.string().url("Must be a valid URL")),
    documents: Yup.array().of(Yup.object().shape({
      url: Yup.string().required(),
      name: Yup.string(),
      type: Yup.string(),
      size: Yup.number()
    })),
    relatedArticles: Yup.array().of(Yup.string().url("Must be a valid URL")),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.pressEditForm.loadingPress}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t.admin.pressEditForm.errorLoadingPress}</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#65a30d] hover:bg-[#528000] text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t.admin.pressEditForm.goBack}
          </button>
        </div>
      </div>
    );
  }

  if (!press) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.pressEditForm.pressNotFound}</div>
      </div>
    );
  }

  const initialValues = {
    title: press.title || "",
    summary: press.summary || "",
    content: press.content || "",
    author: press.author || "",
    publication: press.publication || "",
    publishDate: press.publishDate ? new Date(press.publishDate).toISOString().split('T')[0] : "",
    url: press.url || "",
    image: Array.isArray(press.image) && press.image.length > 0 ? press.image.map(img => 
      typeof img === 'string' ? { url: img, name: 'Image', type: 'image/*', size: 0 } : img
    ) : [],
    isActive: press.isActive ?? true,
    tags: Array.isArray(press.tags) && press.tags.length > 0 ? press.tags : [],
    category: press.category || "",
    youtubeLinks: Array.isArray(press.youtubeLinks) && press.youtubeLinks.length > 0 ? press.youtubeLinks : [],
    documents: Array.isArray(press.documents) && press.documents.length > 0 ? press.documents.map(doc => 
      typeof doc === 'string' ? { url: doc, name: 'Document', type: 'application/pdf', size: 0 } : doc
    ) : [],
    relatedArticles: Array.isArray(press.relatedArticles) && press.relatedArticles.length > 0 ? press.relatedArticles : [],
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage="Press" />
      <div className="container mx-auto px-6 py-8 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{t.admin.pressEditForm.editPress}</h1>
              <p className="text-xl text-gray-400">{t.admin.pressEditForm.updatePressInfo}</p>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
              <span className="text-green-400">{t.admin.pressEditForm.pressUpdated}</span>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-400">{t.admin.pressEditForm.errorUpdating}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={async (values, { setSubmitting }) => {
            setIsSubmitting(true);
            setSubmitStatus(null);
            try {
              const dataToSend = {
                ...values,
                tags: values.tags ? values.tags.map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
                youtubeLinks: values.youtubeLinks ? values.youtubeLinks.map(link => link.trim()).filter(link => link.length > 0) : [],
                documents: values.documents ? values.documents.map(doc => doc.url).filter(doc => doc.length > 0) : [],
                relatedArticles: values.relatedArticles ? values.relatedArticles.map(article => article.trim()).filter(article => article.length > 0) : [],
                image: values.image ? values.image.map(img => img.url).filter(img => img.length > 0) : [],
              };
              
                             await dispatch(updatePress({ id: press._id || pressId, data: dataToSend })).unwrap();
              setSubmitStatus("success");
              setTimeout(() => {
                router.push("/admin/press");
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.pressEditForm.basicInformation}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label={t.admin.pressEditForm.title} name="title" required placeholder={t.admin.pressEditForm.titlePlaceholder} />
                  <FormInput label={t.admin.pressEditForm.author} name="author" required placeholder={t.admin.pressEditForm.authorPlaceholder} />
                  <FormInput label={t.admin.pressEditForm.publication} name="publication" required placeholder={t.admin.pressEditForm.publicationPlaceholder} />
                  <FormInput label={t.admin.pressEditForm.publishDate} name="publishDate" type="date" required />
                  <FormInput label={t.admin.pressEditForm.url} name="url" placeholder={t.admin.pressEditForm.urlPlaceholder} />
                  <FormSelect label={t.admin.pressEditForm.category} name="category" required t={t} options={[
                    { value: "news", label: t.admin.pressEditForm.categoryOptions.news },
                    { value: "interview", label: t.admin.pressEditForm.categoryOptions.interview },
                    { value: "feature", label: t.admin.pressEditForm.categoryOptions.feature },
                    { value: "review", label: t.admin.pressEditForm.categoryOptions.review },
                    { value: "announcement", label: t.admin.pressEditForm.categoryOptions.announcement },
                  ]} />
                  <div className="flex items-center space-x-2 mt-4">
                    <label className="text-white text-sm">{t.admin.pressEditForm.active}</label>
                    <Field type="checkbox" name="isActive" className="h-5 w-5 text-[#65a30d]" />
                  </div>
                </div>
                <div className="mt-6">
                  <FormTextarea label={t.admin.pressEditForm.summary} name="summary" rows={3} required placeholder={t.admin.pressEditForm.summaryPlaceholder} />
                  <FormTextarea label={t.admin.pressEditForm.content} name="content" rows={8} required placeholder={t.admin.pressEditForm.contentPlaceholder} />
                </div>
                <div className="mt-6">
                  <DynamicList label={t.admin.pressEditForm.tags} name="tags" formik={formik} placeholder={t.admin.pressEditForm.tagsPlaceholder} t={t} />
                </div>
                <div className="mt-6">
                  <FileUpload label={t.admin.pressEditForm.imageFiles} name="image" accept="image/*" formik={formik} multiple={true} t={t} />
                </div>
                <div className="mt-6">
                  <DynamicList label={t.admin.pressEditForm.youtubeLinks} name="youtubeLinks" formik={formik} placeholder={t.admin.pressEditForm.youtubeLinksPlaceholder} t={t} />
                </div>
                <div className="mt-6">
                  <FileUpload label={t.admin.pressEditForm.documentFiles} name="documents" accept=".pdf,.doc,.docx,.txt" formik={formik} multiple={true} t={t} />
                </div>
                <div className="mt-6">
                  <DynamicList label={t.admin.pressEditForm.relatedArticles} name="relatedArticles" formik={formik} placeholder={t.admin.pressEditForm.relatedArticlesPlaceholder} t={t} />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end space-x-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">{t.admin.pressEditForm.cancel}</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#528000] text-white rounded-lg transition-colors disabled:opacity-50">
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? t.admin.pressEditForm.updating : t.admin.pressEditForm.updatePress}</span>
                </button>
              </motion.div>
              {/* Debug Info */}
              <div className="mt-4 text-sm text-gray-400">
                <div>Form Valid: {formik.isValid ? 'Yes' : 'No'}</div>
                <div>Form Dirty: {formik.dirty ? 'Yes' : 'No'}</div>
                <div>Errors: {Object.keys(formik.errors).length}</div>
                {Object.keys(formik.errors).length > 0 && (
                  <div className="text-red-400 mt-2">
                    {Object.entries(formik.errors).map(([key, value]) => (
                      <div key={key}>{key}: {value}</div>
                    ))}
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 