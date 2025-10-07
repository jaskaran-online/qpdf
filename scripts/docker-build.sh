#!/bin/bash

# Docker build script for qpdf application

set -e

echo "🐳 Building qpdf Docker image..."

# Build the Docker image
docker build -t qpdf-app:latest .

echo "✅ Docker image built successfully!"

# Optional: Run the container
if [ "$1" = "--run" ]; then
    echo "🚀 Starting qpdf application..."
    docker run -d \
        --name qpdf-container \
        -p 3000:3000 \
        -v $(pwd)/tmp:/tmp \
        qpdf-app:latest
    
    echo "✅ Container started! Access the app at http://localhost:3000"
    echo "📊 View logs with: docker logs qpdf-container"
    echo "🛑 Stop with: docker stop qpdf-container"
fi

echo "🎉 Build complete!"
