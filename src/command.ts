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

export interface EmptyCommandCreator {
  (): Command<undefined>
  type: string
}

export interface CommandCreator<T = any, U = T> {
  (payload: U): Command<T>
  type: string
}

export type AnyCommandCreator<T = any> = EmptyCommandCreator | CommandCreator<T>

//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand<T>(type: string, payload: T) {
  return { type, payload }
}

export function scoped(scope: string) {
  return _create
  function _create(type: string): EmptyCommandCreator
  function _create<T>(type: string): CommandCreator<T>
  function _create<T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>
  function _create(type: string, fn = identity): CommandCreator {
    const _type = scope + type
    const creator: any = (payload: any) => createCommand(_type, fn(payload))
    creator.type = _type
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

export function withMeta(meta: Hash) {
  return <T extends Command>(command: T) => Object.assign({}, command, { meta })
}
