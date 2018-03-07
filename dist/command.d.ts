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
}
export interface CommandCreator<T = any, U = T> {
    (payload: U): Command<T>;
    type: string;
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
export declare function withMeta(meta: Hash): <T extends Command<any>>(command: T) => T & {
    meta: Hash<any>;
};
