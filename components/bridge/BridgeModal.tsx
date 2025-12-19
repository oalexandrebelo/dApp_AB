"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";

interface BridgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    autoSupply?: boolean;
}

export function BridgeModal({ isOpen, onClose, autoSupply = true }: BridgeModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bridge USDC">\n            <div className="space-y-6 p-6">
            {/* Info Message */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Bridge Functionality Moved
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        The bridge functionality has been moved to the dedicated Bridge page for a better experience.
                    </p>
                </div>
            </div>

            {/* Redirect Button */}
            <div className="flex gap-3">
                <Button
                    onClick={() => {
                        onClose();
                        window.location.href = '/dashboard/bridge';
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                    Go to Bridge Page
                </Button>
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                >
                    Close
                </Button>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground text-center">
                <p>The Bridge page offers:</p>
                <ul className="mt-2 space-y-1">
                    <li>• 6 CCTP testnets supported</li>
                    <li>• Real-time balance checking</li>
                    <li>• Fee estimation</li>
                    <li>• Transaction history</li>
                    <li>• Smart warnings</li>
                </ul>
            </div>
        </div>
        </Modal>
    );
}
