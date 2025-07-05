import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import DrawingCanvas from "./DrawingCanvas";
import Toolbar from "./Toolbar";
import UserCursors from "./UserCursors";
import { motion } from "framer-motion";

const getRandomColor = () => {
  const palette = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#bfef45'];
  return palette[Math.floor(Math.random() * palette.length)];
};

const Whiteboard = () => {
  const { roomId } = useParams();
  const [userCount, setUserCount] = useState(1);
  const [color, setColor] = useState("#ffb703");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [myColor] = useState(getRandomColor());

  useEffect(() => {
    socket.emit("join-room", { roomId });

    socket.on("user-count", (count) => {
      setUserCount(count);
    });

    const updateConnection = () => setIsConnected(socket.connected);
    socket.on("connect", updateConnection);
    socket.on("disconnect", updateConnection);

    socket.io.on("reconnect_attempt", () => setIsConnected(false));
    socket.io.on("reconnect", () => setIsConnected(true));

    return () => {
      socket.emit("leave-room", { roomId });

      socket.off("user-count");
      socket.off("connect", updateConnection);
      socket.off("disconnect", updateConnection);
      socket.io.off("reconnect_attempt");
      socket.io.off("reconnect");
    };
  }, [roomId]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Toolbar
        roomId={roomId}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 16px",
          backgroundColor: "#f1f5f9",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: "#333",
          borderBottom: "1px solid #ccc"
        }}
      >
        <span>
          {isConnected ? "🟢 Connected to Server" : "🔴 Disconnected — Trying to reconnect..."}
        </span>
        <span>👥 Users in this room: {userCount}</span>
      </motion.div>
      <DrawingCanvas roomId={roomId} color={color} strokeWidth={strokeWidth} />
      <UserCursors roomId={roomId} color={myColor} />
    </div>
  );
};

export default Whiteboard;
