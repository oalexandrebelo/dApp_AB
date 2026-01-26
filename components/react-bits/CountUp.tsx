"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
    /** The target value to count to */
    value: number;
    /** Duration of the animation in seconds */
    duration?: number;
    /** Number of decimal places to show */
    decimals?: number;
    /** Prefix to show before the number (e.g., "$") */
    prefix?: string;
    /** Suffix to show after the number (e.g., "%") */
    suffix?: string;
    /** Additional CSS classes */
    className?: string;
    /** Whether to animate on mount or wait for value change */
    animateOnMount?: boolean;
    /** Whether to format with thousands separator */
    formatNumber?: boolean;
}

// Format number with thousands separator
function formatWithSeparator(num: number, decimals: number): string {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export function CountUp({
    value,
    duration = 1.5,
    decimals = 2,
    prefix = "",
    suffix = "",
    className,
    animateOnMount = true,
    formatNumber = true,
}: CountUpProps) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Spring animation for smooth easing
    const spring = useSpring(0, {
        damping: 25,
        stiffness: 80,
        mass: 0.5,
    });

    // Transform spring value to display value with decimals and formatting
    const display = useTransform(spring, (current) => {
        if (formatNumber) {
            return formatWithSeparator(current, decimals);
        }
        return current.toFixed(decimals);
    });

    // Intersection observer to trigger animation when in view
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Animate to value when in view or when value changes
    useEffect(() => {
        // Skip animation if user prefers reduced motion
        if (prefersReducedMotion) {
            spring.jump(value);
            return;
        }

        if (animateOnMount && isInView) {
            spring.set(value);
        } else if (!animateOnMount) {
            spring.set(value);
        }
    }, [value, isInView, animateOnMount, spring, prefersReducedMotion]);

    return (
        <span ref={ref} className={cn("tabular-nums font-mono", className)}>
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </span>
    );
}

