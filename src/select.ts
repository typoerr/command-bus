import { Observable, fromEvent, merge, isObservable } from 'rxjs'
import { map, filter, share } from 'rxjs/operators'
import { Command, isCommand, AnyCommandCreator, AnyCommand } from './command'

export type ReturnTypeByArray<T> = T extends ((...val: any[]) => infer R)[] ? R : never

export type CommandSourceLike =
  | { addEventListener: any, removeEventListener: any }
  | { addListener: any, removeListener: any }
  | { on: any, off: any }

export type CommandSource = CommandSourceLike | Observable<AnyCommand>

export type CommandTarget = string | AnyCommandCreator | AnyCommandCreator[]

export type CommandTargetResult<T> =
  T extends string ? AnyCommand :
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

export function select<T extends CommandTarget>(src: CommandSource, target: T): Observable<CommandTargetResult<T>> {
  if (Array.isArray(target)) {
    const srouce: Observable<AnyCommand>[] = target.map(select.bind(null, src))
    return merge(...srouce).pipe(share()) as Observable<CommandTargetResult<AnyCommand>>
  } else if (isObservable<Command>(src)) {
    return src.pipe(
      filter(command => command.type === getCommandType(target)),
      share(),
    )
  } else {
    return fromEvent(src as CommandSourceLike, getCommandType(target)).pipe(
      // ensure command shape
      map(command => isCommand(command) ? command : { type: getCommandType(target), payload: command }),
      share(),
    )
  }
}
