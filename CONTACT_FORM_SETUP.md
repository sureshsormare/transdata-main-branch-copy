# Contact Form Setup Guide

## Overview
The contact form has been improved with better validation, error handling, and user experience. It now works even without email configuration.

## Features
- ✅ Form validation with Zod
- ✅ Database storage (MongoDB)
- ✅ Optional email notifications
- ✅ Better error handling
- ✅ Accessibility improvements
- ✅ Responsive design

## Environment Variables

### Required
- `MONGODB_URI`: MongoDB connection string
- `DIRECT_DATABASE_URL`: Direct MongoDB connection (for Prisma)

### Optional (for email notifications)
- `EMAIL_USER`: Email username for SMTP
- `EMAIL_PASS`: Email password for SMTP

## Setup Instructions

1. **Database Setup**
   ```bash
   # Install dependencies
   pnpm install
   
   # Generate Prisma client
   pnpm prisma generate
   
   # Push schema to database (if needed)
   pnpm prisma db push
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI="mongodb://localhost:27017/transdata"
   DIRECT_DATABASE_URL="mongodb://localhost:27017/transdata"
   
   # Email (optional)
   EMAIL_USER="your-email@domain.com"
   EMAIL_PASS="your-email-password"
   ```

3. **Testing**
   - Health check: `curl http://localhost:3000/api/health`
   - Test form submission: Use the contact form on the website

## Troubleshooting

### "Internal Server Error" when submitting form
1. Check database connection: Visit `/api/health`
2. Check browser console for detailed error messages
3. Verify environment variables are set correctly
4. Check server logs for specific error details

### Email not sending
- Email sending is optional and won't break the form
- Check if `EMAIL_USER` and `EMAIL_PASS` are set
- Email errors are logged but don't prevent form submission

### Database connection issues
1. Verify MongoDB is running
2. Check `MONGODB_URI` environment variable
3. Run `pnpm prisma generate` to regenerate client
4. Check Prisma schema in `prisma/schema.prisma`

## API Endpoints

### POST /api/contact
Submits contact form data.

**Request Body:**
```json
{
  "name": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "organization": "string (optional)",
  "contact": "string (optional)",
  "message": "string (required, min 10 chars)"
}
```

**Response:**
```json
{
  "success": true
}
```

### GET /api/health
Checks system health and database connectivity.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "contactFormCount": 5,
  "timestamp": "2025-07-06T12:10:55.279Z"
}
```

## Form Validation Rules

- **Name**: Minimum 2 characters
- **Email**: Must be a valid email format
- **Message**: Minimum 10 characters
- **Organization & Contact**: Optional fields

## Error Messages

- **Validation Errors**: Field-specific error messages
- **Database Errors**: "Database error. Please try again later."
- **Connection Errors**: "Database connection error. Please try again later."
- **General Errors**: "Internal Server Error! Please try again later."

## Success Flow

1. User fills out form
2. Client-side validation
3. Server-side validation
4. Data saved to database
5. Email notification sent (if configured)
6. Success message displayed
7. Form reset

The form will work even without email configuration - it will just skip the email notification step. 