"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAccount } from "wagmi";

import { Transaction, getTransactions } from "@/lib/history";

export function TransactionHistoryTable() {
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
        window.addEventListener('transaction-updated', loadTransactions);

        return () => {
            window.removeEventListener('storage', loadTransactions);
            window.removeEventListener('transaction-updated', loadTransactions);
        };
    }, [address]);

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                <p>No transactions found</p>
                <p className="text-xs mt-1">Make a transfer to see it here.</p>
            </div>
        );
    }

    // Helper for formatting without external libs
    const formatDate = (ts: number) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(ts));
    };

    const formatTime = (ts: number) => {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(ts));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.hash}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-full ${tx.type === 'send' || tx.type === 'supply'
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : 'bg-green-500/10 text-green-500'
                                            }`}>
                                            {tx.type === 'send' || tx.type === 'supply'
                                                ? <ArrowUpRight className="h-4 w-4" />
                                                : <ArrowDownLeft className="h-4 w-4" />
                                            }
                                        </div>
                                        <span className="font-medium capitalize">
                                            {(tx.type === 'supply' || tx.type === 'send') ? 'Send Supply' :
                                                (tx.type === 'borrow' || tx.type === 'receive') ? 'Receive Borrow' :
                                                    tx.type}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-medium">
                                        {tx.token}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span>{formatDate(tx.timestamp)}</span>
                                        <span className="text-xs">{formatTime(tx.timestamp)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                                        className={`
                                            ${tx.status === 'success' ? 'bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-200' : ''}
                                            ${tx.status === 'pending' ? 'bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-200' : ''}
                                            ${tx.status === 'failed' ? 'bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-200' : ''}
                                        `}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {tx.amount}
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-muted rounded-full block text-muted-foreground hover:text-foreground transition-colors"
                                        title="View on ArcScan"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
