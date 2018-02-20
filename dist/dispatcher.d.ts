import { Command } from './command';
import { EventEmitter2, ConstructorOptions } from 'eventemitter2';
export declare type DispatcherOptions = ConstructorOptions;
export declare class Dispatcher extends EventEmitter2 {
    dispatch<U extends Command>(command: U): U;
    subscribe<U extends Command>(listener: (command: U) => void): () => this;
}
