#!/bin/bash

# Nojan Project Docker Startup Script

echo "🚀 Starting Nojan Project with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "📦 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Services are starting up!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   MongoDB: localhost:27017"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "🎉 Setup complete! Your Nojan project is now running with Docker." 