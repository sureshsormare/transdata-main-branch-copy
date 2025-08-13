# TransData Nexus - Deployment Guide

## Overview

This guide covers various deployment options for TransData Nexus, from development to enterprise-scale production deployments.

## Deployment Options

### 1. Vercel (Recommended)
Best for: Small to medium-scale applications, rapid deployment

### 2. Docker + Cloud Platforms
Best for: Scalable production deployments, containerized environments

### 3. Traditional VPS/Dedicated Server
Best for: Custom infrastructure, high control requirements

### 4. Kubernetes
Best for: Enterprise-scale, auto-scaling requirements

## 1. Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account
- MongoDB database (Atlas recommended)

### Step-by-Step Deployment

#### 1.1 Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 1.2 Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Select the repository: `transdata-nexus`

#### 1.3 Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transdata_nexus_db
DIRECT_DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/transdata_nexus_db

# Optional
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Production
NODE_ENV=production
```

#### 1.4 Deploy
1. Click "Deploy"
2. Wait for build completion (~2-3 minutes)
3. Visit your deployed application

#### 1.5 Custom Domain (Optional)
1. Go to Domains tab in Vercel dashboard
2. Add your custom domain
3. Configure DNS records as instructed

### Vercel Configuration

#### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### Performance Optimizations
- **Edge Functions**: API routes run on edge
- **Image Optimization**: Automatic optimization
- **Static Generation**: Pages pre-rendered at build time
- **CDN**: Global content delivery

## 2. Docker Deployment

### Prerequisites
- Docker and Docker Compose
- MongoDB instance
- Redis instance (optional)

### 2.1 Create Dockerfile

```dockerfile
# Create this file: Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/transdata_nexus_db
      - DIRECT_DATABASE_URL=mongodb://mongo:27017/transdata_nexus_db
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - NODE_ENV=production
    depends_on:
      - mongo
      - redis
    networks:
      - app-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=transdata_nexus_db
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  mongo_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 2.3 Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### 2.4 Cloud Platform Deployment

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker build -t transdata-nexus .
docker tag transdata-nexus:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/transdata-nexus:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/transdata-nexus:latest
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/transdata-nexus
gcloud run deploy --image gcr.io/PROJECT-ID/transdata-nexus --platform managed
```

#### Azure Container Instances
```bash
# Build and push to ACR
az acr build --registry myregistry --image transdata-nexus .
az container create --resource-group myResourceGroup --name transdata-nexus --image myregistry.azurecr.io/transdata-nexus:latest
```

## 3. Traditional Server Deployment

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Node.js 18+
- MongoDB 6.0+
- Nginx (reverse proxy)
- SSL certificate

### 3.1 Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Redis
sudo apt install redis-server

# Install PM2
sudo npm install pm2 -g

# Install Nginx
sudo apt install nginx
```

### 3.2 Application Deployment

```bash
# Clone repository
git clone https://github.com/your-username/transdata-nexus.git
cd transdata-nexus

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configurations

# Build application
npm run build

# Start with PM2
pm2 start npm --name "transdata-nexus" -- start
pm2 save
pm2 startup
```

### 3.3 Nginx Configuration

Create `/etc/nginx/sites-available/transdata-nexus`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/transdata-nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.4 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 4. Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Helm (optional)

### 4.1 Create Kubernetes Manifests

#### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: transdata-nexus
```

#### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: transdata-nexus
data:
  NODE_ENV: "production"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

#### Secret
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: transdata-nexus
type: Opaque
data:
  MONGODB_URI: <base64-encoded-uri>
  DIRECT_DATABASE_URL: <base64-encoded-uri>
  REDIS_PASSWORD: <base64-encoded-password>
```

#### Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: transdata-nexus
  namespace: transdata-nexus
spec:
  replicas: 3
  selector:
    matchLabels:
      app: transdata-nexus
  template:
    metadata:
      labels:
        app: transdata-nexus
    spec:
      containers:
      - name: transdata-nexus
        image: your-registry/transdata-nexus:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: transdata-nexus-service
  namespace: transdata-nexus
spec:
  selector:
    app: transdata-nexus
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: transdata-nexus-ingress
  namespace: transdata-nexus
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: transdata-nexus-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: transdata-nexus-service
            port:
              number: 80
```

### 4.2 Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n transdata-nexus
kubectl get services -n transdata-nexus
kubectl get ingress -n transdata-nexus

# View logs
kubectl logs -f deployment/transdata-nexus -n transdata-nexus
```

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Staging
```bash
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
MONGODB_URI=mongodb://staging-db:27017/transdata_nexus_staging
```

### Production
```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
MONGODB_URI=mongodb+srv://prod-cluster.mongodb.net/transdata_nexus_prod
```

## Monitoring & Observability

### Health Checks
- **Application**: `/api/health`
- **Database**: MongoDB ping
- **Cache**: Redis ping

### Logging
```bash
# PM2 logs
pm2 logs transdata-nexus

# Docker logs
docker-compose logs -f app

# Kubernetes logs
kubectl logs -f deployment/transdata-nexus -n transdata-nexus
```

### Metrics (Production)
- **APM**: New Relic, DataDog, or Prometheus
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot

## Security Considerations

### Network Security
- Use HTTPS/TLS encryption
- Configure firewall rules
- VPN for database access
- IP whitelisting for admin access

### Application Security
- Environment variable validation
- Input sanitization
- Rate limiting
- CORS configuration
- Security headers

### Database Security
- MongoDB authentication
- Network encryption
- Regular backups
- Access logging

## Backup & Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:port/dbname" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/mongodb/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR
```

### Application Backup
```bash
# Code backup (handled by Git)
git push origin main

# Environment backup
cp .env.local /backup/env/$(date +%Y%m%d).env.backup
```

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test MongoDB connection
mongosh $MONGODB_URI --eval "db.runCommand('ping')"
```

#### Memory Issues
```bash
# Check Node.js memory usage
node --max-old-space-size=4096 server.js

# Monitor with PM2
pm2 monit
```

#### Port Conflicts
```bash
# Find process using port
lsof -i :3000
netstat -tulpn | grep :3000
```

### Log Analysis
```bash
# Search for errors
grep -i error /var/log/transdata-nexus.log
pm2 logs transdata-nexus | grep ERROR

# Monitor real-time
tail -f /var/log/transdata-nexus.log
```

## Performance Optimization

### Production Optimizations
- Enable gzip compression
- Use CDN for static assets
- Database query optimization
- Redis caching configuration
- Load balancing (multiple instances)

### Scaling Strategies
- **Horizontal**: Multiple application instances
- **Vertical**: Increase server resources
- **Database**: MongoDB sharding/clusters
- **Cache**: Redis clustering

## Maintenance

### Regular Tasks
- **Weekly**: Check logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Database optimization and cleanup
- **Annually**: Infrastructure review and upgrades

### Update Process
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart with zero downtime
pm2 reload transdata-nexus
```

This comprehensive deployment guide covers all major deployment scenarios. Choose the option that best fits your infrastructure requirements and scale needs.
