"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
    hash: string;
    type: 'supply' | 'borrow' | 'repay' | 'withdraw' | 'liquidation' | 'flashloan';
    asset: string;
    amount: string;
    timestamp: number;
}

// Local storage helper
const STORAGE_KEY = 'arc_lending_transactions';

export function getTransactions(address: string): Transaction[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${STORAGE_KEY}_${address}`);
    return stored ? JSON.parse(stored) : [];
}

export function addTransaction(address: string, tx: Transaction) {
    if (typeof window === 'undefined') return;
    const transactions = getTransactions(address);
    transactions.unshift(tx); // Add to beginning
    // Keep only last 50 transactions
    const limited = transactions.slice(0, 50);
    localStorage.setItem(`${STORAGE_KEY}_${address}`, JSON.stringify(limited));
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new Event('transactionAdded'));
}

export function TransactionHistory() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const loadTransactions = () => {
            if (!address) {
                setTransactions([]);
                return;
            }
            const txs = getTransactions(address);
            setTransactions(txs);
        };

        loadTransactions();

        // Listen for storage events (if multiple tabs) or custom event
        window.addEventListener('storage', loadTransactions);
        window.addEventListener('transactionAdded', loadTransactions);

        return () => {
            window.removeEventListener('storage', loadTransactions);
            window.removeEventListener('transactionAdded', loadTransactions);
        };
    }, [address]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'supply':
                return <ArrowUpRight className="h-4 w-4 text-green-500" />;
            case 'borrow':
                return <ArrowDownRight className="h-4 w-4 text-orange-500" />;
            case 'repay':
                return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
            case 'withdraw':
                return <ArrowDownRight className="h-4 w-4 text-purple-500" />;
            case 'liquidation':
                return <ArrowLeftRight className="h-4 w-4 text-red-500" />;
            case 'flashloan':
                return <ArrowLeftRight className="h-4 w-4 text-yellow-500" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (type) {
            case 'supply':
                return 'default';
            case 'borrow':
                return 'secondary';
            case 'repay':
                return 'outline';
            case 'withdraw':
                return 'outline';
            case 'liquidation':
                return 'destructive';
            default:
                return 'default';
        }
    };

    if (!address) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Connect wallet to view transaction history
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No transactions yet
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Asset</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Tx</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.hash}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(tx.type)}
                                            <Badge variant={getTypeBadgeVariant(tx.type)}>
                                                <span className="capitalize">
                                                    {tx.type === 'supply' ? 'Supply' :
                                                        tx.type === 'borrow' ? 'Borrow' :
                                                            tx.type === 'withdraw' ? 'Withdraw' :
                                                                tx.type === 'repay' ? 'Repay' :
                                                                    tx.type}
                                                </span>
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            {tx.asset}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {tx.amount}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={`https://testnet.arcscan.net/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
                                        >
                                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
