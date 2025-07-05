import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const DrawingCanvas = ({ roomId, color, strokeWidth }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    contextRef.current = ctx;

    // Load history
    socket.on("load-history", (drawingData) => {
      drawingData.forEach(({ type, data }) => {
        if (type === "stroke") {
          drawStroke(data.path, data.color, data.width);
        } else if (type === "clear") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    });

    // Drawing from other users
    socket.on("draw-start", ({ x, y, color, width }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
    });

    socket.on("draw-move", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.on("draw-end", () => {
      ctx.closePath();
    });

    socket.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("load-history");
      socket.off("draw-start");
      socket.off("draw-move");
      socket.off("draw-end");
      socket.off("clear-canvas");
    };
  }, []);

  const drawStroke = (path, color, width) => {
    const ctx = contextRef.current;
    if (!path || path.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    isDrawing.current = true;
    currentPath.current = [{ x: offsetX, y: offsetY }];

    const ctx = contextRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    socket.emit("draw-start", { roomId, x: offsetX, y: offsetY, color, width: strokeWidth });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = nativeEvent;
    currentPath.current.push({ x: offsetX, y: offsetY });

    const ctx = contextRef.current;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw-move", { roomId, x: offsetX, y: offsetY });
  };

  const endDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    contextRef.current.closePath();

    socket.emit("draw-end", {
      roomId,
      path: currentPath.current,
      color,
      width: strokeWidth,
    });

    currentPath.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #ccc", display: "block", margin: "0 auto" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    />
  );
};

export default DrawingCanvas;
