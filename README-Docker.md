# Docker Deployment Guide

This guide explains how to containerize and deploy the qpdf application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- At least 1GB of available RAM
- 2GB of available disk space

## Quick Start

### Development Environment

```bash
# Build and start the application
docker-compose up --build

# Or use the deployment script
./scripts/docker-deploy.sh
```

### Production Environment

```bash
# Deploy with production configuration
./scripts/docker-deploy.sh --prod

# Or manually
docker-compose -f docker-compose.prod.yml up --build -d
```

## Docker Configuration

### Dockerfile

The application uses a multi-stage Dockerfile with:

- **Base Image**: Node.js 18 Alpine (lightweight)
- **Dependencies**: qpdf, dumb-init
- **Working Directory**: `/app`
- **Package Manager**: pnpm
- **Port**: 3000

### Docker Compose Services

#### Development (`docker-compose.yml`)

- **qpdf-app**: Main application service
- **nginx**: Optional reverse proxy (use `--profile proxy`)

#### Production (`docker-compose.prod.yml`)

- **qpdf-app**: Production-optimized service with resource limits
- **nginx**: Production reverse proxy with SSL support

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `3000` |

## Volume Mounts

- `./tmp:/tmp` - Temporary PDF processing directory
- `./logs:/app/logs` - Application logs (production only)
- `./ssl:/etc/nginx/ssl` - SSL certificates (production only)

## Health Checks

The application includes health checks:

```bash
# Check application health
curl http://localhost:3000/api/health

# Check via Docker
docker-compose ps
```

## Useful Commands

### Development

```bash
# Start services
docker-compose up

# Start with logs
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Deploy production
docker-compose -f docker-compose.prod.yml up -d

# Scale application
docker-compose -f docker-compose.prod.yml up --scale qpdf-app=3

# Update application
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Maintenance

```bash
# View container logs
docker logs qpdf-container

# Execute commands in container
docker exec -it qpdf-container sh

# Clean up unused images
docker system prune

# Remove all containers and volumes
docker-compose down -v
```

## Security Considerations

### Production Deployment

1. **Use HTTPS**: Configure SSL certificates in `./ssl/` directory
2. **Resource Limits**: Set appropriate CPU and memory limits
3. **Network Security**: Use Docker networks for service isolation
4. **File Permissions**: Ensure proper permissions for temp directories

### Environment Security

```bash
# Create secure environment file
cat > .env.prod << EOF
NODE_ENV=production
PORT=3000
# Add other environment variables
EOF

# Use in production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Permission Denied**
   ```bash
   # Fix tmp directory permissions
   sudo chmod 755 tmp
   sudo chown -R $USER:$USER tmp
   ```

3. **Out of Disk Space**
   ```bash
   # Clean up Docker
   docker system prune -a
   
   # Check disk usage
   docker system df
   ```

4. **qpdf Not Found**
   ```bash
   # Check if qpdf is installed in container
   docker exec -it qpdf-container which qpdf
   
   # Rebuild with --no-cache
   docker-compose build --no-cache
   ```

### Debugging

```bash
# Access container shell
docker exec -it qpdf-container sh

# View application logs
docker-compose logs qpdf-app

# Check container resources
docker stats qpdf-container

# Inspect container
docker inspect qpdf-container
```

## Performance Optimization

### Resource Limits

```yaml
# In docker-compose.prod.yml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
    reservations:
      memory: 512M
      cpus: '0.25'
```

### Nginx Configuration

- **Client Max Body Size**: 100MB for large PDF files
- **Timeout Settings**: 60s for file processing
- **Proxy Buffering**: Optimized for file uploads

## Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Container health
docker inspect qpdf-container | grep -A 10 Health
```

### Logs

```bash
# Application logs
docker-compose logs -f qpdf-app

# All services
docker-compose logs -f

# Specific service with timestamps
docker-compose logs -f --timestamps qpdf-app
```

## Backup and Recovery

### Backup

```bash
# Backup application data
tar -czf qpdf-backup-$(date +%Y%m%d).tar.gz tmp/ logs/

# Backup Docker volumes
docker run --rm -v qpdf_tmp:/data -v $(pwd):/backup alpine tar czf /backup/tmp-backup.tar.gz -C /data .
```

### Recovery

```bash
# Restore from backup
tar -xzf qpdf-backup-20231201.tar.gz

# Restore Docker volumes
docker run --rm -v qpdf_tmp:/data -v $(pwd):/backup alpine tar xzf /backup/tmp-backup.tar.gz -C /data
```
