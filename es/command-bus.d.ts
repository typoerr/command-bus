import { Command, AnyCommandCreator } from './command';
export declare type BusTarget<T = any> = typeof WILDCARD | symbol | string | AnyCommandCreator<T>;
export declare type CommandListener<T = any> = (commad: Command<T>) => any;
export declare type CommandBus = ReturnType<typeof createCommandBus>;
export declare const WILDCARD = "*";
export declare function createCommandBus(): {
    dispatch: (command: Command<any>) => Command<any>;
    on: <T = any>(target: BusTarget<T>, listener: CommandListener<T>) => CommandListener<T>;
    off: (target: BusTarget<any>, listener: CommandListener<any>) => CommandListener<any>;
    getListeners: (target: BusTarget<any>) => CommandListener<any>[];
    addEventListener: <T = any>(target: BusTarget<T>, listener: CommandListener<T>) => CommandListener<T>;
    removeEventListener: (target: BusTarget<any>, listener: CommandListener<any>) => CommandListener<any>;
    addListener: <T = any>(target: BusTarget<T>, listener: CommandListener<T>) => CommandListener<T>;
    removeListener: (target: BusTarget<any>, listener: CommandListener<any>) => CommandListener<any>;
};
