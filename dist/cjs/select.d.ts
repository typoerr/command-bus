import { Observable } from 'rxjs';
export declare type EachReturnType<T> = T extends ((...val: any[]) => infer R)[] ? R : never;
export declare type EELike = {
    addEventListener: any;
    removeEventListener: any;
} | {
    addListener: any;
    removeListener: any;
} | {
    on: any;
    off: any;
};
export interface AbsCommand<T = any> {
    type: string;
    payload: T;
}
export interface AbsCommandCreator<T extends AbsCommand = AbsCommand> {
    type: string;
    (...args: any[]): T;
}
/**
 * Select a command from StreamLike
 */
declare function select(src: EELike, target: string): Observable<AbsCommand<any>>;
declare namespace select {
    var each: typeof each;
}
declare function select<T extends AbsCommandCreator>(source: EELike, target: T): Observable<ReturnType<T>>;
declare namespace select {
    var each: typeof each;
}
declare function select<T extends AbsCommandCreator>(source: Observable<AbsCommand>, target: T): Observable<ReturnType<T>>;
declare namespace select {
    var each: typeof each;
}
declare function each(src: EELike, target: string[]): Observable<AbsCommand<any>>;
declare function each<T extends AbsCommandCreator>(src: EELike, target: T[]): Observable<EachReturnType<T[]>>;
declare function each<T extends AbsCommandCreator>(src: Observable<AbsCommand>, target: T[]): Observable<EachReturnType<T[]>>;
export { select };
