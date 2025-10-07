#!/bin/bash

# Docker deployment script for qpdf application

set -e

echo "🚀 Deploying qpdf application..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

# Create necessary directories
mkdir -p tmp logs ssl

# Set proper permissions
chmod 755 tmp logs

echo "📦 Building and starting services..."

# Build and start services
if [ "$1" = "--prod" ]; then
    echo "🏭 Starting production deployment..."
    docker-compose -f docker-compose.prod.yml up --build -d
else
    echo "🔧 Starting development deployment..."
    docker-compose up --build -d
fi

echo "✅ Deployment complete!"

# Show running containers
echo "📊 Running containers:"
docker-compose ps

echo "🌐 Application is available at:"
echo "   - Direct: http://localhost:3000"
echo "   - Via Nginx: http://localhost:80"

echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - Health check: curl http://localhost:3000/api/health"
