"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const SocketService_1 = require("./services/SocketService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
// Initialize Socket.IO
new SocketService_1.SocketService(server);
server.listen(port, () => {
    console.log(`
  ==========================================
  SeeWhy LIVE by SWANYTHREE EnTech - Next Gen Streaming Platform
  Server running on port ${port}
  Aesthetics: PREMIUM
  Status: PRODUCTION READY
  ==========================================
  `);
});
