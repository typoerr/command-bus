import { HashMap } from 'utils';
export declare type Command<P = any, E = HashMap> = E & {
    type: string;
    payload: P;
};
export interface CommandCreator<T extends any[], P = undefined, E extends HashMap = {}> {
    type: string;
    (...input: T): Command<P, E>;
}
export interface AnyCommandCreator<P = any, E = {}> {
    type: string;
    (...input: any[]): Command<P, E>;
}
export interface CreatorFactory {
    (type: string): CommandCreator<[undefined?]>;
    <P>(type: string): CommandCreator<[P], P>;
    <T extends any[], P, E extends HashMap>(type: string, payload?: (...v: T) => P, extra?: (...v: T) => E): CommandCreator<T, P, E>;
}
export declare function factory(scope: string): CreatorFactory;
export declare const create: CreatorFactory;
export declare function match<T extends AnyCommandCreator>(creator: T): (command?: any) => command is ReturnType<T>;
export declare function isCommand<T extends Command>(command: any | T): command is Command<T['payload']>;
