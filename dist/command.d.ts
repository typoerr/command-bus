import { Hash } from '@cotto/utils.ts';
export interface Command<T = any> {
    type: string;
    payload: T;
    meta?: any;
    [key: string]: any;
}
export declare type CommandCreator<P, T = undefined> = T extends undefined | never ? {
    type: string;
    (): Command<P>;
} : {
    type: string;
    (value: T): Command<P>;
};
export declare type AnyCommandCreator<P> = CommandCreator<P, any>;
export declare function scoped(scope: string): {
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
    <P, T>(type: string, mapper: () => P, extra?: ((value: T) => Hash<any>) | undefined): CommandCreator<P, T>;
    <P, T>(type: string, mapper: (value: T) => P, extra?: (() => Hash<any>) | undefined): CommandCreator<P, T>;
    <P, T>(type: string, mapper: (value: T) => P, extra?: ((value: T) => Hash<any>) | undefined): CommandCreator<P, T>;
};
export declare const create: {
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
    <P, T>(type: string, mapper: () => P, extra?: ((value: T) => Hash<any>) | undefined): CommandCreator<P, T>;
    <P, T>(type: string, mapper: (value: T) => P, extra?: (() => Hash<any>) | undefined): CommandCreator<P, T>;
    <P, T>(type: string, mapper: (value: T) => P, extra?: ((value: T) => Hash<any>) | undefined): CommandCreator<P, T>;
};
export declare function match<T>(creator: AnyCommandCreator<T>): (command: any) => command is Command<T>;
export declare function isCommand(command: any): command is Command;
