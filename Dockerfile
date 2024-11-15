# Multi-stage build for optimized Docker image

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY test/ ./test/

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies and system tools for performance monitoring
RUN apk add --no-cache \
    curl \
    htop \
    && npm install -g pm2

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy additional configuration files
COPY .env* ./
COPY jest.config.js ./
COPY load-test/ ./load-test/

# Expose application port
EXPOSE 3000

# Performance monitoring environment variables
ENV NODE_ENV=production
ENV PM2_METRICS_API_KEY=${PM2_METRICS_API_KEY}

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use PM2 for process management and monitoring
CMD ["pm2-runtime", "start", "dist/main.js", "--env", "production"]

# Labels for metadata and traceability
LABEL maintainer="Performance Monitoring Team"
LABEL version="1.0.0"
LABEL description="Performance Monitoring Demo NestJS Application"
