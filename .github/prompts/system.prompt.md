## Project Overview

You will build a backend API using **Node.js (Express.js)** that provides:

* Product management (CRUD, search, pagination)
* Like/Unlike functionality
* JWT-based authentication
* Redis caching for optimization
* Dockerized setup for deployment
* Optional:
  * API multilingual response support (English / Vietnamese)
  * GraphQL API (as alternative or in parallel with REST)
* **Frontend client** to interact with the API

---

## ✅ Functional Requirements

### 1. Authentication System (JWT-based)

* Users must be able to **register** and **log in**.
* Return a **JWT token** upon login.
* Protect sensitive endpoints so that only authenticated users can:
  * Add a product
  * Like or unlike a product
* Include middleware to **verify JWT tokens** for protected routes.

### 2. Product Management

* Implement the following RESTful APIs:
  * `GET /products`: Fetch paginated product list.
  * `POST /products`: Create a new product (**requires authentication**).
  * `GET /products/search?q=keyword`: Search products by name.
  * `POST /products/:id/like`: Like or unlike a product (**requires authentication**).
* A product must have the following fields:
  * Name
  * Price
  * Category
  * Subcategory

### 3. Like Feature

* Each product should maintain:
  * A **likes count**
  * A list of **user IDs who have liked** the product
* The `/like` endpoint should:
  * Allow users to **like or unlike** (toggle)
  * Prevent the same user from liking multiple times
* Update the `likes` count field accordingly.

### 4. Pagination and Search

* Support query parameters: `?page=1&limit=10`
* Return pagination metadata: total pages, current page, total results
* Implement full-text or regex-based **search** functionality for product names.

### 5. Redis Caching

* **Cache the result** of `GET /products` to reduce load on MongoDB.
* Use query params as part of the cache key (`page`, `limit`).
* **Invalidate cache** when:
  * A new product is added
  * A like/unlike action changes the product state

---

## 🧩 Optional Features (Advanced)

### 6. Multilingual API Response (English / Vietnamese)

* Modify product schema to support multilingual fields (e.g., name.en, name.vi).
* Detect the preferred language from the request's `Accept-Language` header.
* Return product data in the appropriate language.
* Default to English if the header is missing or invalid.

### 7. GraphQL API Support

* Implement a parallel GraphQL endpoint (`POST /graphql`).
* Define a schema for `Product`, `User`, `Query`, and `Mutation`.
* Replicate the same functionality as REST:
  * Query: fetch paginated products, search
  * Mutation: add product, toggle like
* Apply JWT middleware to protect mutations.
* Provide usage instructions and examples in README.

---

## 🎨 Frontend Integration (Client App)

### Tech Stack Suggestion

* **React.js**
* State management: `Redux` or `Context API`
* Routing: `react-router-dom`
* HTTP client: `axios`
* Optional: Tailwind CSS / Material UI for UI components

### Key Features

#### 1. Authentication Pages

* Login and Registration forms
* Persist JWT token using localStorage
* Use token in headers: `Authorization: Bearer <token>`

#### 2. Product Listing Page

* Fetch products from `GET /products?page=1&limit=10`
* Support pagination UI
* Display:
  * Name (based on current language)
  * Price
  * Category/Subcategory
  * Like count
  * Like button (toggles)

#### 3. Product Creation Page

* Form for adding a new product (name, price, category, subcategory)
* Only accessible to authenticated users
* Submit to `POST /products`

#### 4. Product Search Feature

* Search bar to fetch from `GET /products/search?q=keyword`

#### 5. Like Button Functionality

* On click, call `POST /products/:id/like`
* Optimistically update like count in UI
* Toggle UI state depending on if user has already liked

#### 6. Language Selector

* UI dropdown (English / Vietnamese)
* Send `Accept-Language` header in requests
* Reactively update product name/category fields

#### 7. GraphQL Support (Optional)

* If GraphQL is enabled in the backend:
  * Use Apollo Client
  * Add GraphQL queries for product list and mutations
  * Display GraphQL errors & loading state clearly

---

## ⚠️ Important Development Considerations

### Authentication & Security

* Always **hash passwords** using bcrypt before saving to the database.
* Store secrets (JWT secret, DB URI, Redis config) in a **.env** file.
* Ensure JWT tokens are properly **validated and expired** as needed.

### Data Modeling

* Keep track of **users who liked** a product to prevent duplicate likes.
* Avoid embedding too much data (use references when necessary).
* Keep product schema flexible enough for multilingual fields.

### Code Quality & Structure

* Use **modular structure** for routes, controllers, models, and services.
* Handle all errors with **proper status codes and messages**.
* Create utility functions for repeated logic (e.g., pagination calculation).

### Performance

* Use Redis to **cache product listing results** and avoid unnecessary DB queries.
* Set cache TTL (Time-to-Live) to avoid stale data.
* Invalidate the cache **only** when product data is changed.

### Docker & Deployment

* Dockerize both the application and MongoDB, Redis services.
* Use `docker-compose` to manage multi-container environment.
* Ensure `.dockerignore` and `.env` are properly configured.

---

## 📝 Summary of Deliverables

* Node.js project with clean and modular source code
* MongoDB schema and data handling
* JWT-based authentication system
* RESTful API for products and likes
* Redis caching implementation
* Optional: Multilingual support and GraphQL API
* Dockerized environment for local and production usage
* Frontend app integrated with backend (React/Next.js)
* Well-documented README file

---
