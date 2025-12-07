
// Mock API service for historical data

export interface TVLData {
    date: string;
    value: number;
}

export interface VolumeData {
    date: string;
    amount: number;
}

export const fetchHistoricalTVL = async (): Promise<TVLData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate 30 days of mock data
    const data: TVLData[] = [];
    const baseValue = 5000000; // 5M start
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Random fluctuation
        const randomChange = (Math.random() - 0.4) * 100000;
        const value = baseValue + (30 - i) * 50000 + randomChange;

        data.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            value: Math.floor(value),
        });
    }

    return data;
};

export const fetchProtocolVolume = async (): Promise<VolumeData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data: VolumeData[] = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const amount = Math.random() * 500000 + 100000;

        data.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            amount: Math.floor(amount),
        });
    }

    return data;
}
