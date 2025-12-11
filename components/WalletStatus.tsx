"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Circle, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletStatus() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (!isConnected || !address) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            {/* Network Badge */}
            <Badge variant="outline" className="gap-1.5">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                <span className="text-xs">Arc Testnet</span>
            </Badge>

            {/* Wallet Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-mono text-xs">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                        <p className="text-xs text-muted-foreground">Connected Wallet</p>
                        <p className="font-mono text-xs mt-1">{address}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-xs cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(address);
                        }}
                    >
                        Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-xs cursor-pointer"
                        onClick={() => {
                            window.open(`https://testnet.arcscan.net/address/${address}`, '_blank');
                        }}
                    >
                        View on Explorer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-xs text-red-500 cursor-pointer"
                        onClick={() => disconnect()}
                    >
                        <LogOut className="h-3 w-3 mr-2" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
