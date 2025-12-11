import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Web3TooltipProps {
    term: string;
    children: React.ReactNode;
}

const glossary: Record<string, { definition: string; learnMore?: string }> = {
    "Health Factor": {
        definition: "Measures your position's safety. Above 1.0 is safe. Below 1.0 risks liquidation. Higher is safer.",
        learnMore: "/docs/health-factor"
    },
    "LTV": {
        definition: "Loan-to-Value ratio. The maximum % you can borrow against your collateral. E-Mode increases this to 97%.",
        learnMore: "/docs/ltv"
    },
    "APY": {
        definition: "Annual Percentage Yield. The interest rate you earn (supply) or pay (borrow) per year, including compounding.",
        learnMore: "/docs/apy"
    },
    "E-Mode": {
        definition: "Efficiency Mode. Allows up to 97% LTV for correlated assets (stablecoins). Maximizes capital efficiency.",
        learnMore: "/docs/e-mode"
    },
    "Gas Fee": {
        definition: "Transaction fee paid to blockchain validators. Required for all on-chain actions. Varies by network congestion.",
        learnMore: "/docs/gas"
    },
    "Flashloan": {
        definition: "Borrow any amount without collateral, as long as you repay in the same transaction. 0.09% fee. Advanced feature.",
        learnMore: "/docs/flashloans"
    },
    "Liquidation": {
        definition: "When Health Factor < 1.0, your position can be liquidated. Liquidators repay debt and receive collateral + 5% bonus.",
        learnMore: "/docs/liquidation"
    },
    "Collateral": {
        definition: "Assets you supply that can be used to borrow against. Locked until you repay or withdraw.",
    },
    "Utilization": {
        definition: "% of supplied assets currently borrowed. Higher utilization = higher APY for suppliers.",
    },
    "Slippage": {
        definition: "Maximum price change you'll accept. Protects against unfavorable price movements during transaction.",
    }
};

export function Web3Tooltip({ term, children }: Web3TooltipProps) {
    const info = glossary[term];

    if (!info) {
        return <>{children}</>;
    }

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 border-b border-dotted border-muted-foreground/50 cursor-help">
                        {children}
                        <Info className="h-3 w-3 text-muted-foreground" />
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p className="text-sm">{info.definition}</p>
                    {info.learnMore && (
                        <a
                            href={info.learnMore}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Learn more →
                        </a>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
