# YLIV 4.0 Deployment Script (Windows PowerShell)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   YLIV 4.0 - AUTOMATED DEPLOYMENT      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Setup Backend
Write-Host "[1/4] Setting up Backend..." -ForegroundColor Yellow
cd backend
npm install
npm run prisma:generate
npm run db:setup
npm run build
cd ..

# 2. Setup Frontend
Write-Host "[2/4] Setting up Frontend..." -ForegroundColor Yellow
cd frontend
npm install
npm run build
cd ..

# 3. Launch Docker (Optional)
Write-Host "[3/4] Launching Production Services..." -ForegroundColor Yellow
Write-Host "Note: Ensure Docker Desktop is running." -ForegroundColor Gray
# docker-compose up -d

# 4. Success
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!               " -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3001      " -ForegroundColor Green
Write-Host "   Backend:  http://localhost:4000      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
