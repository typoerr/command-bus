import { Hash } from '@cotto/utils.ts';
export interface Command<T = any> {
    type: string;
    payload: T;
    meta?: any;
    [key: string]: any;
}
export interface EmptyCommandCreator {
    (): Command<undefined>;
    type: string;
    isolated: boolean;
}
export interface CommandCreator<T = any, U = T> {
    (payload: U, meta?: Hash): Command<T>;
    type: string;
    isolated: boolean;
}
export declare type AnyCommandCreator = EmptyCommandCreator | CommandCreator;
export declare function scoped(scope: string): {
    (type: string): EmptyCommandCreator;
    <T>(type: string): CommandCreator<T, T>;
    <T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>;
};
export declare const create: {
    (type: string): EmptyCommandCreator;
    <T>(type: string): CommandCreator<T, T>;
    <T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>;
};
export declare function match<T>(creator: CommandCreator<T, any>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
export declare function isolate<T extends AnyCommandCreator>(id: string, creator: T): T;
export declare function isolate<T extends AnyCommandCreator>(id: string, creators: T[]): T[];
export declare function isIsolatedCommand(command: Command): boolean;
export declare function isIsoaltedCreator(creator: AnyCommandCreator): boolean;
export declare function getRawType(command: Command): string;
