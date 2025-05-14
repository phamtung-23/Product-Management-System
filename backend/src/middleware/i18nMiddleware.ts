import { RequestHandler } from 'express';
import i18next from 'i18next';

// Extend Express Request interface to include the t function and language
declare global {
  namespace Express {
    interface Request {
      t: (key: string, options?: any) => string;
      language: string;
    }
  }
}

export const i18nMiddleware: RequestHandler = (req, res, next) => {
  // Add the t function to the request
  req.t = i18next.t.bind(i18next);
  
  // Default language is English
  let language = 'en';
  
  // Check if Accept-Language header exists
  const acceptLanguage = req.headers['accept-language'];
  
  if (acceptLanguage) {
    // If vi (Vietnamese) is preferred, use it
    if (acceptLanguage.includes('vi')) {
      language = 'vi';
    }
  }
  
  // Add language to request for use in controllers
  req.language = language;
  
  // Change i18next instance language
  i18next.changeLanguage(language);
  
  next();
};
