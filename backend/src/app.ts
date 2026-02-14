import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for video uploads
app.use('/uploads', express.static('uploads'));

// Health Check (Production Monitoring)
app.get('/', (req, res) => {
    res.json({
        platform: 'SeeWhy LIVE by SWANYTHREE EnTech',
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
app.use('/api', router);

// Error Handling
app.use(errorHandler);

export default app;
