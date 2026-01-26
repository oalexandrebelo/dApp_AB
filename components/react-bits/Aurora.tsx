"use client";

import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import React, { useEffect } from "react";

const DEFAULT_COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const Aurora = ({
    colors = DEFAULT_COLORS,
    children,
}: {
    colors?: string[];
    children?: React.ReactNode;
}) => {
    const color1 = useMotionValue(colors[0]);
    const color2 = useMotionValue(colors[1]);
    const color3 = useMotionValue(colors[2]);
    const color4 = useMotionValue(colors[3]);

    useEffect(() => {
        animate(color1, colors, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
        animate(color2, colors, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 2,
        });
        animate(color3, colors, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 4,
        });
        animate(color4, colors, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 6,
        });
    }, [colors, color1, color2, color3, color4]);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color1} 70%, ${color2} 80%, ${color3} 90%, ${color4} 100%)`;

    return (
        <motion.section
            style={{
                backgroundImage,
            }}
            className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        >
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
            <div className="relative z-10 w-full">{children}</div>
        </motion.section>
    );
};
