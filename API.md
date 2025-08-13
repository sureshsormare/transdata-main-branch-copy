# TransData Nexus - API Documentation

## Overview

TransData Nexus provides RESTful APIs for accessing pharmaceutical trade data with advanced filtering, search, and analytics capabilities.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the APIs are publicly accessible. For production deployment, consider implementing:
- API key authentication
- Rate limiting
- IP whitelisting

## Rate Limiting

- **Development**: No limits
- **Production**: 100 requests per minute per IP (recommended)

## Data Models

### Trade Record (Export Data)
```typescript
interface ExportRecord {
  id: string
  buyer_name?: string
  buyer_address?: string
  buyer_city_state?: string
  buyer_contact_no?: string
  buyer_email_id?: string
  supplier_name?: string
  supplier_address?: string
  supplier_city_state?: string
  supplier_contact_no?: string
  supplier_email_id?: string
  product_description?: string
  hs_code?: string
  country_of_origin?: string
  country_of_destination?: string
  shipping_bill_date?: string
  total_value_usd?: string
  quantity?: string
  // ... additional fields
}
```

## API Endpoints

### 1. Quick Summary APIs

#### Supplier-Customer Summary
Get aggregated trade data with supplier and customer analysis.

```http
GET /api/quicksummary/supplier-customer-summary
```

**Query Parameters:**
- `q` (string): Search query for product, supplier, or buyer
- `type` (string): Summary type (`supplier-customer`, `product`, `country`)
- `limit` (number): Number of results (default: 5, max: 100)
- `country` (string): Filter by country
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)

**Example Request:**
```bash
curl "http://localhost:3000/api/quicksummary/supplier-customer-summary?q=paracetamol&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRecords": 1250,
      "totalValue": "$45,000,000",
      "topSuppliers": [
        {
          "name": "ABC Pharmaceuticals",
          "totalValue": "$12,000,000",
          "recordCount": 45,
          "countries": ["India", "USA", "Germany"]
        }
      ],
      "topCustomers": [
        {
          "name": "XYZ Medical Corp",
          "totalValue": "$8,500,000",
          "recordCount": 32,
          "countries": ["USA", "Canada"]
        }
      ],
      "topProducts": [
        {
          "description": "Paracetamol Tablets",
          "hsCode": "30049099",
          "totalValue": "$15,000,000",
          "recordCount": 180
        }
      ],
      "topCountries": [
        {
          "name": "United States",
          "totalValue": "$20,000,000",
          "recordCount": 95
        }
      ]
    },
    "charts": {
      "valueByMonth": [...],
      "volumeByProduct": [...],
      "tradeFlows": [...]
    }
  },
  "performance": {
    "queryTime": "2.5s",
    "recordsProcessed": 1250,
    "cacheHit": false
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "hasMore": false
  }
}
```

#### Latest Paracetamol Data
Get recent paracetamol trade records with trend analysis.

```http
GET /api/quicksummary/latest-paracetamol
```

**Query Parameters:**
- `limit` (number): Number of records (default: 10, max: 50)
- `days` (number): Days of historical data (default: 30)

**Example Request:**
```bash
curl "http://localhost:3000/api/quicksummary/latest-paracetamol?limit=20&days=7"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recentRecords": [
      {
        "id": "...",
        "buyer_name": "Global Health Inc",
        "supplier_name": "Indian Pharma Ltd",
        "product_description": "Paracetamol Tablets 500mg",
        "total_value_usd": "$125,000",
        "shipping_bill_date": "2024-01-15",
        "country_of_destination": "United States"
      }
    ],
    "trends": {
      "dailyVolume": [...],
      "priceVariation": [...],
      "marketShare": [...]
    },
    "insights": {
      "averagePrice": "$2.50/kg",
      "totalVolume": "50,000 kg",
      "growthRate": "+15.5%",
      "keyMarkets": ["USA", "Germany", "UK"]
    }
  },
  "metadata": {
    "lastUpdated": "2024-01-16T10:30:00Z",
    "dataSource": "Export Data India",
    "coverage": "7 days"
  }
}
```

#### Trade Records Search
Search and filter trade records with advanced parameters.

```http
GET /api/quicksummary/trade-records
```

**Query Parameters:**
- `q` (string): Search term
- `type` (string): Record type (`export`, `import`, `both`)
- `country` (string): Country filter
- `supplier` (string): Supplier name filter
- `buyer` (string): Buyer name filter
- `product` (string): Product description filter
- `hsCode` (string): HS code filter
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)
- `minValue` (number): Minimum trade value (USD)
- `maxValue` (number): Maximum trade value (USD)
- `page` (number): Page number (default: 1)
- `limit` (number): Records per page (default: 20, max: 100)
- `sortBy` (string): Sort field (`date`, `value`, `quantity`)
- `sortOrder` (string): Sort direction (`asc`, `desc`)

