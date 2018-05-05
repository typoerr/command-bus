import { Observable, fromEvent, merge, isObservable } from 'rxjs'
import { map, filter, share } from 'rxjs/operators'
import { Command, isCommand, AnyCommandCreator } from './command'

export type EventTargetLike =
  | { addEventListener: any, removeEventListener: any }
  | { addListener: any, removeListener: any }
  | { on: any, off: any }

export type EventSource<T = any> = EventTargetLike | Observable<Command<T>>
export type Selectable<T = any> = string | AnyCommandCreator<T> | AnyCommandCreator<T>[]

function getType(target: Selectable) {
  if (typeof target === 'string') {
    return target
  } else if ('type' in target) {
    return target.type
  }
  return ''
}

export function select<T>(src: EventSource, target: Selectable<T>): Observable<Command<T>> {
  const type = getType(target)

  if (Array.isArray(target)) {
    return merge(...target.map<Observable<Command>>(select.bind(null, src))).pipe(share())
  } else if (isObservable(src)) {
    return src.pipe(filter(command => command.type === type), share())
  } else {
    return fromEvent(src, type).pipe(
      map(command => isCommand(command) ? command : { type, payload: command }),
      share(),
    )
  }
}
