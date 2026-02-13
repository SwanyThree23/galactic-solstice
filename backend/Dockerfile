# ── Stage 1: Build ──
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ── Stage 2: Production ──
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -q --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
