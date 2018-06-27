import { HashMap } from '@cotto/utils.ts';
export declare type Command<P = any, E = {}> = E & {
    type: string;
    payload: P;
};
export declare type CommandCreator<T, P, E = {}> = T extends void ? {
    type: string;
    (): Command<P, E>;
} : {
    type: string;
    (value: T): Command<P, E>;
};
export declare type AnyCommandCreator<P = any, E = {}> = CommandCreator<any, P, E>;
export interface CreatorFactory {
    (type: string): CommandCreator<undefined, undefined>;
    <P>(type: string): CommandCreator<P, P>;
    <P, E extends HashMap>(type: string, payload?: () => P, extra?: () => E): CommandCreator<undefined, P, E>;
    <T, P, E extends HashMap>(type: string, payload?: (val: T) => P, extra?: (val: T) => E): CommandCreator<T, P, E>;
}
export declare function factory(scope: string): CreatorFactory;
export declare const create: CreatorFactory;
export declare function match<T extends AnyCommandCreator>(creator: T): (command?: any) => command is ReturnType<T>;
export declare function isCommand<T extends Command>(command: any | T): command is Command<T['payload']>;
