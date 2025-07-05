const Room = require('../models/Room');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('join-room', async ({ roomId }) => {
      socket.join(roomId);

      try {
        const room = await Room.findOne({ roomId });

        if (room) {
  
          const newCount = (io.sockets.adapter.rooms.get(roomId)?.size) || 1;
          room.userCount = newCount;
          room.lastActivity = new Date();
          await room.save();

  
          io.to(roomId).emit('user-count', newCount);
        }

  
        if (room?.drawingData?.length) {
          socket.emit("load-history", room.drawingData);
        }

      } catch (err) {
        console.error("Error in join-room:", err);
      }
    });


    socket.on('cursor-move', ({ roomId, x, y, color }) => {
      socket.to(roomId).emit('cursor-move', {
        socketId: socket.id,
        x,
        y,
        color
      });
    });

    socket.on('draw-start', (data) => {
      socket.to(data.roomId).emit('draw-start', data);
    });

    socket.on('draw-move', (data) => {
      socket.to(data.roomId).emit('draw-move', data);
    });

    socket.on('draw-end', async (data) => {
      socket.to(data.roomId).emit('draw-end', data);
      try {
        const room = await Room.findOne({ roomId: data.roomId });
        if (room) {
          room.drawingData.push({
            type: 'stroke',
            data: {
              path: data.path,      
              color: data.color,
              width: data.width
            },
            timestamp: new Date()
          });
          room.lastActivity = new Date();
          await room.save();
        }
      } catch (err) {
        console.error("Error saving drawing:", err);
      }
    });

    socket.on('clear-canvas', async ({ roomId }) => {
      io.to(roomId).emit('clear-canvas');
      try {
        await Room.updateOne({ roomId }, {
          $set: {
            drawingData: [],
            lastActivity: new Date()
          }
        });
      } catch (err) {
        console.error("Error clearing canvas:", err);
      }
    });

    socket.on('disconnecting', async () => {
      const rooms = [...socket.rooms].filter(id => id !== socket.id);
    
      for (const roomId of rooms) {
        try {
          const room = await Room.findOne({ roomId });
          if (room) {
            const updatedCount = (io.sockets.adapter.rooms.get(roomId)?.size || 1) - 1;
    
            room.userCount = updatedCount < 0 ? 0 : updatedCount;
            room.lastActivity = new Date();
            await room.save();
    
            io.to(roomId).emit('user-count', room.userCount);
          }
        } catch (err) {
          console.error("Error updating user count on disconnect:", err);
        }
      }
    });
    

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
