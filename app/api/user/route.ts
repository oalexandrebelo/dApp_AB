import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    try {
        // const user = await prisma.user.findUnique({
        //   where: { address },
        //   include: { positions: true }
        // });

        // Mock response for now
        return NextResponse.json({
            address,
            exists: true,
            positions: []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address } = body;

        // await prisma.user.upsert({
        //     where: { address },
        //     update: { lastLoginAt: new Date() },
        //     create: { address }
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
