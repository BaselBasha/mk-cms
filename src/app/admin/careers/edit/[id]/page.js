"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateCareer, fetchCareerById } from "@/redux/careersSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
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
          <div key={`${name}-${index}`} className="flex items-center space-x-2">
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
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <span>+</span>
          <span>{t.admin.careerEditForm.addItem.replace('{item}', label)}</span>
        </button>
      </div>
    </div>
  );
};

export default function EditCareerPage({ params }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const dispatch = useDispatch();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const getCareerId = async () => {
      try {
        // Handle params as Promise in Next.js 15+
        const resolvedParams = params?.then ? await params : params;
        const id = resolvedParams?.id;
        
        if (id) {
          const result = await dispatch(fetchCareerById(id)).unwrap();
          console.log('Fetched career:', result);
          console.log('Career language:', result.lang);
          console.log('Current UI language:', language);
          setCareer(result);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCareerId();
  }, [dispatch, params, language]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    summary: Yup.string().required("Summary is required"),
    description: Yup.string().required("Description is required"),
    location: Yup.string().required("Location is required"),
    type: Yup.string().required("Type is required"),
    experience: Yup.string().required("Experience is required"),
    department: Yup.string().required("Department is required"),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.careerEditForm.loadingCareer}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t.admin.careerEditForm.errorLoadingCareer}</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t.admin.careerEditForm.goBack}
          </button>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{t.admin.careerEditForm.careerNotFound}</div>
      </div>
    );
  }

  const initialValues = {
    title: career?.title || "",
    summary: career?.summary || "",
    description: career?.description || "",
    location: career?.location || "",
    type: career?.type || "",
    experience: career?.experience || "",
    department: career?.department || "",
    salary: typeof career?.salary === 'object' 
      ? `${career.salary.min || ''} - ${career.salary.max || ''} ${career.salary.currency || ''}`
      : career?.salary || "",
    applicationDeadline: career?.applicationDeadline ? new Date(career.applicationDeadline).toISOString().split('T')[0] : "",
    requirements: Array.isArray(career?.requirements) ? career.requirements : [],
    responsibilities: Array.isArray(career?.responsibilities) ? career.responsibilities : [],
    benefits: Array.isArray(career?.benefits) ? career.benefits : [],
    isActive: career?.isActive !== undefined ? career.isActive : true,
  };

  // Helper function to map English values to Arabic values for the form
  const mapEnglishToArabic = (value, field) => {
    if (language === 'ar') {
      const mappings = {
        department: {
          'Engineering': 'الهندسة',
          'Sales': 'المبيعات',
          'Marketing': 'التسويق',
          'Operations': 'العمليات',
          'Finance': 'المالية',
          'HR': 'الموارد البشرية',
          'IT': 'تقنية المعلومات',
          'Research & Development': 'البحث والتطوير',
          'Quality Assurance': 'ضمان الجودة',
          'Supply Chain': 'سلسلة التوريد'
        },
        type: {
          'Full-time': 'دوام كامل',
          'Part-time': 'دوام جزئي',
          'Contract': 'عقد',
          'Internship': 'تدريب',
          'Remote': 'عن بُعد'
        },
        experience: {
          'Entry Level': 'جديد',
          'Junior': 'مبتدئ متقدم',
          'Mid Level': 'متوسط',
          'Senior': 'خبير',
          'Executive': 'تنفيذي'
        }
      };
      return mappings[field]?.[value] || value;
    }
    return value;
  };

  // Helper function to map Arabic values to English values for the form
  const mapArabicToEnglish = (value, field) => {
    if (language === 'en') {
      const mappings = {
        department: {
          'الهندسة': 'Engineering',
          'المبيعات': 'Sales',
          'التسويق': 'Marketing',
          'العمليات': 'Operations',
          'المالية': 'Finance',
          'الموارد البشرية': 'HR',
          'تقنية المعلومات': 'IT',
          'البحث والتطوير': 'Research & Development',
          'ضمان الجودة': 'Quality Assurance',
          'سلسلة التوريد': 'Supply Chain'
        },
        type: {
          'دوام كامل': 'Full-time',
          'دوام جزئي': 'Part-time',
          'عقد': 'Contract',
          'تدريب': 'Internship',
          'عن بُعد': 'Remote'
        },
        experience: {
          'جديد': 'Entry Level',
          'مبتدئ متقدم': 'Junior',
          'متوسط': 'Mid Level',
          'خبير': 'Senior',
          'تنفيذي': 'Executive'
        }
      };
      return mappings[field]?.[value] || value;
    }
    return value;
  };

  // Map the initial values based on the current language
  const mappedInitialValues = {
    ...initialValues,
    // If the career is in Arabic and we're editing in Arabic, keep Arabic values
    // If the career is in English and we're editing in English, keep English values
    // Otherwise, map between languages
    department: career?.lang === language ? initialValues.department : 
                (language === 'ar' ? mapEnglishToArabic(initialValues.department, 'department') : 
                 mapArabicToEnglish(initialValues.department, 'department')),
    type: career?.lang === language ? initialValues.type : 
          (language === 'ar' ? mapEnglishToArabic(initialValues.type, 'type') : 
           mapArabicToEnglish(initialValues.type, 'type')),
    experience: career?.lang === language ? initialValues.experience : 
               (language === 'ar' ? mapEnglishToArabic(initialValues.experience, 'experience') : 
                mapArabicToEnglish(initialValues.experience, 'experience')),
  };

  console.log('Career data:', career);
  console.log('Initial values:', initialValues);
  console.log('Mapped initial values:', mappedInitialValues);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AdminHeader currentPage="Careers" />
      
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
                <span>{t.admin.careerEditForm.back}</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t.admin.careerEditForm.editCareer}</h1>
                <p className="text-gray-400">{t.admin.careerEditForm.updateCareerInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8">
        <Formik
          initialValues={mappedInitialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            try {
              console.log('Form values:', values);
              
              // Map the form values to the correct language for the API
              const mappedValues = {
                ...values,
                department: mapEnglishToArabic(values.department, 'department'),
                type: mapEnglishToArabic(values.type, 'type'),
                experience: mapEnglishToArabic(values.experience, 'experience'),
                lang: language // Ensure the language is set correctly
              };
              
              console.log('Mapped values for API:', mappedValues);
              
              // Get the career ID from the resolved params
              const resolvedParams = params?.then ? await params : params;
              const careerId = resolvedParams?.id;
              
              await dispatch(updateCareer({ id: careerId, data: mappedValues, lang: language })).unwrap();
              setSubmitStatus("success");
              setTimeout(() => {
                router.push("/admin/careers");
              }, 2000);
            } catch (error) {
              setSubmitStatus("error");
              console.error("Update error:", error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="max-w-4xl mx-auto space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.careerEditForm.basicInformation}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label={t.admin.careerEditForm.jobTitle}
                    name="title"
                    required
                    placeholder={t.admin.careerEditForm.titlePlaceholder}
                  />
                  <FormSelect
                    label={t.admin.careerEditForm.department}
                    name="department"
                    required
                    t={t}
                    options={
                      language === 'ar' ? [
                        { value: "الهندسة", label: t.admin.careerEditForm.departmentOptions.engineering },
                        { value: "المبيعات", label: t.admin.careerEditForm.departmentOptions.sales },
                        { value: "التسويق", label: t.admin.careerEditForm.departmentOptions.marketing },
                        { value: "العمليات", label: t.admin.careerEditForm.departmentOptions.operations },
                        { value: "المالية", label: t.admin.careerEditForm.departmentOptions.finance },
                        { value: "الموارد البشرية", label: t.admin.careerEditForm.departmentOptions.hr },
                        { value: "تقنية المعلومات", label: t.admin.careerEditForm.departmentOptions.it },
                        { value: "البحث والتطوير", label: t.admin.careerEditForm.departmentOptions.researchDevelopment },
                        { value: "ضمان الجودة", label: t.admin.careerEditForm.departmentOptions.qualityAssurance },
                        { value: "سلسلة التوريد", label: t.admin.careerEditForm.departmentOptions.supplyChain },
                      ] : [
                        { value: "Engineering", label: t.admin.careerEditForm.departmentOptions.engineering },
                        { value: "Sales", label: t.admin.careerEditForm.departmentOptions.sales },
                        { value: "Marketing", label: t.admin.careerEditForm.departmentOptions.marketing },
                        { value: "Operations", label: t.admin.careerEditForm.departmentOptions.operations },
                        { value: "Finance", label: t.admin.careerEditForm.departmentOptions.finance },
                        { value: "HR", label: t.admin.careerEditForm.departmentOptions.hr },
                        { value: "IT", label: t.admin.careerEditForm.departmentOptions.it },
                        { value: "Research & Development", label: t.admin.careerEditForm.departmentOptions.researchDevelopment },
                        { value: "Quality Assurance", label: t.admin.careerEditForm.departmentOptions.qualityAssurance },
                        { value: "Supply Chain", label: t.admin.careerEditForm.departmentOptions.supplyChain },
                      ]
                    }
                  />
                  <FormInput
                    label={t.admin.careerEditForm.jobSummary}
                    name="summary"
                    required
                    placeholder={t.admin.careerEditForm.summaryPlaceholder}
                  />
                  <FormInput
                    label={t.admin.careerEditForm.location}
                    name="location"
                    required
                    placeholder={t.admin.careerEditForm.locationPlaceholder}
                  />
                  <FormSelect
                    label={t.admin.careerEditForm.jobType}
                    name="type"
                    required
                    t={t}
                    options={
                      language === 'ar' ? [
                        { value: "دوام كامل", label: t.admin.careerEditForm.jobTypeOptions.fullTime },
                        { value: "دوام جزئي", label: t.admin.careerEditForm.jobTypeOptions.partTime },
                        { value: "عقد", label: t.admin.careerEditForm.jobTypeOptions.contract },
                        { value: "تدريب", label: t.admin.careerEditForm.jobTypeOptions.internship },
                        { value: "عن بُعد", label: t.admin.careerEditForm.jobTypeOptions.remote },
                      ] : [
                        { value: "Full-time", label: t.admin.careerEditForm.jobTypeOptions.fullTime },
                        { value: "Part-time", label: t.admin.careerEditForm.jobTypeOptions.partTime },
                        { value: "Contract", label: t.admin.careerEditForm.jobTypeOptions.contract },
                        { value: "Internship", label: t.admin.careerEditForm.jobTypeOptions.internship },
                        { value: "Remote", label: t.admin.careerEditForm.jobTypeOptions.remote },
                      ]
                    }
                  />
                  <FormSelect
                    label={t.admin.careerEditForm.experienceLevel}
                    name="experience"
                    required
                    t={t}
                    options={
                      language === 'ar' ? [
                        { value: "جديد", label: t.admin.careerEditForm.experienceLevelOptions.entryLevel },
                        { value: "مبتدئ متقدم", label: t.admin.careerEditForm.experienceLevelOptions.junior },
                        { value: "متوسط", label: t.admin.careerEditForm.experienceLevelOptions.midLevel },
                        { value: "خبير", label: t.admin.careerEditForm.experienceLevelOptions.senior },
                        { value: "تنفيذي", label: t.admin.careerEditForm.experienceLevelOptions.executive },
                      ] : [
                        { value: "Entry Level", label: t.admin.careerEditForm.experienceLevelOptions.entryLevel },
                        { value: "Junior", label: t.admin.careerEditForm.experienceLevelOptions.junior },
                        { value: "Mid Level", label: t.admin.careerEditForm.experienceLevelOptions.midLevel },
                        { value: "Senior", label: t.admin.careerEditForm.experienceLevelOptions.senior },
                        { value: "Executive", label: t.admin.careerEditForm.experienceLevelOptions.executive },
                      ]
                    }
                  />
                  <FormInput
                    label={t.admin.careerEditForm.salary}
                    name="salary"
                    placeholder={t.admin.careerEditForm.salaryPlaceholder}
                  />
                  <FormInput
                    label={t.admin.careerEditForm.applicationDeadline}
                    name="applicationDeadline"
                    type="date"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={values.isActive}
                      onChange={(e) => {
                        setFieldValue('isActive', e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-white">
                      {t.admin.careerEditForm.activePosition}
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.careerEditForm.jobDescription}</h2>
                <div className="space-y-6">
                  <FormInput
                    label={t.admin.careerEditForm.description}
                    name="description"
                    as="textarea"
                    rows={6}
                    required
                    placeholder={t.admin.careerEditForm.descriptionPlaceholder}
                  />
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.careerEditForm.requirements}</h2>
                <div className="space-y-6">
                  <DynamicList
                    label={t.admin.careerEditForm.requirementsLabel}
                    name="requirements"
                    formik={{ values, setFieldValue }}
                    placeholder={t.admin.careerEditForm.requirementsPlaceholder}
                    t={t}
                  />
                </div>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.careerEditForm.responsibilities}</h2>
                <div className="space-y-6">
                  <DynamicList
                    label={t.admin.careerEditForm.responsibilitiesLabel}
                    name="responsibilities"
                    formik={{ values, setFieldValue }}
                    placeholder={t.admin.careerEditForm.responsibilitiesPlaceholder}
                    t={t}
                  />
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">{t.admin.careerEditForm.benefits}</h2>
                <div className="space-y-6">
                  <DynamicList
                    label={t.admin.careerEditForm.benefitsLabel}
                    name="benefits"
                    formik={{ values, setFieldValue }}
                    placeholder={t.admin.careerEditForm.benefitsPlaceholder}
                    t={t}
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  {t.admin.careerEditForm.cancel}
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? t.admin.careerEditForm.updating : t.admin.careerEditForm.updateCareer}</span>
                </button>
              </motion.div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-600/20 border border-green-500/50 text-green-400 p-4 rounded-lg"
                >
                  {t.admin.careerEditForm.careerUpdated}
                </motion.div>
              )}
              
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-lg"
                >
                  {t.admin.careerEditForm.errorUpdating}
                </motion.div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 