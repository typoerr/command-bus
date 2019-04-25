import { Observable } from 'rxjs';
interface Command {
    type: string;
    payload: unknown;
    [key: string]: any;
}
interface CommandCreator {
    type: string;
    (...val: any[]): any;
}
declare type ListenerType = string | symbol | {
    type: string;
};
export declare class CommandBus extends Observable<Command> {
    static WILDCARD: string;
    static getType(type: ListenerType): any;
    on: {
        <T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
        (type: ListenerType, handler: Function): Function;
    };
    off: {
        <T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
        (type: ListenerType, handler: Function): Function;
    };
    addEventListener: {
        <T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
        (type: ListenerType, handler: Function): Function;
    };
    removeEventListener: {
        <T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
        (type: ListenerType, handler: Function): Function;
    };
    protected registory: Map<string | symbol, Set<Function>>;
    constructor();
    addListener<T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
    addListener(type: ListenerType, handler: Function): Function;
    removeListener<T extends CommandCreator>(type: T, handler: (val: Parameters<T>) => void): Function;
    removeListener(type: ListenerType, handler: Function): Function;
    dispatch<T extends Command>(command: T): T;
    getListeners(type: ListenerType): Set<Function> | undefined;
}
export {};
