import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const TransactionSchema = z.object({
    txHash: z.string(),
    chainId: z.number(),
    type: z.enum([
        'SUPPLY', 'WITHDRAW', 'BORROW', 'REPAY', 'LIQUIDATE',
        'APPROVE', 'TRANSFER', 'CCTP_BURN', 'CCTP_MINT'
    ]),
    amount: z.string().optional(), // Decimal as string
    tokenAddress: z.string().optional(),
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
    userId: z.string(), // User ID (UUID) or Address? Usually API receives address and finds user
    userAddress: z.string(), // We'll use address lookup
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { address: address.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json({ transactions: [], total: 0 });
        }

        const [transactions, total] = await prisma.$transaction([
            prisma.transaction.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.transaction.count({
                where: { userId: user.id },
            }),
        ]);

        return NextResponse.json({ transactions, total });
    } catch (error) {
        console.error('[API] Get Transactions Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = TransactionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors }, { status: 400 });
        }

        const { userAddress, ...txData } = result.data;

        // Find or create user
        const user = await prisma.user.upsert({
            where: { address: userAddress.toLowerCase() },
            create: { address: userAddress.toLowerCase() },
            update: {},
        });

        // Find/Create Wallet
        const wallet = await prisma.wallet.upsert({
            where: {
                userId_chainId: {
                    userId: user.id,
                    chainId: txData.chainId
                }
            },
            create: {
                userId: user.id,
                chainId: txData.chainId,
                address: userAddress.toLowerCase(),
                walletType: 'EOA',
            },
            update: {},
        });

        // Create Transaction
        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                walletId: wallet.id,
                txHash: txData.txHash,
                chainId: txData.chainId,
                type: txData.type as any, // Cast to enum
                status: (txData.status as any) || 'PENDING',
                amount: txData.amount,
                tokenAddress: txData.tokenAddress,
                contractAddress: txData.tokenAddress || '', // usage fallback
                methodName: txData.type,
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('[API] Create Transaction Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
