"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CCTPBridge } from "@/components/flows/CCTPBridge";

export default function BridgePage() {
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">CCTP Bridge</h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Securely transfer USDC across chains using Circle's native Cross-Chain Transfer Protocol.
                    </p>
                </div>

                <CCTPBridge />
            </div>
        </div>
    );
}
