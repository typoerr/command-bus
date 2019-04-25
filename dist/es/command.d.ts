import { AnyFunc } from 'atomic';
export declare type Command<P, M = undefined> = {
    type: string;
    payload: P;
    meta: M;
};
export interface CommandCreator<T extends any[], P, M = undefined> {
    type: string;
    (...args: T): Command<P, M>;
}
interface WithMetaMapper<T extends any[], R1, R2> {
    payload: (...val: T) => R1;
    meta?: (...val: T) => R2;
}
export interface CommandCreatorFactoryResult {
    (type: string): CommandCreator<[undefined?], undefined>;
    <P>(type: string): CommandCreator<[P], P>;
    <T extends AnyFunc>(type: string, mapper?: T): CommandCreator<Parameters<T>, ReturnType<T>>;
    <T extends any[], P, M>(type: string, mappers?: WithMetaMapper<T, P, M>): CommandCreator<T, P, M>;
}
export declare function factory(scope: string): CommandCreatorFactoryResult;
export declare const create: CommandCreatorFactoryResult;
export declare function match<T extends CommandCreator<any, any>>(creator: T): (command?: any) => command is ReturnType<T>;
export declare function isCommand<T extends Command<any, any>>(command: any | T): command is T;
export {};
