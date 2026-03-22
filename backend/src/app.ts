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

    // Initialize Socket.IO
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Middleware
    app.use(cors({
        origin: '*',
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
