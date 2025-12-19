"use client";

import dynamic from "next/dynamic";

const MouseParticles = dynamic(() => import("./MouseParticles"), {
    ssr: false,
    loading: () => null,
});

export default function MouseParticlesLazy() {
    return <MouseParticles />;
}
