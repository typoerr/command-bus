import { Observable, fromEvent, isObservable } from 'rxjs'
import { map, filter, share } from 'rxjs/operators'
import { Command, isCommand, AnyCommandCreator, AnyCommand } from './command'

export type CommandSourceLike =
  | { addEventListener: any, removeEventListener: any }
  | { addListener: any, removeListener: any }
  | { on: any, off: any }

export type CommandSource = CommandSourceLike | Observable<AnyCommand>

export type CommandTarget = string | AnyCommandCreator

export type CommandTargetResult<T> =
  T extends string ? AnyCommand :
  T extends AnyCommandCreator ? ReturnType<T> :
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
  if (isObservable<Command>(src)) {
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
