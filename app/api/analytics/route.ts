import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // In a real scenario, this would aggregate data from the 'ProtocolMetrics' table
        // For now, since we haven't seeded data, we'll try to fetch or return a structured empty state/mock
        // to avoid crashing if the DB isn't running.

        // Example Prisma Query:
        /*
        const metrics = await prisma.protocolMetrics.findFirst({
            orderBy: { timestamp: 'desc' }
        });
        */

        // Returning mock data structure that matches the frontend's expectation but served from "API"
        return NextResponse.json({
            tvl: [
                { date: "Oct 01", value: 1200000 },
                { date: "Oct 02", value: 1350000 },
                { date: "Oct 03", value: 4000000 },
            ],
            volume: [
                { date: "Oct 01", amount: 50000 },
                { date: "Oct 02", amount: 150000 },
            ]
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
