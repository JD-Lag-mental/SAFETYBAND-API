#!/bin/bash
# Production environment setup for Render.com
# This file documents the required environment variables for production deployment

# Database connection URL with schema specification
# Use the Render PostgreSQL External Database URL
# The ?schema=public parameter ensures correct schema usage
export DATABASE_URL="postgresql://safetyband_db_user:PASSWORD@dpg-xxxxx.oregon-postgres.render.com/safetyband_db?schema=public"

# Direct database URL for migrations (Prisma requirement)
# This bypasses connection pooling for schema operations
export DIRECT_DATABASE_URL="postgresql://safetyband_db_user:PASSWORD@dpg-xxxxx.oregon-postgres.render.com/safetyband_db?schema=public"

# Production environment
export NODE_ENV=production

# API Port (Render assigns port automatically)
export PORT=3000

# JWT Secret - Use a strong, random string
# Generate with: openssl rand -base64 32
export JWT_SECRET="your-super-secret-key-here"

echo "Production environment variables loaded"
