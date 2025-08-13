# TransData Nexus - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18.17.0 or later
- MongoDB 6.0 or later
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/transdata-nexus.git
   cd transdata-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   # Run database migrations/setup if needed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Detailed Setup

### 1. Database Configuration

#### MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB (macOS with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Create database
mongosh
use transdata_nexus_db
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

#### Redis Setup (Optional)

**Local Redis:**
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server
```

**Redis Cloud:**
1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a database
3. Update Redis environment variables

### 2. Environment Variables

Create `.env.local` file:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/transdata_nexus_db
DIRECT_DATABASE_URL=mongodb://localhost:27017/transdata_nexus_db

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Development
NODE_ENV=development
```

### 3. Database Schema & Indexes

```bash
# Generate Prisma client
npx prisma generate

# Create optimized indexes (optional - for better performance)
npm run create-indexes
```

### 4. Development Workflow

#### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

#### File Structure
```
transdata-nexus/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── blog/             # Blog pages
│   └── globals.css       # Global styles
├── components/            # Shared components
├── lib/                  # Utility libraries
├── prisma/               # Database schema
├── public/               # Static assets
└── scripts/              # Build/utility scripts
```

## Production Deployment

### Vercel (Recommended)

1. **Connect repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Environment variables**
   ```bash
   # Add in Vercel dashboard
   MONGODB_URI=your_production_mongodb_uri
   DIRECT_DATABASE_URL=your_production_mongodb_uri
   NODE_ENV=production
   ```

3. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for pull requests

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t transdata-nexus .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 \
     -e MONGODB_URI=your_mongodb_uri \
     -e DIRECT_DATABASE_URL=your_mongodb_uri \
     transdata-nexus
   ```

### Manual Server Deployment

1. **Build application**
   ```bash
   npm run build
   ```

2. **Install PM2**
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "transdata-nexus" -- start
   pm2 save
   pm2 startup
   ```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check environment variables
echo $MONGODB_URI
```

#### Font Loading Issues
- Ensure Google Fonts can be accessed
- Check firewall/proxy settings
- Verify internet connection

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Performance Optimization

#### Database Indexes
```bash
# Create performance indexes
npm run create-indexes
```

#### Redis Caching
- Enable Redis for query caching
- Configure TTL based on data freshness needs

#### Image Optimization
- Images are automatically optimized by Next.js
- Use WebP format when possible

### Monitoring & Logging

#### Development
```bash
# View logs
npm run dev

# Enable debug mode
DEBUG=* npm run dev
```

#### Production
```bash
# PM2 logs
pm2 logs transdata-nexus

# PM2 monitoring
pm2 monit
```

## Additional Configuration

### SSL/HTTPS Setup
For production deployments, ensure HTTPS is configured:
- Use Vercel (automatic HTTPS)
- Configure reverse proxy (nginx/Apache)
- Use SSL certificates (Let's Encrypt)

### Environment-Specific Settings

#### Development
- Hot reloading enabled
- Source maps included
- Debug logging enabled

#### Production
- Optimized builds
- Error logging only
- Performance monitoring

### Data Import/Migration

If you have existing trade data:

1. **Export data** from existing system
2. **Transform data** to match schema
3. **Import using** MongoDB tools or custom scripts
4. **Verify data** integrity and indexes

## Getting Help

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

### Support Channels
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Documentation wiki for guides

### Contributing
See `CONTRIBUTING.md` for development guidelines and contribution process.
