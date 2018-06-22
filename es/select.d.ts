import { Observable } from 'rxjs';
import { AnyCommandCreator, AnyCommand } from './command';
export declare type CommandSourceLike = {
    addEventListener: any;
    removeEventListener: any;
} | {
    addListener: any;
    removeListener: any;
} | {
    on: any;
    off: any;
};
export declare type CommandSource = CommandSourceLike | Observable<AnyCommand>;
export declare type CommandTarget = string | AnyCommandCreator;
export declare type CommandTargetResult<T> = T extends string ? AnyCommand : T extends AnyCommandCreator ? ReturnType<T> : never;
export declare function select<T extends CommandTarget>(src: CommandSource, target: T): Observable<CommandTargetResult<T>>;
