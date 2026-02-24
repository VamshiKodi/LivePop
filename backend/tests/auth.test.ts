import request from 'supertest';
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const { app: expressApp } = createApp();
    app = expressApp;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth API', () => {
    // Mock login service to return known token/user without relying on real DB seeding if possible,
    // OR rely on seeding admin user in beforeAll/beforeEach.
    // For integration test, let's create a user first.

    beforeAll(async () => {
        const { createAdminUser } = await import('../src/services/adminService');
        await createAdminUser('admin', 'admin@example.com', 'admin123');
    });

    it('should login with valid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'admin123',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'wrongpass',
        });
        expect(res.status).toBe(401);
    });
});
