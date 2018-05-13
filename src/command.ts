import { identity } from '@cotto/utils.ts'
//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//
export interface Command<T = any> {
  type: string
  payload: T,
  meta?: any
  [key: string]: any
}

export type CommandCreator<P, T> = T extends undefined | never
  ? { type: string, (): Command<P> }
  : { type: string, (src: T): Command<P> }

export type AnyCommandCreator<P = undefined> = CommandCreator<P, any>

export function scoped(scope: string) {
  return function createCreator<P = undefined, T = P>(
    type: string,
    mapper: (value: T) => P = identity as any,
    extra?: (value: T) => { [key: string]: any },
  ): CommandCreator<P, T> {
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
