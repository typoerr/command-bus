import { HashMap, identity, constant } from '@cotto/utils.ts'

export type Command<P = any, E = {}> = E & {
  type: string
  payload: P,
}

export type CommandCreator<T, P, E = {}> = T extends void
  ? { type: string, (): Command<P, E> }
  : { type: string, (value: T): Command<P, E> }

export type AnyCommandCreator<P = any, E = {}> = CommandCreator<any, P, E>

export interface CreatorFactory {
  (type: string): CommandCreator<undefined, undefined>
  <P>(type: string): CommandCreator<P, P>
  <P, E extends HashMap>(type: string, payload?: () => P, extra?: () => E): CommandCreator<undefined, P, E>
  <T, P, E extends HashMap>(type: string, payload?: (val: T) => P, extra?: (val: T) => E): CommandCreator<T, P, E>
}

export function factory(scope: string): CreatorFactory {
  return (type: string, payload = identity, extra = constant({})) => {
    type = scope + type
    const creator: any = (val: any) => ({ type, payload: payload(val), ...extra(val) })
    creator.type = type
    return creator
  }
}

export const create = factory('')

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
export function match<T extends AnyCommandCreator>(creator: T) {
  return (command?: any): command is ReturnType<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand<T extends Command>(command: any | T): command is Command<T['payload']> {
  return Object(command) === command && typeof command.type === 'string'
}
