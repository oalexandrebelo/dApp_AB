"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package } from "lucide-react";

interface EmptyStateProps {
    type: "supply" | "borrow";
    onAction: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
    const content = {
        supply: {
            icon: TrendingUp,
            title: "No Assets Supplied",
            description: "Supply assets to start earning yield on your crypto holdings.",
            action: "Go to Markets",
            color: "text-success-500",
        },
        borrow: {
            icon: Package,
            title: "No Assets Borrowed",
            description: "Borrow assets against your collateral to access liquidity.",
            action: "Go to Markets",
            color: "text-blue-500",
        },
    };

    const { icon: Icon, title, description, action, color } = content[type];

    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className={`p-4 rounded-full bg-muted mb-4`}>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    {description}
                </p>
                <Button onClick={onAction} size="lg">
                    {action}
                </Button>
            </CardContent>
        </Card>
    );
}