**Example Request:**
```bash
curl "http://localhost:3000/api/quicksummary/trade-records?q=insulin&country=USA&limit=25&sortBy=value&sortOrder=desc"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "...",
        "buyer_name": "American Diabetes Corp",
        "supplier_name": "Bio Insulin Ltd",
        "product_description": "Human Insulin Injection",
        "hs_code": "30033100",
        "total_value_usd": "$500,000",
        "quantity": "1000 vials",
        "shipping_bill_date": "2024-01-10",
        "country_of_origin": "India",
        "country_of_destination": "United States"
      }
    ],
    "aggregations": {
      "totalValue": "$2,500,000",
      "totalRecords": 45,
      "averageValue": "$55,556",
      "dateRange": {
        "earliest": "2023-12-01",
        "latest": "2024-01-15"
      }
    },
    "facets": {
      "countries": [
        {"name": "USA", "count": 15},
        {"name": "Germany", "count": 8}
      ],
      "suppliers": [
        {"name": "Bio Insulin Ltd", "count": 12},
        {"name": "Pharma Export Co", "count": 7}
      ],
      "products": [
        {"name": "Human Insulin", "count": 25},
        {"name": "Insulin Pen", "count": 10}
      ]
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalRecords": 45,
    "hasMore": true,
    "limit": 25
  },
  "performance": {
    "queryTime": "1.8s",
    "cacheHit": true,
    "indexesUsed": ["product_description", "country_of_destination"]
  }
}
```

### 2. Contact API

#### Submit Contact Form
Handle contact form submissions.

```http
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "organization": "ABC Pharmaceuticals",
  "contact": "+1-555-0123",
  "message": "Interested in trade data analytics for insulin products."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "contact_12345",
  "timestamp": "2024-01-16T10:30:00Z"
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY",
    "message": "Invalid search parameters provided",
    "details": {
      "field": "dateFrom",
      "reason": "Invalid date format. Use YYYY-MM-DD"
    }
  },
  "timestamp": "2024-01-16T10:30:00Z"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (if authentication enabled)
- `403` - Forbidden (rate limit exceeded)
- `404` - Not Found (endpoint doesn't exist)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error (database/server issues)
- `503` - Service Unavailable (maintenance mode)

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_QUERY` | Invalid search parameters |
| `MISSING_PARAMETER` | Required parameter not provided |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `DATABASE_ERROR` | Database connection issues |
| `INVALID_DATE_FORMAT` | Date parameter format error |
| `PAGINATION_ERROR` | Invalid pagination parameters |

## Performance Considerations

### Caching
- Query results cached for 5 minutes (Redis)
- Cache keys based on query parameters
- Cache bypass with `?cache=false` parameter

### Database Optimization
- MongoDB indexes for common query patterns
- Query timeout: 30 seconds maximum
- Connection pooling enabled

### Response Time Targets
- Simple queries: < 1 second
- Complex aggregations: < 3 seconds
- Large dataset queries: < 5 seconds

## SDK & Libraries

### JavaScript/TypeScript
```typescript
// Example client implementation
class TransDataAPI {
  constructor(private baseUrl: string) {}
  
  async searchTrade(params: SearchParams) {
    const response = await fetch(`${this.baseUrl}/quicksummary/trade-records?${new URLSearchParams(params)}`);
    return response.json();
  }
}
```

### cURL Examples
```bash
# Search for paracetamol exports to USA
curl -G "http://localhost:3000/api/quicksummary/supplier-customer-summary" \
  -d "q=paracetamol" \
  -d "country=USA" \
  -d "type=supplier-customer" \
  -d "limit=10"

# Get recent insulin trade data
curl "http://localhost:3000/api/quicksummary/trade-records?q=insulin&sortBy=date&sortOrder=desc&limit=5"
```

## Data Sources

- **Export Data**: Indian pharmaceutical export records
- **Import Data**: Indian pharmaceutical import records
- **Update Frequency**: Daily (batch processing)
- **Data Quality**: Validated and normalized
- **Coverage**: 2020 onwards

## Security Best Practices

### For Production Use
1. **API Authentication**: Implement JWT or API key auth
2. **Rate Limiting**: Use Redis-based rate limiting
3. **Input Validation**: Sanitize all query parameters
4. **CORS Configuration**: Restrict allowed origins
5. **HTTPS Only**: Force secure connections
6. **Request Logging**: Log all API requests for monitoring

### Recommended Headers
```http
X-API-Key: your-api-key
Content-Type: application/json
Accept: application/json
User-Agent: YourApp/1.0
```

## Monitoring & Analytics

### Metrics to Track
- Request volume and patterns
- Response times and performance
- Error rates and types
- Popular search terms
- Geographic usage patterns

### Health Check Endpoint
```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "cache": "connected",
  "uptime": "24h 15m 30s",
  "version": "1.0.0"
}
```
