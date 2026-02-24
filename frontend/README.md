# LivePop - Real-Time Population Counter

LivePop is a modern, futuristic React application that visualizes real-time world population growth.

## 🚀 Features

- **Real-time Counter**: Smoothly animated population counter using `framer-motion` springs.
- **Futuristic UI**: Dark-themed, glassmorphism design with neon accents.
- **Responsive**: Fully responsive layout for mobile and desktop.
- **Country Stats**: Dynamic routing for individual country details (`/country/:code`).

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM

## 📦 Installation

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🔮 Future Integration

Backend integration points are prepared in `src/services/api.ts` and `src/hooks/usePopulation.ts`.
Set `VITE_API_URL` in your `.env` file to point to your backend server.

---
© 2024 LivePop
