"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  originalRadius: number;
  opacity: number;
  pulseSpeed: number;
}

interface PlexusBackgroundProps {
  nodeCount?: number;
  maxDistance?: number;
  className?: string;
  children?: React.ReactNode;
}

const PlexusBackground: React.FC<PlexusBackgroundProps> = ({
  nodeCount = 80,
  maxDistance = 150,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollOffsetRef = useRef(0);

  const createNodes = useCallback(
    (width: number, height: number) => {
      const nodes: Node[] = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 1,
          originalRadius: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
      return nodes;
    },
    [nodeCount]
  );

  const updateNodes = useCallback((canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.001;
    const mouse = mouseRef.current;

    nodesRef.current.forEach((node, index) => {
      // Base movement
      node.x += node.vx;
      node.y += node.vy;

      // Add scroll influence
      node.x += Math.sin(time + index * 0.1) * 0.2;
      node.y += Math.cos(time + index * 0.1) * 0.2;

      // Mouse interaction
      const mouseDistance = Math.sqrt(
        Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
      );

      if (mouseDistance < 200) {
        const force = (200 - mouseDistance) / 200;
        const angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
        node.vx += Math.cos(angle) * force * 0.02;
        node.vy += Math.sin(angle) * force * 0.02;
        node.radius = node.originalRadius * (1 + force * 0.5);
      } else {
        node.radius += (node.originalRadius - node.radius) * 0.1;
      }

      // Boundary collision
      if (node.x < 0 || node.x > canvas.width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
      }
      if (node.y < 0 || node.y > canvas.height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }

      // Damping
      node.vx *= 0.99;
      node.vy *= 0.99;

      // Pulsing effect
      node.opacity = 0.3 + Math.sin(time * node.pulseSpeed + index) * 0.2;
    });
  }, []);

  const drawConnections = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const mouse = mouseRef.current;
      ctx.strokeStyle = "rgba(100, 255, 218, 0.1)";
      ctx.lineWidth = 1;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeI = nodesRef.current[i];
          const nodeJ = nodesRef.current[j];

          const distance = Math.sqrt(
            Math.pow(nodeI.x - nodeJ.x, 2) + Math.pow(nodeI.y - nodeJ.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;

            // Enhanced opacity near mouse
            const mouseDistanceI = Math.sqrt(
              Math.pow(mouse.x - nodeI.x, 2) + Math.pow(mouse.y - nodeI.y, 2)
            );
            const mouseDistanceJ = Math.sqrt(
              Math.pow(mouse.x - nodeJ.x, 2) + Math.pow(mouse.y - nodeJ.y, 2)
            );

            let finalOpacity = opacity * 0.3;
            if (mouseDistanceI < 150 || mouseDistanceJ < 150) {
              finalOpacity = opacity * 0.8;
            }

            ctx.strokeStyle = `rgba(100, 255, 218, ${finalOpacity})`;
            ctx.beginPath();
            ctx.moveTo(nodeI.x, nodeI.y);
            ctx.lineTo(nodeJ.x, nodeJ.y);
            ctx.stroke();
          }
        }
      }
    },
    [maxDistance]
  );

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D) => {
    nodesRef.current.forEach((node) => {
      // Glow effect
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        node.radius * 3
      );
      gradient.addColorStop(0, `rgba(100, 255, 218, ${node.opacity})`);
      gradient.addColorStop(0.5, `rgba(0, 188, 212, ${node.opacity * 0.5})`);
      gradient.addColorStop(1, "rgba(100, 255, 218, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core node
      ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const drawMouseInfluence = useCallback((ctx: CanvasRenderingContext2D) => {
    const mouse = mouseRef.current;
    if (mouse.x && mouse.y) {
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        100
      );
      gradient.addColorStop(0, "rgba(100, 255, 218, 0.05)");
      gradient.addColorStop(1, "rgba(100, 255, 218, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateNodes(canvas);
    drawConnections(ctx);
    drawMouseInfluence(ctx);
    drawNodes(ctx);

    animationIdRef.current = requestAnimationFrame(animate);
  }, [updateNodes, drawConnections, drawMouseInfluence, drawNodes]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set canvas size to match container
    canvas.width = width;
    canvas.height = height;

    // Recreate nodes with new dimensions
    nodesRef.current = createNodes(width, height);
  }, [createNodes]);

  useEffect(() => {
    // Initial setup
    const initCanvas = () => {
      resizeCanvas();
      animate();
    };

    // Use a small delay to ensure container is rendered
    const timer = setTimeout(initCanvas, 100);

    const handleResize = () => {
      resizeCanvas();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const handleScroll = () => {
      scrollOffsetRef.current = window.pageYOffset * 0.1;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [resizeCanvas, animate]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        }}
      />
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
};

export default PlexusBackground;
