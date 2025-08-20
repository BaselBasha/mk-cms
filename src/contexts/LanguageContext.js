"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    setIsRTL(savedLanguage === 'ar');
    
    // Update document direction
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;

    // Provide a reactive subscription for components that need to reload data
    const handler = (e) => {
      const lang = e.detail?.language;
      if (lang) {
        setLanguage(lang);
        setIsRTL(lang === 'ar');
      }
    };
    window.addEventListener('app-language-changed', handler);
    return () => window.removeEventListener('app-language-changed', handler);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setIsRTL(newLanguage === 'ar');

    // Save to localStorage
    localStorage.setItem('language', newLanguage);

    // Update document direction and language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;

    // Notify rest of app to re-fetch/re-render without manual refresh
    // Consumers can listen to this event or we can trigger a lightweight hash change
    window.dispatchEvent(new CustomEvent('app-language-changed', { detail: { language: newLanguage } }));
  };

  const value = {
    language,
    isRTL,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

