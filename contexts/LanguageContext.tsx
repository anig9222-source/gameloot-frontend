import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from './../utils/storage';
import translations from '../translations';

type Language = 'en' | 'sq' | 'es' | 'fr' | 'de' | 'it' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const availableLanguages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'sq' as Language, name: 'Shqip', flag: '🇦🇱' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  ];

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await storage.getItem('app_language');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await storage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
