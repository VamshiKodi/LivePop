import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in .env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');

        await mongoose.disconnect();
        console.log('✅ Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
};

testConnection();
