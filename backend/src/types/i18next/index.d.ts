declare module 'i18next' {
  export interface TFunction {
    (key: string | string[], options?: any): string;
    (key: string | string[], defaultValue: string, options?: any): string;
  }

  export function t(key: string | string[], options?: any): string;
  export function t(key: string | string[], defaultValue: string, options?: any): string;
  
  export function changeLanguage(lng: string, callback?: (err: any, t: TFunction) => void): Promise<TFunction>;
  
  export function use(module: any): any;
  
  export function init(options: any): Promise<TFunction>;
  
  const i18next: {
    t: typeof t;
    changeLanguage: typeof changeLanguage;
    use: typeof use;
    init: typeof init;
  };
  
  export default i18next;
}