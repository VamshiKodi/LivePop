import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import Region from '../src/models/Region';
import { MongoMemoryServer } from 'mongodb-memory-server';

let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const { app: expressApp } = createApp();
    app = expressApp;

    await Region.create({
        code: 'WORLD',
        name: 'World',
        baselinePopulation: 8000000000,
        baselineAt: new Date(),
        birthsPerSec: 4.2,
        deathsPerSec: 1.8,
        migrationPerSec: 0,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Region API', () => {
    it('should fetch all regions with population', async () => {
        const res = await request(app).get('/api/regions');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        const region = res.body.data[0];
        expect(region).toHaveProperty('code');
        expect(region).toHaveProperty('populationNow');
    });

    it('should fetch a single region', async () => {
        const res = await request(app).get('/api/regions/WORLD');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('code', 'WORLD');
        expect(res.body.data).toHaveProperty('populationNow');
    });
});
