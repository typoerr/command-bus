import { HashMap } from '@cotto/utils.ts';
export declare type OverwriteRet<Fn, R> = Fn extends ((a?: infer A, b?: infer B, c?: infer C, d?: infer D) => any) ? (a?: A, b?: B, c?: C, d?: D) => R : Fn extends ((a: infer A, b?: infer B, c?: infer C, d?: infer D) => any) ? (a: A, b?: B, c?: C, d?: D) => R : Fn extends ((a: infer A, b: infer B, c?: infer C, d?: infer D) => any) ? (a: A, b: B, c?: C, d?: D) => R : Fn extends ((a: infer A, b: infer B, c: infer C, d?: infer D) => any) ? (a: A, b: B, c: C, d?: D) => R : Fn extends ((a: infer A, b: infer B, c: infer C, d: infer D) => any) ? (a: A, b: B, c: C, d: D) => R : never;
interface AnyFunction {
    (...value: any[]): any;
}
export declare type Command<T = {}> = T extends HashMap ? {
    type: string;
} & T : {
    type: string;
    payload: T;
};
export interface AnyCommand {
    type: string;
    [key: string]: any;
}
export interface AnyCommandCreator {
    type: string;
    (...value: any[]): Command;
}
export interface EmptyCommandCreator {
    type: string;
    (): Command;
}
export interface TypedCommandCreator<T> {
    type: string;
    (value: T): Command<T>;
}
export declare type ComamndCreatorWithMapper<F extends AnyFunction> = {
    type: string;
} & OverwriteRet<F, Command<ReturnType<F>>>;
export interface CreatorFactory {
    (type: string): EmptyCommandCreator;
    <T>(type: string): TypedCommandCreator<T>;
    <F extends AnyFunction>(type: string, mapper: F): ComamndCreatorWithMapper<F>;
}
export declare function factory(scope: string): CreatorFactory;
export declare function match<T extends AnyCommandCreator>(creator: T): (command?: any) => command is ReturnType<T>;
export declare function isCommand<T>(command: any | T): command is Command<T>;
export {};
