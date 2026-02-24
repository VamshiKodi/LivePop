# LivePop Backend

## Overview

This repository contains the **backend** for the **LivePop – Real-Time Population Counter** project. It provides:

- A **REST API** for reading population data and managing regions.
- **Admin CRUD** endpoints secured with **JWT** authentication.
- **Real‑time population updates** via **Socket.IO**.
- **MongoDB Atlas** persistence using **Mongoose**.

The backend is written in **TypeScript**, follows **ESLint/Prettier** conventions, and includes **Jest + Supertest** tests.

## Quick Start

```bash
# Clone the repo (already part of the monorepo)
cd LivePop/backend

# Install dependencies
npm install

# Copy env example and configure
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secret

# Seed the database (creates admin user and sample regions)
npm run seed

# Development server (with hot‑reload)
npm run dev
```

The server will start on `http://localhost:4000` (or the `PORT` you set).

## API Documentation

- **GET** `/api/health` – health check.
- **POST** `/api/auth/login` – admin login, returns JWT.
- **GET** `/api/regions` – list all regions with current population.
- **GET** `/api/regions/:code` – details for a specific region.
- **POST** `/api/regions` – create a region (**admin only**).
- **PUT** `/api/regions/:code` – update a region (**admin only**).
- **DELETE** `/api/regions/:code` – delete a region (**admin only**).
- **GET** `/api/stats` – aggregated world stats.

## Real‑time Updates

Clients can connect via Socket.IO:

```ts
import { io } from 'socket.io-client';
const socket = io('http://localhost:4000');

socket.emit('subscribe', { regions: ['WORLD', 'IN'] });
socket.on('snapshot', data => console.log(data));
socket.on('update', data => console.log(data));
```

## Testing

```bash
npm test
```

## Scripts

- `dev` – start server with nodemon.
- `build` – compile TypeScript.
- `start` – run compiled code.
- `lint` – run ESLint.
- `test` – run Jest tests.
- `seed` – seed initial data.

## License

MIT
