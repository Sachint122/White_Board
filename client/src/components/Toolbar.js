import React from "react";
import socket from "../socket";
import { motion } from "framer-motion";

const Toolbar = ({ roomId, color, setColor, strokeWidth, setStrokeWidth }) => {
  const clearCanvas = () => {
    socket.emit("clear-canvas", { roomId });
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#0d1117",
        color: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <label style={{ fontSize: "0.9rem" }}>
          🎨 Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: 8, borderRadius: 4 }}
          />
        </label>
        <label style={{ fontSize: "0.9rem" }}>
          ✏️ Width:
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={clearCanvas}
        style={{
          backgroundColor: "#ff4444",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🧹 Clear Canvas
      </motion.button>
    </motion.div>
  );
};

export default Toolbar;
