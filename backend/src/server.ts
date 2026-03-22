import dotenv from 'dotenv';
import { createApp } from './app';
import { connectDB } from './config/db';
import { validateEnv } from './utils/validateEnv';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Validate environment
validateEnv();

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        const { httpServer } = createApp();
        const PORT = parseInt(process.env.PORT || '4000', 10);

        // Start HTTP server
        httpServer.listen(PORT, '0.0.0.0', () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📡 Socket.IO ready for connections`);
            logger.info(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
