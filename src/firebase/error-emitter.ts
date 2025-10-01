
import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type ErrorEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We need to extend the EventEmitter type to have typed events.
declare interface ErrorEventEmitter {
  on<U extends keyof ErrorEvents>(event: U, listener: ErrorEvents[U]): this;
  emit<U extends keyof ErrorEvents>(event: U, ...args: Parameters<ErrorEvents[U]>): boolean;
}

class ErrorEventEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEventEmitter();
