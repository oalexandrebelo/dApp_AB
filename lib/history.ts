
export type TransactionType = 'send' | 'receive' | 'supply' | 'borrow';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
    hash: string;
    timestamp: number;
    type: TransactionType;
    token: string;
    amount: string;
    status: TransactionStatus;
    to: string;
    user: string; // Mandatory now
}

const STORAGE_KEY = "arc_transactions";

export function saveTransaction(tx: Omit<Transaction, 'timestamp'>) {
    if (typeof window === 'undefined') return;

    try {
        const newTx: Transaction = {
            ...tx,
            timestamp: Date.now(),
        };

        const stored = localStorage.getItem(STORAGE_KEY);
        let history: Transaction[] = [];

        if (stored) {
            try {
                history = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse transaction history", e);
                // If corrupted, start fresh but maybe backup? For now, start fresh to fix "crash"
                history = [];
            }
        }

        // Add to top
        history.unshift(newTx);

        // Limit size? Maybe keep last 100 to avoid localStorage overflow
        if (history.length > 100) {
            history = history.slice(0, 100);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

        // Dispatch event for UI updates
        window.dispatchEvent(new Event('transaction-updated'));

    } catch (error) {
        console.error("Failed to save transaction", error);
    }
}

export function getTransactions(userAddress?: string): Transaction[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const history: Transaction[] = JSON.parse(stored);

        if (!userAddress) return []; // Or return all? Better safe: return empty if no user provided

        return history.filter(tx =>
            // Case insensitive comparison
            tx.user && tx.user.toLowerCase() === userAddress.toLowerCase()
        ).sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
        console.error("Failed to retrieve transactions", error);
        return [];
    }
}
