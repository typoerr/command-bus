import { Observable } from 'rxjs/Observable';
import { Command, CommandCreator, EmptyCommandCreator } from './command';
export declare type EventTargetLike = EventTarget | {
    addListener: any;
    removeListener: any;
} | {
    on: any;
    off: any;
};
export declare type EventSource<T = any> = EventTargetLike | Observable<Command<T>>;
export declare function select(src: EventSource, commandCreator: EmptyCommandCreator): Observable<Command<undefined>>;
export declare function select<T>(src: EventSource, commandCreator: CommandCreator<T, any>): Observable<Command<T>>;
export declare function select<T>(src: EventSource, commandCreators: CommandCreator<T, any>[]): Observable<Command<T>>;
export declare function select(src: EventSource, eventName: string): Observable<Command>;
