import { useEffect, useRef } from "react";
import { useReducedMotion } from "~/hooks/use-reduced-motion";

interface Packet {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
}

const CELL = 64;
const PACKET_COUNT = 10;

export function EngineeringGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const isDark = () => !document.documentElement.classList.contains("light");
    const randomNode = () => ({
      x: Math.floor(Math.random() * cols) * CELL,
      y: Math.floor(Math.random() * rows) * CELL,
    });

    const packets: Packet[] = Array.from({ length: PACKET_COUNT }, () => {
      const from = randomNode();
      const to = randomNode();
      return {
        x: from.x,
        y: from.y,
        targetX: to.x,
        targetY: to.y,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      };
    });

    let frame: number;

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      const lineColor = isDark() ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols * CELL; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows * CELL; y += CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      drawStatic();
      const packetColor = isDark() ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.4)";

      for (const packet of packets) {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.x = packet.targetX;
          packet.y = packet.targetY;
          const next = randomNode();
          packet.targetX = next.x;
          packet.targetY = next.y;
          packet.progress = 0;
        }

        const cx = packet.x + (packet.targetX - packet.x) * packet.progress;
        const cy = packet.y + (packet.targetY - packet.y) * packet.progress;

        ctx.fillStyle = packetColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    if (reducedMotion) {
      drawStatic();
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
