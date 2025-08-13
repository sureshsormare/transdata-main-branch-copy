# TransData Nexus 🌐

**Advanced Pharmaceutical Trade Data Analytics Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.10.1-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC)](https://tailwindcss.com/)

A comprehensive platform for analyzing pharmaceutical import/export trade data with AI-powered insights, real-time visualizations, and advanced analytics capabilities.

## ✨ Features

### 🔍 **Data Analytics**
- **Advanced Search**: Multi-parameter search across millions of trade records
- **Real-time Filtering**: Dynamic filtering by country, supplier, buyer, product
- **Performance Optimized**: Sub-3-second query responses with MongoDB indexing

### 📊 **Visualizations**
- **Interactive Charts**: D3.js-powered bar charts, pie charts, and line graphs
- **Sankey Diagrams**: Trade flow visualizations between countries and companies
- **World Maps**: Geographic representation of pharmaceutical trade routes
- **Animated Dashboards**: Real-time data updates with smooth animations

### 🤖 **AI-Powered Insights**
- **Smart Analytics**: AI-driven pattern recognition in trade data
- **Market Trends**: Automated identification of emerging market opportunities
- **Supplier Intelligence**: Company relationship mapping and analysis
- **Predictive Modeling**: Future trade pattern predictions

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Fast Loading**: Next.js 15 with Turbopack for optimal performance
- **Modern UI**: Shadcn UI components with Radix UI primitives
- **Accessibility**: WCAG compliant interface design

### 🔧 **Technical Features**
- **Database Optimization**: Advanced MongoDB indexing strategies
- **Caching Layer**: Redis-powered query caching for enhanced performance
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Latest Next.js 15 with App Router

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0+
- MongoDB 6.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/transdata-nexus.git
cd transdata-nexus

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your database credentials

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📋 Development Status

- **Development Server**: ✅ Working perfectly with all features functional
- **Production Build**: ⚠️ Currently requires environment setup (database connection)
- **Database Required**: MongoDB connection needed for full functionality
- **Demo Mode**: Some pages can run without database for demonstration purposes

## 📋 Requirements

### System Requirements
- **Node.js**: 18.17.0 or later
- **MongoDB**: 6.0 or later
- **Redis**: 6.0+ (optional, for caching)
- **Memory**: 4GB+ RAM recommended
- **Storage**: 20GB+ available space

### Environment Variables
```bash
# Required
MONGODB_URI=your_mongodb_connection_string
DIRECT_DATABASE_URL=your_direct_database_url

# Optional
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

See `.env.example` for complete configuration template.

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Shadcn UI + Radix UI
- **Animations**: Framer Motion
- **Charts**: D3.js, Recharts, Nivo

### Backend
- **Runtime**: Node.js 18+
- **Database**: MongoDB with Prisma ORM
- **Caching**: Redis with ioredis
- **API**: Next.js API Routes
- **Validation**: Zod

### DevOps & Deployment
- **Build Tool**: Turbopack
- **Linting**: ESLint + TypeScript ESLint
- **Deployment**: Vercel (recommended)
- **Containerization**: Docker support

## 📁 Project Structure

```
transdata-nexus/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form API
│   │   └── quicksummary/  # Trade data APIs
│   ├── blog/              # Blog system
│   ├── components/        # Page-specific components
│   │   └── charts/        # Data visualization components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── components/            # Shared UI components
│   └── ui/                # Reusable UI primitives
├── lib/                  # Core utilities
│   ├── prisma.ts         # Database client
│   ├── redis.ts          # Cache client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── public/               # Static assets
│   ├── fonts/            # Custom fonts
│   └── logos/            # Company logos
└── scripts/              # Build and utility scripts
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create optimized indexes (recommended)
npm run create-indexes
```

### Performance Optimization

The platform includes several performance optimizations:

- **MongoDB Indexes**: 20+ optimized indexes for sub-3s queries
- **Redis Caching**: Query result caching with configurable TTL
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Built-in webpack bundle analyzer

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker
```bash
docker build -t transdata-nexus .
docker run -p 3000:3000 \
  -e MONGODB_URI=your_uri \
  -e DIRECT_DATABASE_URL=your_uri \
  transdata-nexus
```

### Manual Deployment
See `SETUP.md` for detailed deployment instructions.

## 📊 Performance Metrics

### Query Performance
- **Search Queries**: < 3 seconds (with indexes)
- **Data Visualization**: < 5 seconds
- **API Responses**: < 1 second
- **Page Load**: < 2 seconds (First Contentful Paint)

### Data Capacity
- **Trade Records**: Millions of records supported
- **Concurrent Users**: 100+ with proper infrastructure
- **Database Size**: Optimized for TB-scale data

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📚 Documentation

- **[Setup Guide](SETUP.md)**: Detailed installation and setup
- **[Requirements](REQUIREMENTS.md)**: System and technical requirements
- **[API Documentation](API.md)**: API endpoint documentation
- **[Deployment Guide](DEPLOYMENT.md)**: Production deployment instructions

## 🆘 Support

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Documentation**: Comprehensive guides and tutorials

### Known Issues
- Large datasets may require additional MongoDB memory
- Redis is recommended for optimal performance
- Internet connection required for Google Fonts

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For deployment platform and optimizations
- **MongoDB**: For scalable database solutions
- **Prisma**: For type-safe database access
- **Tailwind CSS**: For utility-first CSS framework
- **Shadcn**: For beautiful UI components

---

**Built with ❤️ for the pharmaceutical industry**

*Empowering data-driven decisions in global pharmaceutical trade*