/**
 * Bridge Validation Module
 * 
 * Functions for validating bridge inputs, amounts, addresses,
 * and providing user-friendly error messages
 */

import { isAddress, parseUnits } from 'viem';
import { validateBridgeRoute } from './chains';
import type { ValidationResult, BridgeWarning } from './types';

const MIN_BRIDGE_AMOUNT = 1; // 1 USDC
const MAX_BRIDGE_AMOUNT = 1000000; // 1M USDC

/**
 * Validate complete bridge inputs
 */
export function validateBridgeInputs(params: {
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress?: `0x${string}`;
}): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate amount
    const amountValidation = validateAmount(params.amount);
    errors.push(...amountValidation.errors);
    warnings.push(...amountValidation.warnings);

    // Validate route
    const routeValidation = validateBridgeRoute(params.fromChainId, params.toChainId);
    errors.push(...routeValidation.errors);
    warnings.push(...routeValidation.warnings.map(w => w.message));

    // Validate recipient address if provided
    if (params.recipientAddress) {
        const addressValidation = validateAddress(params.recipientAddress);
        errors.push(...addressValidation.errors);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate amount
 */
export function validateAmount(amount: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if amount is provided
    if (!amount || amount.trim() === '') {
        errors.push('Amount is required');
        return { valid: false, errors, warnings };
    }

    // Check if amount is a valid number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
        errors.push('Amount must be a valid number');
        return { valid: false, errors, warnings };
    }

    // Check if amount is positive
    if (amountNum <= 0) {
        errors.push('Amount must be greater than 0');
        return { valid: false, errors, warnings };
    }

    // Check minimum amount
    if (amountNum < MIN_BRIDGE_AMOUNT) {
        errors.push(`Minimum bridge amount is ${MIN_BRIDGE_AMOUNT} USDC`);
    }

    // Check maximum amount
    if (amountNum > MAX_BRIDGE_AMOUNT) {
        errors.push(`Maximum bridge amount is ${MAX_BRIDGE_AMOUNT.toLocaleString()} USDC`);
    }

    // Warnings for large amounts
    if (amountNum > 10000) {
        warnings.push('Large amount detected. Please verify the amount is correct.');
    }

    // Warnings for very small amounts
    if (amountNum < 5 && amountNum >= MIN_BRIDGE_AMOUNT) {
        warnings.push('Small amount. Gas fees may be significant relative to the transfer amount.');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!address || address.trim() === '') {
        errors.push('Address is required');
        return { valid: false, errors, warnings };
    }

    if (!isAddress(address)) {
        errors.push('Invalid Ethereum address format');
        return { valid: false, errors, warnings };
    }

    // Check for zero address
    if (address.toLowerCase() === '0x0000000000000000000000000000000000000000') {
        errors.push('Cannot send to zero address');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.message) {
        // Parse common error messages
        const message = error.message.toLowerCase();

        if (message.includes('user rejected')) {
            return 'Transaction was rejected by user';
        }

        if (message.includes('insufficient funds')) {
            return 'Insufficient funds for transaction';
        }

        if (message.includes('gas')) {
            return 'Insufficient gas for transaction';
        }

        if (message.includes('nonce')) {
            return 'Transaction nonce error. Please try again.';
        }

        if (message.includes('network')) {
            return 'Network error. Please check your connection.';
        }

        if (message.includes('timeout')) {
            return 'Transaction timeout. Please try again.';
        }

        return error.message;
    }

    return 'An unknown error occurred';
}

/**
 * Get transfer warnings based on parameters
 */
export function getTransferWarnings(params: {
    fromChainId: number;
    toChainId: number;
    amount: string;
}): BridgeWarning[] {
    const warnings: BridgeWarning[] = [];

    // Amount warnings
    const amountNum = parseFloat(params.amount);
    if (!isNaN(amountNum)) {
        if (amountNum > 10000) {
            warnings.push({
                type: 'amount',
                severity: 'medium',
                message: 'Large transfer amount. Please verify the amount is correct.',
                icon: '⚠️',
            });
        }

        if (amountNum < 5 && amountNum >= MIN_BRIDGE_AMOUNT) {
            warnings.push({
                type: 'amount',
                severity: 'low',
                message: 'Small amount. Gas fees may be significant.',
                icon: 'ℹ️',
            });
        }
    }

    // Time warnings
    if (params.fromChainId === 11155111 || params.toChainId === 11155111) {
        warnings.push({
            type: 'time',
            severity: 'low',
            message: 'Ethereum transfers take ~15-20 minutes due to finality requirements.',
            icon: '⏱️',
        });
    }

    // Route validation warnings
    const routeValidation = validateBridgeRoute(params.fromChainId, params.toChainId);
    warnings.push(...routeValidation.warnings);

    return warnings;
}

/**
 * Sanitize amount input
 */
export function sanitizeAmount(input: string): string {
    // Remove any non-numeric characters except decimal point
    let sanitized = input.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 6 decimal places (USDC precision)
    if (parts.length === 2 && parts[1].length > 6) {
        sanitized = parts[0] + '.' + parts[1].slice(0, 6);
    }

    return sanitized;
}

/**
 * Validate wallet connection
 */
export function validateWalletConnection(isConnected: boolean, address?: string): ValidationResult {
    const errors: string[] = [];

    if (!isConnected) {
        errors.push('Wallet not connected. Please connect your wallet.');
    }

    if (!address) {
        errors.push('Wallet address not found. Please reconnect your wallet.');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings: [],
    };
}
