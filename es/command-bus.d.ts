import { AnyCommandCreator, Command } from './command';
import { Observable } from 'rxjs';
export declare type BusTarget = symbol | string | AnyCommandCreator;
export interface CommandListener {
    (command: Command): void;
}
export interface CommandCreatorListener<T extends AnyCommandCreator> {
    (command: ReturnType<T>): void;
}
export declare const WILDCARD = "*";
export declare class CommandBus extends Observable<Command> {
    addEventListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends AnyCommandCreator<any, {}>>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    removeEventListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends AnyCommandCreator<any, {}>>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    addListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends AnyCommandCreator<any, {}>>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    removeListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends AnyCommandCreator<any, {}>>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    protected _listeners: Map<string | symbol, Set<Function>>;
    constructor();
    on<T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
    on<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    off<T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
    off<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    dispatch<T extends Command>(command: T): T;
    getListeners(target: BusTarget): Function[];
}
