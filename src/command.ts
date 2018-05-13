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

export interface EmptyCommandCreator {
  (): Command<undefined>
  type: string
}

export interface CommandCreator<T = any, U = T> {
  (src: U): Command<T>
  type: string
}

export type AnyCommandCreator<T = any> = EmptyCommandCreator | CommandCreator<T>

export type PayloadMapper<T, R> = (val: T) => R
export type Extra<T> = (value: T) => { [key: string]: any }

//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
export function scoped(scope: string) {
  return factory

  function factory(type: string): EmptyCommandCreator
  function factory<T>(type: string): CommandCreator<T>
  function factory<T = undefined, U = any>(
    type: string,
    payload: PayloadMapper<U, T>,
    extra?: Extra<any>,
  ): CommandCreator<T, U>
  function factory(
    type: string, payload = identity,
    extra?: Extra<any>,
  ): CommandCreator {
    type = scope + type
    const creator: any = (src: any) => ({ type, payload: payload(src), ...extra ? extra(src) : {} })
    creator.type = type
    return creator
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
