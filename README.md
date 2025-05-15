# Project: Product API & Frontend

## Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Docker & Deployment](#docker--deployment)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Swagger API Docs](#swagger-api-docs)
  - [GraphQL](#graphql)
- [Frontend](#frontend)
  - [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Notes](#notes)

---

## Overview
This project is a full-stack application with a Node.js/TypeScript backend and a Vite + React frontend. It features JWT authentication, product management, like/unlike functionality, Redis caching, and Dockerized deployment. Optional features include multilingual support and GraphQL API.

---

## Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose
- Node.js (for local development)

### Quick Start (Recommended)
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd Product-Management-System
   ```
2. Copy and configure environment variables in the root directory:
   ```sh
   cp .env.example .env
   # Edit .env as needed
   ```
3. Start all services with Docker Compose:
   ```sh
   docker-compose up --build
   ```
4. Access the frontend at [http://localhost:3000](http://localhost:3000)
5. Access the backend API at [http://localhost:4000](http://localhost:4000)
6. Swagger API docs: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

### Local Development (without Docker)
- Backend:
  ```sh
  cd backend
  npm install
  npm run dev
  ```
- Frontend:
  ```sh
  cd frontend
  npm install
  npm run dev
  ```

---

## Environment Variables

Create a `.env` file in the root directory. Example variables:

```
# Backend environment variables
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/product-catalog
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=3600
CHOKIDAR_USEPOLLING=true

# Frontend environment variables
VITE_API_URL=http://localhost:3000
```

---

## Docker & Deployment
- The project uses `docker-compose` to orchestrate:
  - Backend (Node.js/TypeScript)
  - Frontend (Vite/React)
  - MongoDB
  - Redis
- `.dockerignore` and `.env` are configured for best practices.

---

## Backend

### API Endpoints
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `GET /products` — Get paginated product list (supports `?page` & `?limit`)
- `POST /products` — Create a new product (auth required)
- `GET /products/search?q=keyword` — Search products by name
- `POST /products/:id/like` — Like/unlike a product (auth required)

#### Pagination
- Query params: `?page=1&limit=10`
- Response includes: `totalPages`, `currentPage`, `totalResults`

#### Like Feature
- Each product tracks `likesCount` and `likedBy` (user IDs)
- Like/unlike is a toggle; users cannot like more than once

#### Redis Caching
- `GET /products` results are cached by page/limit
- Cache is invalidated when products are added or liked/unliked

### Swagger API Docs
- Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for interactive API documentation and testing.

### GraphQL
- Not implemented yet. (See requirements for future support.)

---

## Frontend

### Core Features
- **Authentication:** Login/Register, JWT stored securely, protected routes
- **Product Listing:** Paginated, like count, like/unlike toggle (optimistic UI)
- **Product Search:** Search bar, dynamic results
- **Product Creation:** Authenticated users can add products
- **Pagination Controls:** Next/prev, page numbers
- **Language Switcher (optional):** English/Vietnamese, uses `Accept-Language` header
- **Cache API (optional):** Uses React Query for caching
- **GraphQL Integration (optional):** Apollo Client (if backend supports GraphQL)

---

## Tech Stack
- **Backend:** Node.js, TypeScript, Express, MongoDB, Redis, JWT, Swagger
- **Frontend:** Vite, React 18, Material UI, (optional: Tailwind CSS, Apollo Client)
- **Deployment:** Docker, Docker Compose

---

## Optimization Strategies

### Caching Implementation
This project implements Redis caching to optimize performance and reduce database load:

#### How Redis Caching Works
- **Cache Keys**: We use query parameters (`page`, `limit`) as part of the cache key
- **TTL (Time-to-Live)**: Cache entries expire after a configurable period to prevent stale data
- **Invalidation Strategy**: Cache is invalidated only when relevant data changes:
  - When a new product is created
  - When a product's like status changes

#### Caching Flow
1. Request arrives at `GET /products`
2. Middleware checks Redis cache for matching key
3. If cache hit: return cached data without database query
4. If cache miss: query database, store result in Redis, then return

#### Cache Benefits
- Reduced MongoDB load
- Faster API response times
- Improved scalability under high traffic

### Like Feature Implementation

#### Data Structure
- Products contain:
  - `likesCount`: Number of likes
  - `likedBy`: Array of user IDs who have liked the product

#### Like/Unlike Flow
1. User sends request to `POST /products/:id/like`
2. Backend checks if user has already liked the product:
   - If not liked: add user ID to `likedBy`, increment `likesCount`
   - If already liked: remove user ID from `likedBy`, decrement `likesCount`
3. Cache for product listings is invalidated to reflect new like status

### Frontend Optimization
- **Optimistic UI Updates**: Like status changes immediately in the UI before backend confirms
- **React Query Caching**: implements TanStack Query (React Query) for frontend caching
- **Error Handling**: Reverts to previous state if backend request fails

#### How React Query Works

- **Automatic Caching:** API responses are cached in memory with configurable TTL
- **Stale While Revalidate:** Returns cached data immediately while fetching fresh data in background
- **Deduplication:** Prevents multiple identical requests firing simultaneously
- **Background Refetching:** Automatically refreshes data when user refocuses the window
- **Automatic Retry:** Configurable retry logic for failed requests

#### Cache Benefits
- **Improved UX:** Instant data loading from cache
- **Reduced API Calls:** Minimizes redundant network requests
- **Lower Backend Load:** Fewer requests hitting the server
- **Offline Support:** Basic functionality when offline
- **Real-time Feel:** Optimistic updates create responsive experience

### Performance Considerations
- **Pagination**: Limits database queries to fixed-size batches
- **Indexing**: MongoDB indexes on frequently searched fields for faster queries
- **Connection Pooling**: Reuses database connections for efficiency
- **Error Handling**: Comprehensive error handling prevents cascading failures

## Thank you so much !!!
