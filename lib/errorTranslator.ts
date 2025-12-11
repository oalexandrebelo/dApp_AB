/**
 * Translates Web3/blockchain errors into human-readable messages
 */

interface ErrorTranslation {
    title: string;
    description: string;
    action?: string;
}

const errorMap: Record<string, ErrorTranslation> = {
    // Approval errors
    'insufficient allowance': {
        title: 'Token Approval Needed',
        description: 'You need to approve this token before you can supply it.',
        action: 'Approve Token',
    },

    // Balance errors
    'insufficient balance': {
        title: 'Insufficient Balance',
        description: 'You don\'t have enough tokens in your wallet for this transaction.',
        action: 'Get Tokens',
    },
    'transfer amount exceeds balance': {
        title: 'Insufficient Balance',
        description: 'You don\'t have enough tokens for this transaction.',
    },

    // Health factor errors
    'health factor too low': {
        title: 'Position Too Risky',
        description: 'Borrowing this amount would put you at risk of liquidation (Health Factor < 1.0).',
        action: 'Reduce Amount',
    },
    'health factor below 1': {
        title: 'Liquidation Risk',
        description: 'Your Health Factor is below 1.0. You need to repay debt or add collateral.',
        action: 'Repay Debt',
    },

    // Collateral errors
    'insufficient collateral': {
        title: 'Not Enough Collateral',
        description: 'You need to supply more collateral before you can borrow this amount.',
        action: 'Supply More',
    },

    // User rejection
    'user rejected': {
        title: 'Transaction Cancelled',
        description: 'You cancelled the transaction in your wallet.',
    },
    'user denied': {
        title: 'Transaction Cancelled',
        description: 'You cancelled the transaction in your wallet.',
    },

    // Network errors
    'network error': {
        title: 'Network Error',
        description: 'Unable to connect to the blockchain. Check your internet connection.',
        action: 'Retry',
    },
    'timeout': {
        title: 'Transaction Timeout',
        description: 'The transaction took too long. It may still be pending.',
        action: 'Check Status',
    },

    // Gas errors
    'insufficient funds for gas': {
        title: 'Insufficient Gas',
        description: 'You don\'t have enough ETH to pay for gas fees.',
        action: 'Get ETH',
    },
    'gas required exceeds allowance': {
        title: 'Gas Limit Too Low',
        description: 'The transaction requires more gas than allowed.',
    },

    // Contract errors
    'execution reverted': {
        title: 'Transaction Failed',
        description: 'The transaction was rejected by the smart contract. Check your inputs.',
    },
    'contract call failed': {
        title: 'Contract Error',
        description: 'Unable to interact with the smart contract. Try again later.',
    },

    // Borrow cap errors
    'borrow cap exceeded': {
        title: 'Borrow Limit Reached',
        description: 'The protocol has reached its maximum borrow capacity for this asset.',
    },
    'supply cap exceeded': {
        title: 'Supply Limit Reached',
        description: 'The protocol has reached its maximum supply capacity for this asset.',
    },
};

export function translateError(error: any): ErrorTranslation {
    const errorMessage = error?.message?.toLowerCase() || error?.toString()?.toLowerCase() || '';

    // Try to find matching error
    for (const [key, translation] of Object.entries(errorMap)) {
        if (errorMessage.includes(key)) {
            return translation;
        }
    }

    // Default error
    return {
        title: 'Transaction Error',
        description: error?.message || 'An unexpected error occurred. Please try again.',
    };
}

export function getErrorAction(error: any): string | undefined {
    const translation = translateError(error);
    return translation.action;
}
