import { Observable } from 'rxjs/Observable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { merge } from 'rxjs/observable/merge'
import { map, filter, share } from 'rxjs/operators'
import { observable } from 'rxjs/symbol/observable'
import { Command, isCommand, AnyCommandCreator } from './command'

export type EventTargetLike =
  | EventTarget
  | { addListener: any, removeListener: any }
  | { on: any, off: any }

export type EventSource<T = any> = EventTargetLike | Observable<Command<T>>
export type Selectable<T = any> = string | AnyCommandCreator<T> | AnyCommandCreator<T>[]

export function select<T>(src: EventSource, target: Selectable<T>): Observable<Command<T>> {
  if (Array.isArray(target)) {
    return merge(...target.map<Observable<Command>>(select.bind(null, src))).pipe(share())
  }
  const type = typeof target === 'string' ? target : target.type
  if (isObservable(src)) {
    return src.pipe(filter(command => command.type === type), share())
  }
  return fromEvent<any>(src, type).pipe(
    map(command => isCommand(command) ? command : { type, payload: command }),
    share(),
  )
}

function isObservable<T extends Observable<any>>(value: any | T): value is T {
  return Object(value) === value && observable in value
}
