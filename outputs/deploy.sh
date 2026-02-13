#!/bin/bash

# YLIV 4.0 Deployment Script (Linux/macOS)

echo -e "\e[36m==========================================\e[0m"
echo -e "\e[36m   YLIV 4.0 - AUTOMATED DEPLOYMENT      \e[0m"
echo -e "\e[36m==========================================\e[0m"

# 1. Setup Backend
echo -e "\e[33m[1/4] Setting up Backend...\e[0m"
cd backend
npm install
npm run prisma:generate
npm run db:setup
npm run build
cd ..

# 2. Setup Frontend
echo -e "\e[33m[2/4] Setting up Frontend...\e[0m"
cd frontend
npm install
npm run build
cd ..

# 3. Launch Services
echo -e "\e[33m[3/4] Launching Production Services...\e[0m"
docker-compose up -d

# 4. Success
echo -e "\e[32m==========================================\e[0m"
echo -e "\e[32m   DEPLOYMENT SUCCESSFUL!               \e[0m"
echo -e "\e[32m   Frontend: http://localhost:3001      \e[0m"
echo -e "\e[32m   Backend:  http://localhost:4000      \e[0m"
echo -e "\e[32m==========================================\e[0m"
