---
description: How to deploy YLIV 4.0 to production
---

This workflow automates the deployment of the SeeWhy LIVE platform using Docker Compose.

### Steps

1. **Prepare Environment**
   - Ensure Docker and Docker Compose are installed on the target machine.
   - Copy the project files to the server.

2. **Configure Secrets**
   - Update `backend/.env` with production `DATABASE_URL` and `JWT_SECRET`.
   - Update `frontend/.env` with your production `VITE_API_URL`.

// turbo
3. **Run Deployment Script**

- Execute the automated deployment script:

   ```bash
   bash outputs/deploy.sh
   ```

1. **Verify Deployment**
   - Check if the containers are running:

   ```bash
   docker-compose ps
   ```

   - Verify the login and streaming functionality.
