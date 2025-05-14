FROM node:20-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g typescript ts-node

# Copy package files
COPY backend/package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy tsconfig.json for TypeScript compilation
COPY backend/tsconfig.json ./

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]