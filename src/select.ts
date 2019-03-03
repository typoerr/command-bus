import { Observable, fromEvent, merge, isObservable } from 'rxjs'
import { map, filter, share } from 'rxjs/operators'
import { Command, isCommand, AnyCommandCreator } from './command'

export type ReturnTypeByArray<T> = T extends ((...val: any[]) => infer R)[]
  ? R
  : never

export type EventEmitterLike =
  | { addEventListener: any; removeEventListener: any }
  | { addListener: any; removeListener: any }
  | { on: any; off: any }

export type CommandSource = EventEmitterLike | Observable<Command>

export type CommandTarget = string | AnyCommandCreator | AnyCommandCreator[]

export type CommandTargetResult<T> = T extends string
  ? Command
  : T extends AnyCommandCreator
  ? ReturnType<T>
  : T extends AnyCommandCreator[]
  ? ReturnTypeByArray<T>
  : never

const isEventEmitterLike = (src: any): src is EventEmitterLike => {
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

export function getCommandType(target: CommandTarget) {
  if (typeof target === 'string') {
    return target
  } else if ('type' in target) {
    return target.type
  }
  return ''
}

const fromArray = <T extends AnyCommandCreator>(
  src: CommandSource,
  target: T[],
): Observable<CommandTargetResult<T>> => {
  const srouce: Observable<Command>[] = target.map(select.bind(undefined, src))
  return merge(...srouce).pipe(share())
}

const fromBus = <T extends CommandTarget>(src: EventEmitterLike, target: T) => {
  return fromEvent(src, getCommandType(target)).pipe(
    map(command =>
      isCommand(command)
        ? command
        : { type: getCommandType(target), payload: command },
    ),
    share(),
  ) as Observable<CommandTargetResult<T>>
}

const fromObservable = <T extends CommandTarget>(
  src: Observable<Command>,
  target: T,
) => {
  return src.pipe(
    filter(command => command.type === getCommandType(target)),
    share(),
  ) as Observable<CommandTargetResult<T>>
}

export function select<T extends CommandTarget>(
  src: CommandSource,
  target: T,
): Observable<CommandTargetResult<T>> {
  if (Array.isArray(target)) {
    return fromArray(src, target)
  } else if (isEventEmitterLike(src)) {
    return fromBus(src, target)
  } else if (isObservable<Command>(src)) {
    return fromObservable(src, target)
  } else {
    return fromBus(src, target)
  }
}
