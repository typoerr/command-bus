import { Hash } from '@cotto/utils.ts';
export interface Command<T = any> {
    type: string;
    payload: T;
    meta?: any;
    [key: string]: any;
}
export declare type CommandCreator<P, T> = T extends void | never ? {
    type: string;
    (): Command<P>;
} : {
    type: string;
    (value: T): Command<P>;
};
export declare type AnyCommandCreator<P> = CommandCreator<P, any>;
export declare function factory(scope: string): {
    (type: string): {
        (): Command<undefined>;
        type: string;
    };
    <P>(type: string): CommandCreator<P, P>;
    <P>(type: string, mapper: () => P): {
        (): Command<P>;
        type: string;
    };
    <P>(type: string, mapper: () => P, extra?: (() => Hash<any>) | undefined): {
        (): Command<P>;
        type: string;
    };
    <P, U>(type: string, mapper: () => P, extra?: ((value: U) => Hash<any>) | undefined): CommandCreator<P, U>;
    <P, U>(type: string, mapper: (value: U) => P, extra?: (() => Hash<any>) | undefined): CommandCreator<P, U>;
    <P, U>(type: string, mapper: (value: U) => P, extra?: ((value: U) => Hash<any>) | undefined): CommandCreator<P, U>;
};
export declare function match<T>(creator: AnyCommandCreator<T>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
