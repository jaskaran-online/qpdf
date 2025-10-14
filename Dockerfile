# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install qpdf and other dependencies
RUN apk add --no-cache \
    qpdf \
    dumb-init

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Create temp directories for PDF processing
RUN mkdir -p /tmp/pdf-protect /tmp/pdf-unprotect

# Set proper permissions
RUN chmod 755 /tmp/pdf-protect /tmp/pdf-unprotect

# Build stage for production
FROM base AS build
RUN pnpm db:generate
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install qpdf and dumb-init
RUN apk add --no-cache qpdf dumb-init

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and node_modules from base
COPY --from=base /app/package*.json /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Copy temp directories setup
COPY --from=base /tmp /tmp

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["pnpm", "start"]

# Development stage (default)
FROM base AS development

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application in development mode
CMD ["pnpm", "dev"]
