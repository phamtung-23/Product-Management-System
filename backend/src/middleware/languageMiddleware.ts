import { Request, Response, NextFunction } from 'express';

export const languageDetector = (req: Request, res: Response, next: NextFunction) => {
  // Default language is English
  let language = 'en';
  
  // Check if Accept-Language header exists
  const acceptLanguage = req.headers['Accept-Language'];
  
  if (acceptLanguage) {
    // If vi (Vietnamese) is preferred, use it
    if (acceptLanguage.includes('vi')) {
      language = 'vi';
    }
  }
  
  // Add language to request for use in controllers
  req.language = language;
  
  next();
};

// Extend Express Request interface to include language property
declare global {
  namespace Express {
    interface Request {
      language: string;
    }
  }
}
