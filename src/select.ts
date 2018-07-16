import { Observable, fromEvent, merge, isObservable } from 'rxjs'
import { map, filter, share } from 'rxjs/operators'
import { Command, isCommand, AnyCommandCreator } from './command'
import { CommandBus } from './command-bus'

export type ReturnTypeByArray<T> = T extends ((...val: any[]) => infer R)[] ? R : never

export type EventTargetLike =
  | { addEventListener: any, removeEventListener: any }
  | { addListener: any, removeListener: any }
  | { on: any, off: any }

export type CommandSource = EventTargetLike | Observable<Command>

export type CommandTarget = string | AnyCommandCreator | AnyCommandCreator[]

export type CommandTargetResult<T> =
  T extends string ? Command :
  T extends AnyCommandCreator ? ReturnType<T> :
  T extends AnyCommandCreator[] ? ReturnTypeByArray<T> :
  never

function getCommandType(target: CommandTarget) {
  if (typeof target === 'string') {
    return target
  } else if ('type' in target) {
    return target.type
  }
  return ''
}

const fromArray = <T extends CommandTarget>(src: CommandSource, target: T[]) => {
  const srouce: Observable<Command>[] = target.map(select.bind(null, src))
  return merge(...srouce).pipe(share()) as Observable<CommandTargetResult<T>>
}

const fromBus = <T extends CommandTarget>(src: EventTargetLike, target: T) => {
  return fromEvent(src as EventTargetLike, getCommandType(target)).pipe(
    map(command => isCommand(command) ? command : { type: getCommandType(target), payload: command }),
    share(),
  ) as Observable<CommandTargetResult<T>>
}

const fromObservable = <T extends CommandTarget>(src: Observable<Command>, target: T) => {
  return src.pipe(
    filter(command => command.type === getCommandType(target)),
    share(),
  ) as Observable<CommandTargetResult<T>>
}

export function select<T extends CommandTarget>(src: CommandSource, target: T): Observable<CommandTargetResult<T>> {
  if (Array.isArray(target)) {
    return fromArray(src, target)
  } else if (src instanceof CommandBus) {
    return fromBus(src, target)
  } else if (isObservable<Command>(src)) {
    return fromObservable(src, target)
  } else {
    return fromBus(src, target)
  }
}
