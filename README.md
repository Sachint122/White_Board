# 🖌️ Collaborative Whiteboard App

A real-time whiteboard application built using **React.js**, **Node.js**, **Socket.io**, and **MongoDB**. It allows multiple users to draw together, share rooms, and see each other's cursors in real-time.

---

## 🚀 Features

- ✅ Real-time drawing with Socket.io
- ✅ Room-based whiteboards (via unique ID)
- ✅ Unique color-coded cursors for users
- ✅ Drawing history saved in MongoDB
- ✅ Auto-delete rooms inactive for 24 hours
- ✅ Live user count updates
- ✅ Clear canvas for all users
- ✅ Smooth animated UI with Framer Motion
- ✅ Connection status indicator


---

## 🧑‍💻 Tech Stack

| Frontend      | Backend           | Real-time        | Database   |
|---------------|-------------------|------------------|------------|
| React.js      | Node.js + Express | Socket.io        | MongoDB    |
| Framer Motion | REST API (Room)   | WebSocket Events | Mongoose   |

---

## 📁 Folder Structure
whiteboard-project/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── App.js
│ │ ├── socket.js
│ └── package.json
├── server/ # Node.js backend
│ ├── models/Room.js
│ ├── socketHandler.js
│ ├── server.js
│ └── package.json

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/whiteboard-project.git
cd whiteboard-project

cd server
npm install
node server.js

cd ../client
npm install
npm start
```
[React Client]
   ↕ Socket.io
[Express Server]
   ↔ MongoDB

- React handles drawing + UI
- Socket.io manages real-time sync
- Express provides room APIs
- MongoDB stores room + drawing data
- Cron job clears inactive rooms
## 🔌 API Documentation

This project uses both **REST API** (for room joining) and **Socket.io events** (for real-time interaction).

---

### 📡 REST API

#### `POST /api/rooms/join`

Creates or joins a whiteboard room.

- **Request Body:**
  ```json
  {
    "roomId": "demo123"
  }
{
  "message": "Room joined successfully",
  "roomId": "demo123"
}
{
  "error": "Room ID is required"
}
```
## 🚀 Deployment Guide

Follow these steps to deploy your collaborative whiteboard app in production using **Render** (for backend) and **Vercel or Netlify** (for frontend).

---

### 📦 Backend Deployment (Node.js + MongoDB)

#### ✅ Recommended: [Render.com](https://render.com)

1. **Push your `server/` folder to a GitHub repo**
2. Go to [Render](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `server/`
5. Add environment variables:
   - `MONGO_URI` = *your MongoDB connection string*
   - `PORT` = `5000` *(or leave blank)*

6. Click **Deploy**

> ✅ MongoDB: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for production database.

---

### 🌐 Frontend Deployment (React App)

#### ✅ Recommended: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

1. **Push your `client/` folder to GitHub**
2. Go to Vercel or Netlify and create a new project
3. Connect your GitHub repo
4. Set environment variable:


5. Build command (automatically set):
   - `npm install`
   - `npm run build`
6. Output directory: `build`

7. Click **Deploy**

---

### 🛠 Update `socket.js` for production

In `client/src/socket.js`, use environment variable:

```js
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
});

export default socket;

🔒 Security Tips

Use HTTPS URLs for production
Restrict CORS in your backend server
Set rate limits if needed (e.g. express-rate-limit)

---
 
 🙋‍♂️ Author
Built with ❤️ by Sachin Tiwari
Feel free to connect on GitHub or drop a star!