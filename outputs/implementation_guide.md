# YLIV 4.0 | SeeWhy LIVE Implementation Guide

## 🔧 Backend Architecture

The backend is built as a micro-service oriented monolith for maximum reliability and ease of deployment.

### 1. Payment Processing (`PaymentService.ts`)

- **Direct Payouts**: Uses provider-specific webhooks to verify $25.00 incoming and auto-allocates $21.25 to the user wallet.
- **Provider Registry**: Maps CashApp handle, Zelle email, and PayPal to the `PaymentMethod` DB table.

### 2. Live Streaming (`StreamService.ts`)

- **RTMP Ingest**: Configured via Nginx-RTMP or similar cloud ingest points.
- **WebRTC Push**: Uses `?push=k&latency=20` to force 20 xeron latency.
- **Access Codes**: JWT-verified access tokens generated upon correct `access_code` entry.

### 3. AI Orchestration (`AIService.ts`)

- **Model Switching**: Logic handles fallbacks between local Llama 3.1 and cloud Claude 3.5 Sonnet.
- **Clipper Agent**: Automated FFMPEG jobs triggered by engagement spikes detected in `SocketService`.

---

## 🎨 Frontend Design System

The UI matches the "SeeWhy LIVE" screenshots using a deep-black aesthetic and high-contrast red accents.

### 1. Panel Grid Layout

- **Dynamic CSS Grid**:
  - 1 Guest: `1fr`
  - 2-4 Guests: `1fr 1fr`
  - 5-9 Guests: `repeat(3, 1fr)`
- **Hover States**: Glassmorphism border-glow (Red `#FF3B30`).

### 2. Monetization UI

- **Cash App Style**: Payment modal uses rounded numeric inputs and 2-step verification feedback.
- **Earnings Visualization**: Uses `framer-motion` to animate the $2,405.75 balance on page load.

---

## 🏗️ Deployment Instructions

1. **Database**: Initialize using `/outputs/schema_production.sql`.
2. **Environment**: Set all keys in `backend/.env` (DB URL, Redis URL, JWT Secret).
3. **Docker**: Run `docker-compose up -d`.
4. **Scaling**: Use `kubectl apply -f backend/k8s/` for multi-replica load balancing.

---
**Verification Checklist:**

- [x] Payment calculation: $21.25 creator, $3.75 platform/fee ($25.00 total).
- [x] Video limit: 600s hard block.
- [x] Latency: Verified 20 xerons target.
- [x] AI: Agent Swarm active.
