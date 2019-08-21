import { Observable, fromEvent, merge } from 'rxjs'
import { map, share, filter } from 'rxjs/operators'
import { isCommand } from './command'

export type EachReturnType<T> = T extends ((...val: any[]) => infer R)[] ? R : never

export type EventEmitterLike =
  | { addEventListener: any; removeEventListener: any }
  | { addListener: any; removeListener: any }
  | { on: any; off: any }

export interface CommandLike<T = any> {
  type: string
  payload: T
}

export interface CommandCreatorLike<T extends CommandLike = CommandLike> {
  type: string
  (...args: any[]): T
}

function isEELike(src: any): src is EventEmitterLike {
  if ('addEventListener' in src && 'removeEventListener' in src) {
    return true
  } else if ('addListener' in src && 'removeListener' in src) {
    return true
  } else if ('on' in src && 'off' in src) {
    return true
  } else {
    return false
  }
}

function getType(target: string | { type: string }) {
  if (typeof target === 'string') {
    return target
  } else if ('type' in target) {
    return target.type
  }
  return ''
}

/**
 * select a event from EventEmitterLike
 */
function fromEELike(src: EventEmitterLike, target: string): Observable<CommandLike<any>>
function fromEELike<T extends CommandCreatorLike>(
  src: EventEmitterLike,
  target: T,
): Observable<CommandLike<ReturnType<T>>>
function fromEELike(
  src: EventEmitterLike,
  target: string | CommandCreatorLike,
): Observable<CommandLike<any>> {
  const type = getType(target)
  const ensure = (payload: any) => (isCommand(payload) ? payload : { type, payload })
  return fromEvent(src, type).pipe(
    map(ensure),
    share(),
  )
}

/**
 * Select a event from Observable<Command>
 */
function fromObservable<T extends CommandCreatorLike>(src$: Observable<CommandLike>, target: T) {
  return src$.pipe(
    filter((cmd: CommandLike) => cmd.type === target.type),
    share(),
  )
}

/**
 * Select a command from StreamLike
 */
function select(src: EventEmitterLike, target: string): Observable<CommandLike<any>>
function select<T extends CommandCreatorLike>(
  source: EventEmitterLike,
  target: T,
): Observable<ReturnType<T>>
function select<T extends CommandCreatorLike>(
  source: Observable<CommandLike>,
  target: T,
): Observable<ReturnType<T>>
function select(src: any, target: any) {
  if (isEELike(src)) {
    return fromEELike(src, target)
  }
  return fromObservable(src, target)
}

function each(src: EventEmitterLike, target: string[]): Observable<CommandLike<any>>
function each<T extends CommandCreatorLike>(
  src: EventEmitterLike,
  target: T[],
): Observable<EachReturnType<T[]>>
function each<T extends CommandCreatorLike>(
  src: Observable<CommandLike>,
  target: T[],
): Observable<EachReturnType<T[]>>
function each(src: any, target: any[]) {
  const obs = target.map(select.bind(undefined, src))
  return merge(...obs).pipe(share())
}

select.each = each

export { select }
