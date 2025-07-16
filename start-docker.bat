@echo off
REM Nojan Project Docker Startup Script for Windows

echo 🚀 Starting Nojan Project with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo 📦 Building and starting services...
docker-compose up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service status
echo 🔍 Checking service status...
docker-compose ps

echo.
echo ✅ Services are starting up!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    MongoDB: localhost:27017
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs
echo    Stop services: docker-compose down
echo    Restart: docker-compose restart
echo.
echo 🎉 Setup complete! Your Nojan project is now running with Docker.
pause 