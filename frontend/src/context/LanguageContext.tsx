import React, { createContext, useState, useContext, useEffect } from 'react';

// Languages supported by the application
export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations for common UI elements
// In a real application, you might want to use a library like i18next
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'Product Management',
    'nav.products': 'Products',
    'nav.addProduct': 'Add Product',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.language': 'Language',
    'search.placeholder': 'Search products...',
    'product.price': 'Price',
    'product.category': 'Category',
    'product.subcategory': 'Subcategory',
    'product.likes': 'Likes',
    'product.like': 'Like',
    'product.liked': 'Liked',
    'product.create': 'Create Product',
    'form.name': 'Name',
    'form.price': 'Price',
    'form.category': 'Category',
    'form.subcategory': 'Subcategory',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'page.next': 'Next',
    'page.previous': 'Previous',
  },
  vi: {
    'app.title': 'Quản Lý Sản Phẩm',
    'nav.products': 'Sản Phẩm',
    'nav.addProduct': 'Thêm Sản Phẩm',
    'nav.login': 'Đăng Nhập',
    'nav.register': 'Đăng Ký',
    'nav.profile': 'Hồ Sơ',
    'nav.logout': 'Đăng Xuất',
    'nav.language': 'Ngôn Ngữ',
    'search.placeholder': 'Tìm kiếm sản phẩm...',
    'product.price': 'Giá',
    'product.category': 'Danh Mục',
    'product.subcategory': 'Danh Mục Con',
    'product.likes': 'Lượt Thích',
    'product.like': 'Thích',
    'product.liked': 'Đã Thích',
    'product.create': 'Tạo Sản Phẩm',
    'form.name': 'Tên',
    'form.price': 'Giá',
    'form.category': 'Danh Mục',
    'form.subcategory': 'Danh Mục Con',
    'form.submit': 'Gửi',
    'form.cancel': 'Hủy',
    'page.next': 'Tiếp',
    'page.previous': 'Trước',
  },
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or use English as default
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'vi') ? savedLanguage : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Also update the document's lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function
  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
