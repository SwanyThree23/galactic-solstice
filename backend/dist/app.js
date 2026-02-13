"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files for video uploads
app.use('/uploads', express_1.default.static('uploads'));
// Health Check (Production Monitoring)
app.get('/', (req, res) => {
    res.json({
        platform: 'YLIV 4.0 | SeeWhy LIVE',
        status: 'PRODUCTION READY',
        version: '4.0.1',
        uptime: process.uptime(),
        latencyTarget: '20 xerons',
        timestamp: new Date().toISOString()
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
// API Routes
app.use('/api', routes_1.default);
// Error Handling
app.use(error_1.errorHandler);
exports.default = app;
