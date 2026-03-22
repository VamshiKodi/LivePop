import { logger } from './logger';

export const validateEnv = (): void => {
    const requiredEnvVars = [
        'MONGO_URI',
        'JWT_SECRET',
    ];

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        logger.error('Please check your .env file');
        process.exit(1);
    }

    logger.info('Environment variables validated successfully');
};
