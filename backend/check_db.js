
const mongoose = require('mongoose');
const path = require('path');
// Use require for the model if it's compiled, or use ts-node to register
require('ts-node').register();
const Region = require('./src/models/Region').default;

async function checkDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        
        const world = await Region.findOne({ code: 'WORLD' });
        if (world) {
            console.log('WORLD_DATA_FOUND');
            console.log(JSON.stringify(world, null, 2));
        } else {
            console.log('WORLD_DATA_NOT_FOUND');
            const allRegions = await Region.find().limit(5);
            console.log('Sample regions:', JSON.stringify(allRegions, null, 2));
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDB();
