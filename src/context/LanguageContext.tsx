import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = '@jagdamb_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load persisted language choice
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLang === 'en' || savedLang === 'mr') {
          setLanguageState(savedLang);
        }
      } catch (e) {
        // Fallback to default
      }
    })();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'en' ? 'mr' : 'en';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const t = useCallback(
    (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = (dict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }
      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
