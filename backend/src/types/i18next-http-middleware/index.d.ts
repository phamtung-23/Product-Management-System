declare module 'i18next-http-middleware' {
  import { RequestHandler } from 'express';
  
  export const LanguageDetector: any;
  
  export function handle(i18next: any, options?: any): RequestHandler;
  
  export default {
    LanguageDetector,
    handle
  };
}
