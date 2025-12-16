/**
 * Circle CCTP Types
 */

export interface BridgeParams {
    fromChainId: number;
    toChainId: number;
    amount: string;
    recipientAddress: `0x${string}`;
}

export interface BridgeProgress {
    step: 'approve' | 'burn' | 'attestation' | 'mint' | 'complete';
    message: string;
    txHash?: `0x${string}`;
}

export interface BridgeResult {
    burnTxHash: `0x${string}`;
    messageHash: `0x${string}`;
    attestation?: string;
    toChainId: number;
    status: 'pending_attestation' | 'ready_to_mint' | 'complete';
}

export interface AttestationResponse {
    status: 'pending' | 'complete';
    attestation?: string;
}
