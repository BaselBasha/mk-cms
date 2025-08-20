"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, User, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadCV } from '../../shared/uploadCV';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';

const ApplicationModal = ({ isOpen, onClose, job }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    applicantName: '',
    cvFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setSubmitStatus({
          type: 'error',
          message: t.careers.modal.fileTypeError
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitStatus({
          type: 'error',
          message: t.careers.modal.fileSizeError
        });
        return;
      }

      setFormData({
        ...formData,
        cvFile: file
      });
      setSubmitStatus(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.applicantName.trim() || !formData.cvFile) {
      setSubmitStatus({
        type: 'error',
        message: t.careers.modal.validationError
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('Job object:', job);
      console.log('Job ID:', job._id || job.id);
      const result = await uploadCV(formData.cvFile, job._id || job.id, formData.applicantName.trim());
      
      setSubmitStatus({
        type: 'success',
        message: t.careers.modal.applicationSuccess
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ applicantName: '', cvFile: null });
        setSubmitStatus(null);
        onClose();
      }, 3000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || t.careers.modal.applicationError
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ applicantName: '', cvFile: null });
      setSubmitStatus(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#65a30d] to-[#84cc16] rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.careers.modal.title}</h2>
                <p className="text-sm text-gray-400">{job.title}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t.careers.modal.fullName}
              </label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                placeholder={t.careers.modal.fullNamePlaceholder}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all duration-300"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                {t.careers.modal.cvResume}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-[#65a30d] bg-[#65a30d]/10'
                    : formData.cvFile
                    ? 'border-[#65a30d] bg-[#65a30d]/5'
                    : 'border-white/20 hover:border-white/40'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.cvFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 text-[#65a30d] mx-auto" />
                    <p className="text-white font-medium">{formData.cvFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cvFile: null })}
                      disabled={isSubmitting}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
                    >
                      {t.careers.modal.removeFile}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-white font-medium">{t.careers.modal.dropCV}</p>
                      <p className="text-sm text-gray-400">{t.careers.modal.orClickToBrowse}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t.careers.modal.fileTypes}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  submitStatus.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{submitStatus.message}</span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.applicantName.trim() || !formData.cvFile}
              className="w-full bg-gradient-to-r from-[#65a30d] to-[#84cc16] text-white py-3 px-6 rounded-lg font-medium hover:from-[#528000] hover:to-[#65a30d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.careers.modal.submitting}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{t.careers.modal.submitApplication}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationModal;
