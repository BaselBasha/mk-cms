"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateCareer, fetchCareerById } from "@/redux/careersSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";


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

const FormSelect = ({ label, name, options, required = false, ...props }) => (
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
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
);

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
          <span>Add {label}</span>
        </button>
      </div>
    </div>
  );
};

export default function EditCareerPage({ params }) {
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
          setCareer(result);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCareerId();
  }, [dispatch, params]);

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
        <div className="text-white text-xl">Loading career...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Career</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Career not found</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Edit Career</h1>
                <p className="text-gray-400">Update career information</p>
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
              // Get the career ID from the resolved params
              const resolvedParams = params?.then ? await params : params;
              const careerId = resolvedParams?.id;
              
              await dispatch(updateCareer({ id: careerId, data: values })).unwrap();
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
                <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Job Title"
                    name="title"
                    required
                    placeholder="Enter job title"
                  />
                  <FormSelect
                    label="Department"
                    name="department"
                    required
                    options={[
                      { value: "Engineering", label: "Engineering" },
                      { value: "Sales", label: "Sales" },
                      { value: "Marketing", label: "Marketing" },
                      { value: "Operations", label: "Operations" },
                      { value: "Finance", label: "Finance" },
                      { value: "HR", label: "HR" },
                      { value: "IT", label: "IT" },
                      { value: "Research & Development", label: "Research & Development" },
                      { value: "Quality Assurance", label: "Quality Assurance" },
                      { value: "Supply Chain", label: "Supply Chain" },
                    ]}
                  />
                  <FormInput
                    label="Job Summary"
                    name="summary"
                    required
                    placeholder="Brief job summary"
                  />
                  <FormInput
                    label="Location"
                    name="location"
                    required
                    placeholder="Enter job location"
                  />
                  <FormSelect
                    label="Job Type"
                    name="type"
                    required
                    options={[
                      { value: "Full-time", label: "Full Time" },
                      { value: "Part-time", label: "Part Time" },
                      { value: "Contract", label: "Contract" },
                      { value: "Internship", label: "Internship" },
                      { value: "Remote", label: "Remote" },
                    ]}
                  />
                  <FormSelect
                    label="Experience Level"
                    name="experience"
                    required
                    options={[
                      { value: "Entry Level", label: "Entry Level" },
                      { value: "Junior", label: "Junior" },
                      { value: "Mid Level", label: "Mid Level" },
                      { value: "Senior", label: "Senior" },
                      { value: "Executive", label: "Executive" },
                    ]}
                  />
                  <FormInput
                    label="Salary"
                    name="salary"
                    placeholder="e.g., $50,000 - $70,000"
                  />
                  <FormInput
                    label="Application Deadline"
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
                      Active Position
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
                <h2 className="text-xl font-semibold text-white mb-6">Job Description</h2>
                <div className="space-y-6">
                  <FormInput
                    label="Job Description"
                    name="description"
                    as="textarea"
                    rows={6}
                    required
                    placeholder="Detailed job description"
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
                <h2 className="text-xl font-semibold text-white mb-6">Requirements</h2>
                <div className="space-y-6">
                  <DynamicList
                    label="Requirements"
                    name="requirements"
                    formik={{ values, setFieldValue }}
                    placeholder="Enter requirement"
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
                <h2 className="text-xl font-semibold text-white mb-6">Responsibilities</h2>
                <div className="space-y-6">
                  <DynamicList
                    label="Responsibilities"
                    name="responsibilities"
                    formik={{ values, setFieldValue }}
                    placeholder="Enter responsibility"
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
                <h2 className="text-xl font-semibold text-white mb-6">Benefits</h2>
                <div className="space-y-6">
                  <DynamicList
                    label="Benefits"
                    name="benefits"
                    formik={{ values, setFieldValue }}
                    placeholder="Enter benefit"
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
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? "Updating..." : "Update Career"}</span>
                </button>
              </motion.div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-600/20 border border-green-500/50 text-green-400 p-4 rounded-lg"
                >
                  Career updated successfully! Redirecting...
                </motion.div>
              )}
              
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-lg"
                >
                  Failed to update career. Please try again.
                </motion.div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 