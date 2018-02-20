import { Hash } from '@cotto/utils.ts';
export interface Command<T = any> {
    type: string;
    payload: T;
    [key: string]: any;
}
export interface EmptyCommandCreator {
    (): Command<undefined>;
    type: string;
}
export interface CommandCreator<T = any, U = T> {
    (payload: U, meta?: any): Command<T>;
    type: string;
}
export declare type CommandCreators = Hash<CommandCreator | EmptyCommandCreator>;
export declare function create(type: string): EmptyCommandCreator;
export declare function create<T>(type: string): CommandCreator<T>;
export declare function create<T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>;
export declare function scoped<T extends CommandCreators>(scope: string, creators: T): T;
export declare function match<T>(creator: CommandCreator<T, any>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
