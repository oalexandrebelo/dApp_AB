/**
 * Bridge Transactions Module
 * 
 * Functions for managing bridge transaction history,
 * storing in localStorage, and tracking status
 */

import type { TransactionHistory } from './types';

const STORAGE_KEY = 'nexux_bridge_history';
const MAX_HISTORY_ITEMS = 100;

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Get all bridge transactions from history
 */
export function getBridgeHistory(): TransactionHistory[] {
    if (!isBrowser()) return [];

    try {
        const history = localStorage.getItem(STORAGE_KEY);
        if (!history) return [];

        const parsed = JSON.parse(history);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('[Transactions] Error reading history:', error);
        return [];
    }
}

/**
 * Add a transaction to history
 */
export function addToHistory(transaction: Omit<TransactionHistory, 'id' | 'timestamp'>): void {
    if (!isBrowser()) return;

    try {
        const history = getBridgeHistory();

        const newTransaction: TransactionHistory = {
            ...transaction,
            id: generateTransactionId(),
            timestamp: Date.now(),
        };

        // Add to beginning of array
        history.unshift(newTransaction);

        // Keep only last MAX_HISTORY_ITEMS
        const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('[Transactions] Error adding to history:', error);
    }
}

/**
 * Update transaction status
 */
export function updateHistoryStatus(
    burnTxHash: `0x${string}`,
    updates: Partial<Pick<TransactionHistory, 'status' | 'mintTxHash' | 'messageHash'>>
): void {
    if (!isBrowser()) return;

    try {
        const history = getBridgeHistory();
        const index = history.findIndex(tx => tx.burnTxHash === burnTxHash);

        if (index === -1) {
            console.warn('[Transactions] Transaction not found:', burnTxHash);
            return;
        }

        history[index] = {
            ...history[index],
            ...updates,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('[Transactions] Error updating status:', error);
    }
}

/**
 * Get transaction by burn tx hash
 */
export function getTransactionByHash(burnTxHash: `0x${string}`): TransactionHistory | null {
    const history = getBridgeHistory();
    return history.find(tx => tx.burnTxHash === burnTxHash) || null;
}

/**
 * Get pending transactions (not complete or failed)
 */
export function getPendingTransactions(): TransactionHistory[] {
    const history = getBridgeHistory();
    return history.filter(tx => tx.status === 'pending' || tx.status === 'ready_to_mint');
}

/**
 * Clear all transaction history
 */
export function clearHistory(): void {
    if (!isBrowser()) return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('[Transactions] Error clearing history:', error);
    }
}

/**
 * Export history as JSON
 */
export function exportHistory(): string {
    const history = getBridgeHistory();
    return JSON.stringify(history, null, 2);
}

/**
 * Import history from JSON
 */
export function importHistory(jsonString: string): boolean {
    if (!isBrowser()) return false;

    try {
        const parsed = JSON.parse(jsonString);

        if (!Array.isArray(parsed)) {
            throw new Error('Invalid history format');
        }

        // Validate structure
        const isValid = parsed.every(item =>
            item.id &&
            item.fromChainId &&
            item.toChainId &&
            item.amount &&
            item.burnTxHash &&
            item.status &&
            item.timestamp
        );

        if (!isValid) {
            throw new Error('Invalid transaction structure');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
    } catch (error) {
        console.error('[Transactions] Error importing history:', error);
        return false;
    }
}

/**
 * Get transaction count
 */
export function getTransactionCount(): number {
    return getBridgeHistory().length;
}

/**
 * Get transactions by status
 */
export function getTransactionsByStatus(status: TransactionHistory['status']): TransactionHistory[] {
    const history = getBridgeHistory();
    return history.filter(tx => tx.status === status);
}

/**
 * Get recent transactions (last N)
 */
export function getRecentTransactions(count: number = 10): TransactionHistory[] {
    const history = getBridgeHistory();
    return history.slice(0, count);
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for display
 */
export function formatTransactionTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
