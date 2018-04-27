import { Observable } from 'rxjs';
import { Command, AnyCommandCreator } from './command';
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
export declare type EventSource<T = any> = EventTargetLike | Observable<Command<T>>;
export declare type Selectable<T = any> = string | AnyCommandCreator<T> | AnyCommandCreator<T>[];
export declare function select<T>(src: EventSource, target: Selectable<T>): Observable<Command<T>>;
