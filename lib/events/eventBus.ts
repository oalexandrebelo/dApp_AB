/**
 * Event Bus
 * 
 * Central event emitter for application-wide events.
 * Enables decoupled communication between services and components.
 * 
 * Usage:
 * ```typescript
 * // Listen to event
 * eventBus.on('supply:success', (data) => {
 *   console.log('Supply successful:', data);
 * });
 * 
 * // Emit event
 * eventBus.emit('supply:success', { hash, amount });
 * 
 * // Remove listener
 * eventBus.off('supply:success', handler);
 * ```
 */

type EventHandler = (data: any) => void;

interface EventMap {
    // Lending events
    'supply:success': { hash: string; receipt: any; asset: string; amount: string };
    'supply:error': { error: Error; params: any };
    'borrow:success': { hash: string; receipt: any; asset: string; amount: string };
    'borrow:error': { error: Error; params: any };
    'repay:success': { hash: string; receipt: any; asset: string; amount: string };
    'repay:error': { error: Error; params: any };
    'withdraw:success': { hash: string; receipt: any; asset: string; amount: string };
    'withdraw:error': { error: Error; params: any };

    // Bridge events
    'bridge:started': { fromChain: number; toChain: number; amount: string };
    'bridge:completed': { hash: string; messageHash: string };
    'bridge:error': { error: Error; params: any };

    // Contract events  
    'supply:detected': { log: any };
    'borrow:detected': { log: any };
    'repay:detected': { log: any };
    'withdraw:detected': { log: any };
    'liquidation:detected': { log: any };

    // User events
    'wallet:connected': { address: string };
    'wallet:disconnected': void;
    'chain:changed': { chainId: number };

    // Notification events
    'notification:show': { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' };
    'alert:liquidation-risk': { healthFactor: number; address: string };
}

class EventBus {
    private listeners: Map<keyof EventMap, Set<EventHandler>> = new Map();
    private debug: boolean = process.env.NODE_ENV === 'development';

    /**
     * Subscribe to an event
     */
    on<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event)!.add(callback as EventHandler);

        if (this.debug) {
            console.log(`[EventBus] Listener added for: ${event}`);
        }
    }

    /**
     * Subscribe to an event (once)
     */
    once<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): void {
        const wrapper = (data: EventMap[K]) => {
            callback(data);
            this.off(event, wrapper as EventHandler);
        };

        this.on(event, wrapper as any);
    }

    /**
     * Unsubscribe from an event
     */
    off<K extends keyof EventMap>(event: K, callback: EventHandler): void {
        const handlers = this.listeners.get(event);
        if (handlers) {
            handlers.delete(callback);

            if (this.debug) {
                console.log(`[EventBus] Listener removed for: ${event}`);
            }
        }
    }

    /**
     * Emit an event
     */
    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
        const handlers = this.listeners.get(event);

        if (this.debug) {
            console.log(`[EventBus] Emitting: ${event}`, data);
        }

        if (handlers) {
            handlers.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[EventBus] Error in handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for an event, or all listeners if no event specified
     */
    removeAllListeners(event?: keyof EventMap): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }

        if (this.debug) {
            console.log(`[EventBus] All listeners removed${event ? ` for: ${event}` : ''}`);
        }
    }

    /**
     * Get count of listeners for an event
     */
    listenerCount(event: keyof EventMap): number {
        return this.listeners.get(event)?.size || 0;
    }
}

// Singleton instance
export const eventBus = new EventBus();

// Export type for external use
export type { EventMap };
