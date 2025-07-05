import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoomJoin = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomId.trim()) return alert("Enter a valid room code");

    await fetch("http://localhost:5000/api/rooms/join", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId })
    });

    navigate(`/room/${roomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        color: "white"
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Collaborative Whiteboard</h1>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          outline: "none",
          marginBottom: 10
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleJoin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#00d4ff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          color: "#000",
          fontWeight: "bold"
        }}
      >
        Join Room
      </motion.button>
    </motion.div>
  );
};

export default RoomJoin;
