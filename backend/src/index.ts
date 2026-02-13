import http from 'http';
import app from './app';
import { SocketService } from './services/SocketService';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Initialize Socket.IO
new SocketService(server);

server.listen(port, () => {
    console.log(`
  ==========================================
  YLIV 4.0 - Next Gen Streaming Platform
  Server running on port ${port}
  Aesthetics: PREMIUM
  Status: PRODUCTION READY
  ==========================================
  `);
});
