import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

// Schema for user creation/update
const UserSchema = z.object({
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { address: address.toLowerCase() },
            include: {
                positions: true,
                transactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('[API] Get User Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = UserSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors },
                { status: 400 }
            );
        }

        const { address, email, username } = result.data;

        const user = await prisma.user.upsert({
            where: { address: address.toLowerCase() },
            update: {
                email,
                username,
                lastLoginAt: new Date(),
            },
            create: {
                address: address.toLowerCase(),
                email,
                username,
                lastLoginAt: new Date(),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[API] Create/Update User Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
