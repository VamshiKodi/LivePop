import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
        });

        logger.info('MongoDB connected successfully');

        // Avoid attaching duplicate listeners on hot reloads / repeated calls
        if (mongoose.connection.listenerCount('error') === 0) {
            mongoose.connection.on('error', (err) => {
                logger.error('MongoDB connection error:', err);
            });
        }

        if (mongoose.connection.listenerCount('disconnected') === 0) {
            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
            });
        }

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        // IMPORTANT: do not exit the process here.
        // The server can run in fallback mode (simulated data / limited features)
        // while MongoDB is unavailable (e.g., DNS ESERVFAIL, network issues).
        throw error;
    }
};
