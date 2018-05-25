import { identity, Hash } from '@cotto/utils.ts'
//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//
export interface Command<T = any> {
  type: string
  payload: T,
  meta?: any
  [key: string]: any
}

export type CommandCreator<P, T> = T extends void | never
  ? { type: string, (): Command<P> }
  : { type: string, (value: T): Command<P> }

export type AnyCommandCreator<P> = CommandCreator<P, any>

export function factory(scope: string) {
  return create

  function create(type: string): CommandCreator<undefined, void>
  function create<P>(type: string): CommandCreator<P, P>
  function create<P>(type: string, mapper: () => P): CommandCreator<P, void>
  function create<P>(type: string, mapper: () => P, extra?: () => Hash): CommandCreator<P, void>
  function create<P, U>(type: string, mapper: () => P, extra?: (value: U) => Hash): CommandCreator<P, U>
  function create<P, U>(type: string, mapper: (value: U) => P, extra?: () => Hash): CommandCreator<P, U>
  function create<P, U>(type: string, mapper: (value: U) => P, extra?: (value: U) => Hash): CommandCreator<P, U>
  function create(type: string, mapper = identity, extra?: (value?: any) => Hash) {
    type = scope + type
    const f: any = (src: any) => ({ type, payload: mapper(src), ...extra ? extra(src) : {} })
    f.type = type
    return f
  }
}

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
export function match<T>(creator: AnyCommandCreator<T>) {
  return (command: any): command is Command<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand(command: any): command is Command {
  return Object(command) === command && typeof command.type === 'string'
}
