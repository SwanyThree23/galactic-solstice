#!/bin/bash
# YLIV 4.0 | Production Deployment Script
# This script automates the deployment of SeeWhy LIVE to a production Linux server.

echo "🚀 Starting YLIV 4.0 Deployment..."

# 1. Check for Docker
if ! [ -x "$(command -v docker)" ]; then
  echo '❌ Error: docker is not installed.' >&2
  exit 1
fi

# 2. Update Environment
echo "📝 Configuring environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "⚠️ Created backend/.env from example. Please update it with production secrets."
fi

# 3. Build and Start Stack
echo "🏗️ Building and launching Docker containers..."
docker-compose up -d --build

# 4. Success Check
echo "⏳ Waiting for database to be ready..."
sleep 10

# 5. Run Migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend npx prisma migrate deploy

# 6. Final Status
echo "✅ Deployment Complete!"
echo "------------------------------------------------"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:4000"
echo "------------------------------------------------"
echo "Run 'docker-compose logs -f' to monitor the system."
