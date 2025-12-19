import { HeroSection } from "@/components/landing/HeroSection";
import dynamic from 'next/dynamic';

const MouseParticles = dynamic(() => import('@/components/ui/MouseParticles'), {
    ssr: false,
    loading: () => null
});

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <MouseParticles />
            <HeroSection />
        </main>
    );
}
