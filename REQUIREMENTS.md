# TransData Nexus - System Requirements

## Overview
TransData Nexus is an advanced pharmaceutical trade data analytics platform built with Next.js 15, featuring AI-powered insights, real-time data visualization, and comprehensive import/export tracking.

## System Requirements

### Development Environment

#### Node.js & Package Manager
- **Node.js**: >= 18.17.0 (LTS recommended)
- **npm**: >= 9.0.0 or **pnpm**: >= 8.0.0 (recommended)
- **TypeScript**: >= 5.0.0

#### Operating System
- **macOS**: 10.15+ (Catalina or later)
- **Windows**: 10+ or Windows Server 2019+
- **Linux**: Ubuntu 18.04+, CentOS 7+, or equivalent

### Production Environment

#### Server Requirements
- **CPU**: 2+ cores (4+ cores recommended)
- **RAM**: 4GB minimum (8GB+ recommended)
- **Storage**: 20GB+ available space
- **Network**: Stable internet connection

#### Runtime
- **Node.js**: >= 18.17.0 (LTS)
- **PM2** or similar process manager (recommended)

## Database Requirements

### Primary Database - MongoDB

#### Version Requirements
- **MongoDB**: >= 6.0
- **MongoDB Atlas**: Supported (recommended for production)

#### Configuration
- **Storage Engine**: WiredTiger (default)
- **Replica Set**: Recommended for production
- **Minimum Resources**:
  - Development: 2GB RAM, 10GB storage
  - Production: 8GB+ RAM, 100GB+ storage

#### Collections
- `exp_india` - Export data from India
- `imp_india` - Import data to India
- `contactForm` - Contact form submissions

#### Indexes
Multiple optimized indexes for search performance:
- Single field indexes on: buyer_name, supplier_name, hs_code, product_description
- Compound indexes for common query patterns
- Text indexes for full-text search capabilities

### Cache Database - Redis (Optional but Recommended)

#### Version Requirements
- **Redis**: >= 6.0
- **Redis Cloud**: Supported

#### Configuration
- **Memory**: 512MB minimum (2GB+ recommended)
- **Persistence**: RDB snapshots enabled
- **Use Cases**: Query caching, session storage, rate limiting

## External Dependencies

### Required Services

#### Database Connectivity
- MongoDB connection with read/write permissions
- Network accessibility to MongoDB instance
- Proper authentication credentials

#### Optional Services
- **Redis**: For caching and performance optimization
- **SMTP Server**: For email notifications (contact forms)
- **OpenAI API**: For AI-powered insights (optional feature)

### Third-Party Libraries

#### Frontend Dependencies
- **React**: 19.x
- **Next.js**: 15.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **Framer Motion**: Animation library
- **D3.js**: Data visualization
- **Leaflet**: Interactive maps

#### Backend Dependencies
- **Prisma**: Database ORM
- **ioredis**: Redis client
- **nodemailer**: Email functionality
- **sharp**: Image optimization

## Environment Variables

### Required Variables
```bash
MONGODB_URI=your_mongodb_connection_string
DIRECT_DATABASE_URL=your_direct_database_url
```

### Optional Variables
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
OPENAI_API_KEY=your_openai_api_key
```

See `.env.example` for complete configuration template.

## Performance Requirements

### Response Time Targets
- **Homepage Load**: < 2 seconds
- **Search Queries**: < 3 seconds
- **Data Visualization**: < 5 seconds
- **API Responses**: < 1 second

### Scalability
- **Concurrent Users**: 100+ (with proper infrastructure)
- **Data Volume**: Supports millions of trade records
- **Query Performance**: Optimized with MongoDB indexes

## Browser Compatibility

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 14+

## Security Requirements

### Data Protection
- Environment variables for sensitive data
- No hardcoded credentials in source code
- HTTPS required for production
- Input validation and sanitization

### Database Security
- MongoDB authentication enabled
- Network security (VPC/firewall rules)
- Regular security updates
- Backup and recovery procedures

## Development Tools

### Required Tools
- **Git**: Version control
- **Code Editor**: VS Code, Cursor, or similar
- **Terminal**: Command line access

### Recommended Extensions
- TypeScript and JavaScript language support
- Tailwind CSS IntelliSense
- Prisma extension
- ESLint and Prettier

## Deployment Options

### Supported Platforms
- **Vercel**: Recommended (automatic deployments)
- **Netlify**: Static site deployment
- **AWS**: EC2, Lambda, or App Runner
- **Digital Ocean**: App Platform or Droplets
- **Google Cloud**: Cloud Run or App Engine

### Container Support
- **Docker**: Dockerfile included
- **Kubernetes**: Deployment manifests available
- **Docker Compose**: Local development setup

## Installation & Setup

See `SETUP.md` for detailed installation instructions and `README.md` for quick start guide.

## Support & Updates

### Maintenance Schedule
- **Security Updates**: As needed
- **Feature Updates**: Monthly releases
- **Dependency Updates**: Quarterly reviews

### Version Support
- **Current Version**: Full support
- **Previous Version**: Security updates only
- **Legacy Versions**: Community support

For technical support and bug reports, please use the GitHub Issues system.
