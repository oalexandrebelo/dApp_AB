import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap } from "lucide-react";
import { LiquidateButton } from "./LiquidateButton";

interface Position {
    user: string;
    healthFactor: number;
    collateralUSD: number;
    debtUSD: number;
    maxLiquidatable: number;
    profit: number;
    isEmergency: boolean;
}

interface LiquidatablePositionsTableProps {
    positions: Position[];
    isLoading: boolean;
}

export function LiquidatablePositionsTable({ positions, isLoading }: LiquidatablePositionsTableProps) {
    if (isLoading) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Loading liquidatable positions...
            </div>
        );
    }

    if (positions.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">
                    No liquidatable positions found
                </div>
                <div className="text-sm text-muted-foreground">
                    All positions are healthy! 🎉
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Health Factor</TableHead>
                        <TableHead>Collateral</TableHead>
                        <TableHead>Debt</TableHead>
                        <TableHead>Max Liquidatable</TableHead>
                        <TableHead>Your Profit (5%)</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.map((position) => (
                        <TableRow key={position.user} className={position.isEmergency ? "bg-red-950/20" : ""}>
                            <TableCell className="font-mono text-sm">
                                {position.user.slice(0, 6)}...{position.user.slice(-4)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {position.isEmergency && (
                                        <Zap className="h-4 w-4 text-red-500 animate-pulse" />
                                    )}
                                    <Badge variant={position.isEmergency ? "destructive" : "default"}>
                                        {position.healthFactor.toFixed(3)}
                                    </Badge>
                                    {position.isEmergency && (
                                        <span className="text-xs text-red-400">Emergency</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-green-400">
                                ${position.collateralUSD.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-red-400">
                                ${position.debtUSD.toFixed(2)}
                            </TableCell>
                            <TableCell className="font-bold">
                                ${position.maxLiquidatable.toFixed(2)}
                                <div className="text-xs text-muted-foreground">
                                    {position.isEmergency ? "100%" : "50%"} of debt
                                </div>
                            </TableCell>
                            <TableCell className="text-green-500 font-bold">
                                ${position.profit.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                                <LiquidateButton position={position} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
