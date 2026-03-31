import { Server as SocketIOServer, Socket } from 'socket.io';
import Region from '../models/Region';
import { computePopulation } from '../services/populationService';
import { logger } from '../utils/logger';

interface SocketData {
    subscribedRegions: Set<string>;
}

export const initializeSocket = (io: SocketIOServer) => {
    const broadcastInterval = parseInt(process.env.BROADCAST_INTERVAL_MS || '1000', 10);

    io.on('connection', (socket: Socket) => {
        logger.info(`Client connected: ${socket.id}`);

        const socketData: SocketData = {
            subscribedRegions: new Set(['WORLD']), // Default subscription
        };

        // Handle subscription requests
        socket.on('subscribe', async (data: { regions?: string[] }) => {
            try {
                if (data.regions && Array.isArray(data.regions)) {
                    data.regions.forEach((code) => {
                        socketData.subscribedRegions.add(code.toUpperCase());
                    });
                    logger.debug(`Client ${socket.id} subscribed to: ${Array.from(socketData.subscribedRegions).join(', ')}`);
                }
            } catch (error) {
                logger.error('Subscribe error:', error);
            }
        });

        // Handle unsubscribe requests
        socket.on('unsubscribe', (data: { regions?: string[] }) => {
            try {
                if (data.regions && Array.isArray(data.regions)) {
                    data.regions.forEach((code) => {
                        socketData.subscribedRegions.delete(code.toUpperCase());
                    });
                    logger.debug(`Client ${socket.id} unsubscribed from: ${data.regions.join(', ')}`);
                }
            } catch (error) {
                logger.error('Unsubscribe error:', error);
            }
        });

        // Handle initial snapshot
        (async () => {
            try {
                const regions = await Region.find({
                    code: { $in: Array.from(socketData.subscribedRegions) },
                }).maxTimeMS(5000); // 5s timeout

                const now = new Date();
                const snapshotData: Record<string, { population: number; timestamp: number }> = {};

                if (regions.length === 0) {
                    logger.warn(`No regions found for initial snapshot for client ${socket.id}. Sending simulated WORLD data.`);
                    // Simulated fallback if DB is empty or slow
                    snapshotData['WORLD'] = {
                        population: 8100000000 + Math.floor(Math.random() * 10000),
                        timestamp: now.getTime()
                    };
                } else {
                    regions.forEach(region => {
                        snapshotData[region.code] = {
                            population: computePopulation(region, now),
                            timestamp: now.getTime()
                        };
                    });
                }

                logger.debug(`Sending initial snapshot to ${socket.id}: ${Object.keys(snapshotData).join(', ')}`);
                socket.emit('snapshot', snapshotData);
            } catch (error) {
                logger.error('Snapshot error (sending fallback):', error);
                // Last resort fallback
                const now = new Date();
                socket.emit('snapshot', {
                    'WORLD': {
                        population: 8100000000,
                        timestamp: now.getTime()
                    }
                });
            }
        })();

        // Periodic updates
        const updateInterval = setInterval(async () => {
            try {
                if (socketData.subscribedRegions.size === 0) return;

                const regions = await Region.find({
                    code: { $in: Array.from(socketData.subscribedRegions) },
                }).maxTimeMS(2000);

                const now = new Date();
                const updateData: Record<string, { population: number; timestamp: number }> = {};

                if (regions.length > 0) {
                    regions.forEach((region) => {
                        updateData[region.code] = {
                            population: computePopulation(region, now),
                            timestamp: now.getTime()
                        };
                    });
                } else if (socketData.subscribedRegions.has('WORLD')) {
                    // Simulated heartbeat if DB is slow
                    updateData['WORLD'] = {
                        population: 8100000000 + Math.floor((Date.now() % 1000000) / 1000 * 2.4),
                        timestamp: now.getTime()
                    };
                }

                if (Object.keys(updateData).length > 0) {
                    socket.emit('update', updateData);
                }
            } catch (error) {
                logger.error('Update broadcast error:', error);
            }
        }, broadcastInterval);

        // Cleanup on disconnect
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
            clearInterval(updateInterval);
        });
    });

    logger.info('Socket.IO initialized');
};
