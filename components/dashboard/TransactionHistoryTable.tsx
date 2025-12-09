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

export type Transaction = {
    hash: string;
    timestamp: number;
    type: 'send' | 'receive' | 'supply' | 'borrow';
    token: 'USDC' | 'EURC';
    amount: string;
    status: 'pending' | 'success' | 'failed';
    to: string;
};

// ... inside component

{
    transactions.map((tx) => (
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
    ))
}
                    </TableBody >
                </Table >
            </CardContent >
        </Card >
    );
}
