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
        // Connect to MongoDB with timeout handling
        logger.info('Connecting to MongoDB...');
        try {
            await connectDB();
        } catch (dbError) {
            logger.error('Initial MongoDB connection failed, but starting server anyway to provide fallback data.');
        }

        const { httpServer } = createApp();
        const DEFAULT_PORT = parseInt(process.env.PORT || '4000', 10);
        
        const listen = (port: number): Promise<number> => {
            return new Promise((resolve, reject) => {
                const server = httpServer.listen(port, '0.0.0.0', () => {
                    logger.info(`🚀 Server running on port ${port}`);
                    logger.info(`📡 Socket.IO ready for connections`);
                    logger.info(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || '*'}`);
                    resolve(port);
                });

                server.on('error', (err: any) => {
                    if (err.code === 'EADDRINUSE') {
                        logger.warn(`⚠️ Port ${port} is already in use. Trying next port...`);
                        server.close();
                        resolve(listen(port + 1));
                    } else {
                        reject(err);
                    }
                });
            });
        };

        await listen(DEFAULT_PORT);
    } catch (error) {
        logger.error('Failed to start server:', error);
        // Don't exit immediately, let the logger finish
        setTimeout(() => process.exit(1), 1000);
    }
};

startServer();
