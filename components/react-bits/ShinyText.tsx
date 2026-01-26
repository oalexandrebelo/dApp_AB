"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
    /** Text to display */
    text: string;
    /** Additional CSS classes */
    className?: string;
    /** Animation duration in seconds */
    duration?: number;
    /** Gradient colors [start, middle, end] */
    colors?: [string, string, string];
}

export function ShinyText({
    text,
    className,
    duration = 3,
    colors = ["#6366f1", "#a855f7", "#06b6d4"],
}: ShinyTextProps) {
    return (
        <motion.span
            className={cn(
                "inline-block bg-clip-text text-transparent bg-gradient-to-r",
                className
            )}
            style={{
                backgroundImage: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
                backgroundSize: "200% 100%",
            }}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration,
                ease: "linear",
                repeat: Infinity,
            }}
        >
            {text}
        </motion.span>
    );
}
