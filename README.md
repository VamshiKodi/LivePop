# 🌍 LivePop — Real-Time World Population Counter

> A futuristic, full-stack application that tracks and visualizes live world population data — by country, region, and demographic group.

![LivePop Preview](https://img.shields.io/badge/status-live-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🕐 **Live Counter** | Real-time world population counter updating every second |
| 🗺️ **Country Profiles** | Detailed stats for 190+ countries — pop, growth rate, density |
| 🏆 **Leaderboard** | Top growing, top populous, and declining nations |
| 📊 **Age Demographics** | Donut charts showing youth/working/elderly breakdown per country |
| ⏰ **Time Machine** | Slide through population history from 1950 to 2100 |
| ⚖️ **Compare** | Side-by-side population comparison between two countries |
| 🎂 **Birthday Calculator** | Discover how many people were born when you were |
| ⭐ **Favorites** | Save and revisit your countries of interest |

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript (Vite)
- Tailwind CSS + Framer Motion
- Recharts (data visualization)
- React Router DOM

**Backend**
- Node.js + Express + TypeScript
- MongoDB Atlas (Mongoose)
- JWT Authentication
- Socket.IO for real-time updates

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to the backend at `http://localhost:4000/api`.

---

## 🗂️ Project Structure

```
LivePop/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Population calculation logic
│   │   └── middleware/    # Auth middleware
│   └── seed/              # Database seeding scripts
└── frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── pages/         # Route pages
        ├── hooks/         # Custom React hooks
        └── services/      # API layer
```

---

## 📄 License

MIT © 2025 LivePop
