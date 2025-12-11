"use client";

import { useEffect, useCallback } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowLeftRight,
    BarChart3,
    Briefcase,
    Settings,
} from "lucide-react";

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onNavigate?: (path: string) => void;
    onAction?: (action: string) => void;
}

export function CommandPalette({
    open,
    onOpenChange,
    onNavigate,
    onAction,
}: CommandPaletteProps) {

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    const handleSelect = useCallback((callback: () => void) => {
        onOpenChange(false);
        callback();
    }, [onOpenChange]);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Actions">
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("supply"))}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Supply Assets</span>
                        <span className="ml-auto text-xs text-muted-foreground">📈</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("borrow"))}>
                        <TrendingDown className="mr-2 h-4 w-4" />
                        <span>Borrow Assets</span>
                        <span className="ml-auto text-xs text-muted-foreground">📉</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("repay"))}>
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Repay Debt</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("withdraw"))}>
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Withdraw Assets</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("bridge"))}>
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        <span>Cross-Chain Bridge</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => handleSelect(() => onNavigate?.("markets"))}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Markets</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onNavigate?.("portfolio"))}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Portfolio</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect(() => onNavigate?.("analytics"))}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => handleSelect(() => onAction?.("emode"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>E-Mode Settings</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
