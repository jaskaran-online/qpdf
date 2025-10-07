# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install qpdf and other dependencies
RUN apk add --no-cache \
    qpdf \
    dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create temp directories for PDF processing
RUN mkdir -p /tmp/pdf-protect /tmp/pdf-unprotect

# Set proper permissions
RUN chmod 755 /tmp/pdf-protect /tmp/pdf-unprotect

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["pnpm", "dev"]
