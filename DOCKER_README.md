# Docker Setup for Nojan Project

This Docker setup automatically installs and configures MongoDB, Node.js, and all required packages for the Nojan project.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd nojan
   ```

2. **Start all services:**

   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## Services

### MongoDB

- **Container:** `nojan-mongodb`
- **Port:** 27017
- **Database:** `nojan`
- **Root User:** admin/password
- **App User:** nojan_user/nojan_password

### Backend (Node.js/Express)

- **Container:** `nojan-backend`
- **Port:** 3001
- **Framework:** Express.js
- **Database:** MongoDB

### Frontend (Next.js)

- **Container:** `nojan-frontend`
- **Port:** 3000
- **Framework:** Next.js
- **Build:** Production build

## Docker Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Rebuild services

```bash
# Rebuild all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Access containers

```bash
# Backend container
docker exec -it nojan-backend sh

# Frontend container
docker exec -it nojan-frontend sh

# MongoDB container
docker exec -it nojan-mongodb mongosh
```

## Environment Variables

### Backend Environment

- `NODE_ENV`: production
- `MONGODB_URI`: mongodb://admin:password@mongodb:27017/nojan?authSource=admin

### Frontend Environment

- `NODE_ENV`: production
- `NEXT_PUBLIC_API_URL`: http://localhost:3001

## Data Persistence

MongoDB data is persisted using Docker volumes:

- Volume: `mongodb_data`
- Location: `/data/db` (inside container)

## Network

All services communicate through a custom bridge network:

- Network: `nojan-network`
- Type: bridge

## Health Checks

Each service includes health checks:

- Backend: Checks HTTP response on port 3001
- Frontend: Checks HTTP response on port 3000

## Troubleshooting

### Port conflicts

If ports 3000, 3001, or 27017 are already in use, modify the `docker-compose.yml` file to use different ports.

### Permission issues

The containers run as non-root users for security. If you encounter permission issues, check file ownership.

### MongoDB connection issues

Ensure the MongoDB container is fully started before the backend tries to connect. The `depends_on` directive handles this automatically.

### Build issues

If you encounter build issues:

1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`

## Development vs Production

This setup is configured for production use. For development:

1. Use volume mounts for live code changes
2. Set `NODE_ENV=development`
3. Use `nodemon` for backend auto-restart
4. Use Next.js dev mode for frontend

## Security Notes

- MongoDB is configured with authentication
- Containers run as non-root users
- Network is isolated using custom bridge
- Environment variables are used for sensitive data

## Backup and Restore

### Backup MongoDB data

```bash
docker exec nojan-mongodb mongodump --out /data/backup
docker cp nojan-mongodb:/data/backup ./backup
```

### Restore MongoDB data

```bash
docker cp ./backup nojan-mongodb:/data/
docker exec nojan-mongodb mongorestore /data/backup
```
