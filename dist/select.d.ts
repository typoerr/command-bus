import { Observable } from 'rxjs/Observable';
import { Command, AnyCommandCreator } from './command';
export declare type EventTargetLike = EventTarget | {
    addListener: any;
    removeListener: any;
} | {
    on: any;
    off: any;
};
export declare type EventSource<T = any> = EventTargetLike | Observable<Command<T>>;
export declare type Selectable<T = any> = string | AnyCommandCreator<T> | AnyCommandCreator<T>[];
export declare function select<T>(src: EventSource, target: Selectable<T>): Observable<Command<T>>;
