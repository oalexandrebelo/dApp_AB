import { HeroSection } from "@/components/landing/HeroSection";
import MouseParticles from "@/components/ui/MouseParticles";

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <MouseParticles />
            <HeroSection />
        </main>
    );
}
