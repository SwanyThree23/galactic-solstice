# ── Stage 1: Build ──
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing config
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    location /api { \
    proxy_pass http://backend:4000; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $host; \
    } \
    location /socket.io { \
    proxy_pass http://backend:4000; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
