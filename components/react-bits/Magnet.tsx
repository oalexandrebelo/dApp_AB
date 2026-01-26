"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const Magnet = ({ children, padding = 100, disabled = false, magnetStrength = 2 }: { children: React.ReactNode; padding?: number; disabled?: boolean; magnetStrength?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { top, left, width, height } = ref.current?.getBoundingClientRect() || { top: 0, left: 0, width: 0, height: 0 };
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const dist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

        if (dist < (width / 2 + padding) && !disabled) {
            const x = (clientX - centerX) / magnetStrength;
            const y = (clientY - centerY) / magnetStrength;
            setPosition({ x, y });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};
