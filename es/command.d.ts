export interface Command<T = any> {
    type: string;
    payload: T;
    meta?: any;
    [key: string]: any;
}
export declare type CommandCreator<P, T> = T extends undefined | never ? {
    type: string;
    (): Command<P>;
} : {
    type: string;
    (src: T): Command<P>;
};
export declare type AnyCommandCreator<P = undefined> = CommandCreator<P, any>;
export declare function scoped(scope: string): <P = undefined, T = P>(type: string, mapper?: (value: T) => P, extra?: ((value: T) => {
    [key: string]: any;
}) | undefined) => CommandCreator<P, T>;
export declare const create: <P = undefined, T = P>(type: string, mapper?: (value: T) => P, extra?: ((value: T) => {
    [key: string]: any;
}) | undefined) => CommandCreator<P, T>;
export declare function match<T>(creator: AnyCommandCreator<T>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
