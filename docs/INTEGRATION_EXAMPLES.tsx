/**
 * Example: How to Use the New Service Layer
 * 
 * This file demonstrates how to integrate the new lending.service.ts
 * and useContractEvents into existing components.
 * 
 * DELETE THIS FILE AFTER READING - IT'S JUST AN EXAMPLE
 */

import { useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { LendingService, buildSupplyParams, emitSupplySuccess } from '@/lib/services/lending.service';
import { useToast } from '@/hooks/use-toast';

// ========================================
// EXAMPLE 1: Using Service for Validation
// ========================================

export function SupplyModalExample() {
    const [amount, setAmount] = useState('');
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { toast } = useToast();

    const handleSupply = async () => {
        // ✅ NEW WAY: Use service for validation
        const validation = LendingService.validateSupplyAmount(amount, '1000');

        if (!validation.valid) {
            toast({
                title: 'Error',
                description: validation.error,
                variant: 'destructive',
            });
            return;
        }

        try {
            // ✅ NEW WAY: Use builder for contract params
            const params = buildSupplyParams(
                '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC
                amount,
                6, // decimals
                address!,
                0 // referral code
            );

            // Call contract
            const hash = await writeContractAsync(params);

            // ✅ NEW WAY: Emit event for global listeners
            emitSupplySuccess({
                hash,
                asset: params.address,
                amount,
                symbol: 'USDC',
            });

            toast({
                title: 'Success!',
                description: 'Supply transaction submitted',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleSupply}>Supply</button>
        </div>
    );
}

// ========================================
// EXAMPLE 2: Using Constants
// ========================================

import { LENDING_PARAMETERS, calculateBorrowRate, getRiskLevel } from '@/lib/constants';

export function DashboardExample() {
    const healthFactor = 1.5;
    const utilizationRate = 0.75;

    // ✅ Use constants
    const ltv = LENDING_PARAMETERS.NORMAL.LTV;
    const riskLevel = getRiskLevel(healthFactor);
    const borrowRate = calculateBorrowRate(utilizationRate);

    return (
        <div>
            <p>LTV: {(ltv * 100).toFixed(0)}%</p>
            <p>Health Factor: {healthFactor} ({riskLevel})</p>
            <p>Borrow Rate: {(borrowRate * 100).toFixed(2)}% APY</p>
        </div>
    );
}

// ========================================
// EXAMPLE 3: Using Event Bus
// ========================================

import { useEffect } from 'react';
import { eventBus } from '@/lib/events/eventBus';

export function NotificationExample() {
    const { toast } = useToast();

    useEffect(() => {
        // Listen to supply success
        const handleSupplySuccess = (data: any) => {
            toast({
                title: '✅ Supply Successful',
                description: `Supplied ${data.amount} ${data.symbol}`,
            });
        };

        eventBus.on('supply:success', handleSupplySuccess);

        // Cleanup
        return () => {
            eventBus.off('supply:success', handleSupplySuccess);
        };
    }, [toast]);

    return null;
}

// ========================================
// EXAMPLE 4: Using Contract Events (in layout)
// ========================================

import { useGlobalContractEvents } from '@/hooks/useContractEvents';

export function RootLayout({ children }: { children: React.ReactNode }) {
    // ✅ Setup global contract event listeners
    useGlobalContractEvents();

    return <div>{children}</div>;
}

// ========================================
// EXAMPLE 5: Getting User Position
// ========================================

import { getUserPositionSummary } from '@/lib/services/lending.service';

export function PositionExample() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [position, setPosition] = useState<any>(null);

    const loadPosition = async () => {
        if (!address || !publicClient) return;

        try {
            const pos = await getUserPositionSummary(publicClient, address);
            setPosition(pos);
        } catch (error) {
            console.error('Failed to load position:', error);
        }
    };

    useEffect(() => {
        loadPosition();
    }, [address]);

    if (!position) return <div>Loading...</div>;

    return (
        <div>
            <h3>Your Position</h3>
            <p>Total Supplied: ${position.totalSupplied.toFixed(2)}</p>
            <p>Total Borrowed: ${position.totalBorrowed.toFixed(2)}</p>
            <p>Health Factor: {position.healthFactor.toFixed(2)}</p>
            <p>Risk Level: {position.riskLevel}</p>
            <p>Available to Borrow: ${position.availableBorrow.toFixed(2)}</p>
        </div>
    );
}

// ========================================
// MIGRATION GUIDE
// ========================================

/**
 * OLD WAY (before service layer):
 * 
 * const { writeContract } = useWriteContract();
 * 
 * writeContract({
 *   address: LENDING_POOL_ADDRESS,
 *   abi: LENDING_POOL_ABI,
 *   functionName: 'supply',
 *   args: [asset, parseUnits(amount, 6), address, 0],
 * });
 * 
 * 
 * NEW WAY (with service layer):
 * 
 * const params = buildSupplyParams(asset, amount, 6, address!);
 * const hash = await writeContractAsync(params);
 * emitSupplySuccess({ hash, asset, amount, symbol: 'USDC' });
 * 
 * 
 * BENEFITS:
 * - ✅ Validation built-in
 * - ✅ Event emission automatic
 * - ✅ Reusable code
 * - ✅ Type-safe
 * - ✅ Easier to test
 */
