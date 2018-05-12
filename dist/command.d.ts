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
    (src: U): Command<T>;
    type: string;
}
export declare type CommandSrcMapper<T, U = undefined> = (value: T) => {
    payload?: U;
    [key: string]: any;
};
export declare type AnyCommandCreator<T = any> = EmptyCommandCreator | CommandCreator<T>;
export declare function scoped(scope: string): {
    (type: string): EmptyCommandCreator;
    <T>(type: string): CommandCreator<T, T>;
    <T = undefined, U = any>(type: string, mapper: CommandSrcMapper<U, T>): CommandCreator<T, U>;
};
export declare const create: {
    (type: string): EmptyCommandCreator;
    <T>(type: string): CommandCreator<T, T>;
    <T = undefined, U = any>(type: string, mapper: CommandSrcMapper<U, T>): CommandCreator<T, U>;
};
export declare function match<T>(creator: AnyCommandCreator<T>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
