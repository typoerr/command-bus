import { Observable } from 'rxjs';
import { Command, AnyCommandCreator } from './command';
export declare type ReturnTypeByArray<T> = T extends ((...val: any[]) => infer R)[] ? R : never;
export declare type EventTargetLike = {
    addEventListener: any;
    removeEventListener: any;
} | {
    addListener: any;
    removeListener: any;
} | {
    on: any;
    off: any;
};
export declare type CommandSource = EventTargetLike | Observable<Command>;
export declare type CommandTarget = string | AnyCommandCreator | AnyCommandCreator[];
export declare type CommandTargetResult<T> = T extends string ? Command : T extends AnyCommandCreator ? ReturnType<T> : T extends AnyCommandCreator[] ? ReturnTypeByArray<T> : never;
export declare function select<T extends CommandTarget>(src: CommandSource, target: T): Observable<CommandTargetResult<T>>;
