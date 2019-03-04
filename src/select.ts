import { Observable, fromEvent, merge } from 'rxjs'
import { map, share, filter } from 'rxjs/operators'

export type EachReturnType<T> = T extends ((...val: any[]) => infer R)[]
  ? R
  : never

export type EELike =
  | { addEventListener: any; removeEventListener: any }
  | { addListener: any; removeListener: any }
  | { on: any; off: any }

export interface AbsCommand<T = any> {
  type: string
  payload: T
}

export interface AbsCommandCreator<T extends AbsCommand = AbsCommand> {
  type: string
  (...args: any[]): T
}

function isEELike(src: any): src is EELike {
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

function isCommand(command: any): command is AbsCommand<any> {
  return typeof command === 'object' && command != null && 'type' in command
}

/**
 * select a event from EventEmitterLike
 */
function fromEELike(src: EELike, target: string): Observable<AbsCommand<any>>
function fromEELike<T extends AbsCommandCreator>(
  src: EELike,
  target: T,
): Observable<AbsCommand<ReturnType<T>>>
function fromEELike(
  src: EELike,
  target: string | AbsCommandCreator,
): Observable<AbsCommand<any>> {
  const type = getType(target)
  const ensure = (payload: any) =>
    isCommand(payload) ? payload : { type, payload }

  return fromEvent(src, type).pipe(
    map(ensure),
    share(),
  )
}

/**
 * Select a event from Observable<Command>
 */
function fromObservable<T extends AbsCommandCreator>(
  src$: Observable<AbsCommand>,
  target: T,
) {
  return src$.pipe(
    filter((cmd: AbsCommand) => cmd.type === target.type),
    share(),
  )
}

/**
 * Select a command from StreamLike
 */
function select(src: EELike, target: string): Observable<AbsCommand<any>>
function select<T extends AbsCommandCreator>(
  source: EELike,
  target: T,
): Observable<ReturnType<T>>
function select<T extends AbsCommandCreator>(
  source: Observable<AbsCommand>,
  target: T,
): Observable<ReturnType<T>>
function select(src: any, target: any) {
  if (isEELike(src)) {
    return fromEELike(src, target)
  }
  return fromObservable(src, target)
}

function each(src: EELike, target: string[]): Observable<AbsCommand<any>>
function each<T extends AbsCommandCreator>(
  src: EELike,
  target: T[],
): Observable<EachReturnType<T[]>>
function each<T extends AbsCommandCreator>(
  src: Observable<AbsCommand>,
  target: T[],
): Observable<EachReturnType<T[]>>
function each(src: any, target: any[]) {
  const obs = target.map(select.bind(undefined, src))
  return merge(...obs).pipe(share())
}

select.each = each

export { select }
