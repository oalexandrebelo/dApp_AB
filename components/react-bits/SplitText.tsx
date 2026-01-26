"use client";

import { motion } from "framer-motion";

export const SplitText = ({ children, delay = 0, className = "" }: { children: string; delay?: number; className?: string }) => {
    const words = children.split(" ");

    return (
        <div className={className}>
            {words.map((word, i) => (
                <div key={i} className="inline-block overflow-hidden mr-2 last:mr-0 align-bottom">
                    <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            ease: [0.33, 1, 0.68, 1],
                            delay: delay + i * 0.1,
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </div>
            ))}
        </div>
    );
};
