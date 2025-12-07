import { CCTPBridge } from "@/components/flows/CCTPBridge";

export default function BridgePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">CCTP Bridge</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Securely transfer USDC across chains using Circle's native Cross-Chain Transfer Protocol.
                </p>
            </div>

            <CCTPBridge />
        </div>
    );
}
