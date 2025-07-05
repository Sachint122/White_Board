const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const roomRoutes = require('./routes/roomRoutes');
const setupSocket = require('./socket/socketHandler');
const cron = require('node-cron');
const Room = require('./models/Room');

cron.schedule('0 * * * *', async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
  const result = await Room.deleteMany({ lastActivity: { $lt: cutoff } });
  if (result.deletedCount > 0) {
    console.log(`🧹 Deleted ${result.deletedCount} inactive rooms`);
  }
});

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setupSocket(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
