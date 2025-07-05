import React, { useEffect, useState } from "react";
import socket from "../socket";

const UserCursors = ({ roomId, color }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const handleMouseMove = (e) => {
      socket.emit("cursor-move", {
        roomId,
        x: e.clientX,
        y: e.clientY,
        color, 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    socket.on("cursor-move", ({ socketId, x, y, color }) => {
      setCursors((prev) => ({
        ...prev,
        [socketId]: { x, y, color },
      }));
    });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      socket.off("cursor-move");
    };
  }, [roomId, color]);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y, color }]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 10,
            height: 10,
            backgroundColor: color || "black",
            borderRadius: "50%",
            border: "1px solid white",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            transition: "all 0.05s ease-out",
          }}
        />
      ))}
    </>
  );
};

export default UserCursors;
