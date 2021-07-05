import { Observable, fromEvent, merge, isObservable } from 'rxjs'
import { map, share, filter } from 'rxjs/operators'
import { isCommand } from './command'

type AnyFunction = (...values: any[]) => any

export type EachReturnType<T> = T extends ((...val: any[]) => infer R)[] ? R : never

export type EventEmitterLike =
  | { addEventListener: AnyFunction; removeEventListener: AnyFunction }
  | { addListener: AnyFunction; removeListener: AnyFunction }
  | { on: AnyFunction; off: AnyFunction }

export interface CommandLike<T = any> {
  type: string
  payload: T
}

export interface CommandCreatorLike<T extends CommandLike = CommandLike> {
  type: string
  (...args: any[]): T
}

function getType(target: string | { type: string }) {
  return typeof target === 'string' ? target : target.type
}

/**
 * select a event from EventEmitterLike
 */
function fromEELike(src: EventEmitterLike, target: string): Observable<CommandLike<any>>
function fromEELike<T extends CommandCreatorLike>(src: EventEmitterLike, target: T): Observable<CommandLike<ReturnType<T>>>
function fromEELike(src: EventEmitterLike, target: string | CommandCreatorLike): Observable<CommandLike<any>> {
  const type = getType(target)
  const ensure = (payload: any) => (isCommand(payload) ? payload : { type, payload })
  return fromEvent(src as any, type).pipe(map(ensure), share())
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
function select<T extends CommandCreatorLike>(source: EventEmitterLike, target: T): Observable<ReturnType<T>>
function select<T extends CommandCreatorLike>(source: Observable<CommandLike>, target: T): Observable<ReturnType<T>>
function select(src: any, target: any) {
  return isObservable(src) ? fromObservable(src as Observable<any>, target) : fromEELike(src, target)
}

function each(src: EventEmitterLike, target: string[]): Observable<CommandLike<any>>
function each<T extends CommandCreatorLike>(src: EventEmitterLike, target: T[]): Observable<EachReturnType<T[]>>
function each<T extends CommandCreatorLike>(src: Observable<CommandLike>, target: T[]): Observable<EachReturnType<T[]>>
function each(src: any, target: any[]) {
  const obs = target.map(select.bind(undefined, src))
  return merge(...obs).pipe(share())
}

select.each = each

export { select }
