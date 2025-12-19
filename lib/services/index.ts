/**
 * Services Index
 * 
 * Central export point for all services
 */

export * from './lending.service';
export * from './bridge.service';

// Event bus
export { eventBus, type EventMap } from '@/lib/events/eventBus';
