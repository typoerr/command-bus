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

export type CommandCreator<P, T = undefined> = T extends undefined | never
  ? { type: string, (): Command<P> }
  : { type: string, (value: T): Command<P> }

export type AnyCommandCreator<P> = CommandCreator<P, any>

export function scoped(scope: string) {
  return factory

  function factory(type: string): CommandCreator<undefined>
  function factory<P>(type: string): CommandCreator<P, P>
  function factory<P>(type: string, mapper: () => P): CommandCreator<P>
  function factory<P>(type: string, mapper: () => P, extra?: () => Hash): CommandCreator<P>
  function factory<P, T>(type: string, mapper: () => P, extra?: (value: T) => Hash): CommandCreator<P, T>
  function factory<P, T>(type: string, mapper: (value: T) => P, extra?: () => Hash): CommandCreator<P, T>
  function factory<P, T>(type: string, mapper: (value: T) => P, extra?: (value: T) => Hash): CommandCreator<P, T>
  function factory(type: string, mapper = identity, extra?: (value?: any) => Hash) {
    type = scope + type
    const f: any = (src: any) => ({ type, payload: mapper(src), ...extra ? extra(src) : {} })
    f.type = type
    return f
  }
}

export const create = scoped('')

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
