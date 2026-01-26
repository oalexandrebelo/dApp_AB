"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridMotionProps {
    /** Grid cell size in pixels */
    cellSize?: number;
    /** Opacity of the grid lines (0-1) */
    opacity?: number;
    /** Color of the grid lines */
    color?: string;
    /** Enable mouse-following highlight effect */
    interactive?: boolean;
    /** Additional CSS classes */
    className?: string;
    children?: React.ReactNode;
}

export function GridMotion({
    cellSize = 40,
    opacity = 0.15,
    color = "currentColor",
    interactive = true,
    className,
    children,
}: GridMotionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring values for gradient position
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    useEffect(() => {
        if (!interactive) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [interactive, mouseX, mouseY]);

    // Transform for radial gradient mask
    const maskImage = useTransform(
        [springX, springY],
        ([x, y]) =>
            `radial-gradient(circle 300px at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, transparent 100%)`
    );

    return (
        <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
            {/* Base Grid Pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, ${color} 1px, transparent 1px),
            linear-gradient(to bottom, ${color} 1px, transparent 1px)
          `,
                    backgroundSize: `${cellSize}px ${cellSize}px`,
                    opacity: opacity,
                }}
            />

            {/* Animated Highlight Overlay */}
            {interactive && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, ${color} 1px, transparent 1px),
              linear-gradient(to bottom, ${color} 1px, transparent 1px)
            `,
                        backgroundSize: `${cellSize}px ${cellSize}px`,
                        opacity: opacity * 2,
                        maskImage,
                        WebkitMaskImage: maskImage,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
