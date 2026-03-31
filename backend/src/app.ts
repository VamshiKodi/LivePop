import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import regionRoutes from './routes/regionRoutes';
import statsRoutes from './routes/statsRoutes';
import { initializeSocket } from './sockets/populationSocket';
import { logger } from './utils/logger';

// Export app setup function for testing
export const createApp = () => {
    const app = express();
    const httpServer = createServer(app);

    // Allowed frontend origins (Vite may pick 5173–5176 if ports are in use)
    const ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5176',
    ];

    // Initialize Socket.IO
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: ALLOWED_ORIGINS,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    // Middleware
    app.use(cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging
    app.use((req, res, next) => {
        if (process.env.NODE_ENV !== 'test') {
            logger.debug(`${req.method} ${req.path}`);
        }
        next();
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/regions', regionRoutes);
    app.use('/api/stats', statsRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({
            success: true,
            data: {
                status: 'ok',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: {
                message: 'Route not found',
            },
        });
    });

    // Error handler
    app.use(errorHandler);

    // Initialize Socket.IO
    initializeSocket(io);

    return { app, httpServer, io };
};
