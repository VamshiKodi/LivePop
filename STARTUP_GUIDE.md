# LivePop Project Startup Guide 🚀

Follow these steps to start the project correctly on your local machine.

## Prerequisites
- Node.js installed
- Active internet connection (for MongoDB Atlas)

---

## Step 1: Start the Backend
Open a terminal in the `backend` folder and run this command:

```powershell
cp .env.example .env
# Update MONGO_URI and JWT_SECRET inside .env
npm install
npm run dev
```

**What this does:**
- Connects to the live MongoDB database.
- Starts the Socket.IO server on Port 4000.
- Handles port conflicts automatically (if 4000 is busy, it tries 4001).

---

## Step 2: Start the Frontend
Open a **new terminal** in the `frontend` folder and run:

```powershell
# This starts the React application on port 5174
cmd /c "npm run dev -- --port 5174"
```

**Why port 5174?**
- Port 5173 is often used by other processes. Using 5174 ensures a clean start.

---

## Step 3: Verify the Connection
1. Open your browser to: `http://localhost:5174`
2. Look for the **yellow debug banner** at the top.
3. It should say: **"Status: Connected | Source: Live"** (or "Simulated" if the database is slow).
4. The red dot next to **"LIVE CENSUS"** should be visible and the counter should be ticking.

---

## Troubleshooting
- **Port already in use?** The backend now automatically tries the next port. No action needed!
- **UI stuck on SYNCING?** Refresh the page. The new fallback system will show a simulated counter if the database takes more than 5 seconds to respond.
- **Zombie Processes?** If things get stuck, run: `taskkill /F /IM node.exe /T` in any terminal.

---

## Admin Credentials (for /admin)
- **Username:** `admin`
- **Password:** `admin123`
