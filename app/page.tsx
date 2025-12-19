import { HeroSection } from "@/components/landing/HeroSection";
import MouseParticlesLazy from "@/components/ui/MouseParticlesLazy";


export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <MouseParticlesLazy />
            <HeroSection />
        </main>
    );
}
