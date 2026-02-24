import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createAdminUser } from '../src/services/adminService';
import Region from '../src/models/Region';
import AdminUser from '../src/models/AdminUser';
import { logger } from '../src/utils/logger';

dotenv.config();

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }

        // Connect to MongoDB
        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB');

        // Create admin user if not exists
        const existingAdmin = await AdminUser.findOne({ username: 'admin' });

        if (!existingAdmin) {
            await createAdminUser('admin', 'admin@example.com', 'admin123');
            logger.info('✅ Created default admin user (username: admin, password: admin123)');
        } else {
            logger.info('ℹ️  Admin user already exists');
        }

        // Seed regions
        // @ts-ignore
        const regionsRaw = (await import('./countries.json')).default;
        // @ts-ignore
        const demographicsRaw = (await import('./demographics')).DEMOGRAPHICS_DATA;

        const regions = regionsRaw.map((region: any) => {
            const demo = demographicsRaw.find((d: any) => d.code === region.code);
            return {
                ...region,
                // Ensure dates are parsed correctly
                baselineAt: new Date(region.baselineAt),
                demographics: demo ? {
                    youth: demo.youth,
                    working: demo.working,
                    elderly: demo.elderly
                } : undefined,
                density: demo ? demo.density : undefined,
                meta: {
                    ...region.meta,
                    lastUpdatedAt: new Date()
                }
            };
        });

        // Prepare bulk operations
        const bulkOps = regions.map((regionData: any) => ({
            updateOne: {
                filter: { code: regionData.code },
                update: { $set: regionData },
                upsert: true
            }
        }));

        // Execute bulk write
        if (bulkOps.length > 0) {
            const result = await Region.bulkWrite(bulkOps);
            logger.info(`✅ Bulk seed complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);
        }

        logger.info('🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Seed failed:', error);
        process.exit(1);
    }
};

seedData();
