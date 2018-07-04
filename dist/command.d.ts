import { HashMap } from '@cotto/utils.ts';
export declare type Command<P = any, E = HashMap> = E & {
    type: string;
    payload: P;
};
export interface EmptyCommandCreator {
    type: string;
    (): Command<undefined>;
}
export interface TypedCommandCreator<P> {
    type: string;
    (value: P): Command<P>;
}
export interface ArgLessMappedCommandCreator<P, E> {
    type: string;
    (): Command<P, E>;
}
export interface MappedCommandCreator<T, P, E> {
    type: string;
    (value: T): Command<P, E>;
}
export interface AnyCommandCreator<P = any, E = HashMap> {
    type: string;
    (value?: any): Command<P, E>;
}
export interface CreatorFactory {
    (type: string): EmptyCommandCreator;
    <P>(type: string): TypedCommandCreator<P>;
    <P, E extends HashMap>(type: string, payload?: () => P, extra?: () => E): ArgLessMappedCommandCreator<P, E>;
    <T, P, E extends HashMap>(type: string, payload?: (v: T) => P, extra?: (v: T) => E): MappedCommandCreator<T, P, E>;
}
export declare function factory(scope: string): CreatorFactory;
export declare const create: CreatorFactory;
export declare function match<T extends AnyCommandCreator>(creator: T): (command?: any) => command is ReturnType<T>;
export declare function isCommand<T extends Command>(command: any | T): command is Command<T['payload']>;
