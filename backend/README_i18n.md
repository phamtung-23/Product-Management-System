# Internationalization (i18n) API Documentation

This document details how to use the internationalization features in our API.

## Table of Contents

1. [Overview](#overview)
2. [Supported Languages](#supported-languages)
3. [Directory Structure](#directory-structure)
4. [Language Detection](#language-detection)
5. [Translation Files](#translation-files)
6. [Adding New Languages](#adding-new-languages)
7. [Examples](#examples)

## Overview

The API uses [i18next](https://www.i18next.com/) for internationalization to provide multilingual support. This includes:

- Dynamic language detection from HTTP headers
- Translation of API responses
- Language-aware data caching
- Support for multilingual content in database models

## Supported Languages

Currently, the API supports the following languages:

- English (en) - Default fallback language
- Vietnamese (vi)

## Directory Structure

```
backend/
├── src/
│   ├── locales/              # Translation files
│   │   ├── en/               # English translations
│   │   │   └── translation.json
│   │   └── vi/               # Vietnamese translations
│   │       └── translation.json
│   ├── middleware/
│   │   ├── i18nMiddleware.ts # i18n Express middleware
│   │   └── languageMiddleware.ts # Language detection
│   ├── services/
│   │   └── redisService.ts   # Redis with language support
│   ├── utils/
│   │   └── i18n.ts           # i18n configuration
│   └── types/
│       ├── i18next/          # Type definitions for i18next
│       ├── i18next-fs-backend/
│       └── i18next-http-middleware/
```

## Language Detection

Language is automatically detected using the following methods (in order):

1. HTTP `Accept-Language` header
2. Query parameter `lng` (e.g., `?lng=vi`)
3. Cookie named `i18next`

## Translation Files

Translation files are stored in JSON format in the `locales` directory:

### English (`en/translation.json`)

```json
{
  "welcome": "Welcome to Product Catalog API",
  "productNotFound": "Product not found",
  "productCreated": "Product created successfully",
  "serverError": "Server error",
  "allFieldsRequired": "All fields are required",
  "priceValidation": "Price must be a positive number",
  "productLiked": "Product liked successfully",
  "productUnliked": "Product unliked successfully"
}
```

### Vietnamese (`vi/translation.json`)

```json
{
  "welcome": "Chào mừng đến với API Danh mục Sản phẩm",
  "productNotFound": "Không tìm thấy sản phẩm",
  "productCreated": "Tạo sản phẩm thành công",
  "serverError": "Lỗi máy chủ",
  "allFieldsRequired": "Tất cả các trường là bắt buộc",
  "priceValidation": "Giá phải là một số dương",
  "productLiked": "Đã thích sản phẩm thành công",
  "productUnliked": "Đã bỏ thích sản phẩm thành công"
}
```

## Adding New Languages

To add a new language:

1. Create a new directory in `src/locales/` with the language code (e.g., `fr/` for French)
2. Add a `translation.json` file with translations
3. Update the `preload` array in `src/utils/i18n.ts` to include the new language code
4. Update the language detection logic in `i18nMiddleware.ts` if needed

## Examples

### API Response with Multilingual Content

Products in the database store names and categories in multiple languages:

```typescript
// Product schema
{
  name: {
    en: "Smart Watch",
    vi: "Đồng hồ thông minh"
  },
  category: {
    en: "Electronics",
    vi: "Điện tử"
  },
  // other fields...
}
```

### Making API Requests with Language Preference

To request responses in a specific language, use one of these methods:

1. Set the `Accept-Language` header:
   ```
   accept-language: vi
   ```

<!-- 2. Use the query parameter:
   ```
   GET /api/products?lng=vi
   ```

3. Set an i18next cookie:
   ```
   i18next=vi
   ``` -->
