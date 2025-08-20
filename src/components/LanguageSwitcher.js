"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 hover:bg-white/20 transition-all duration-300 text-gray-300 hover:text-white"
      title={language === 'en' ? t.language.switchToArabic : t.language.switchToEnglish}
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {language === 'en' ? t.language.english : t.language.arabic}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

