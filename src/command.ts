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
  isolated: boolean
}

export interface CommandCreator<T = any, U = T> {
  (payload: U, meta?: Hash): Command<T>
  type: string
  isolated: boolean
}

export type AnyCommandCreator = EmptyCommandCreator | CommandCreator

//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function createCommand<T>(type: string, payload: T, meta: Hash) {
  return meta ? { type, payload, meta } : { type, payload }
}

export function scoped(scope: string) {
  return _create
  function _create(type: string): EmptyCommandCreator
  function _create<T>(type: string): CommandCreator<T>
  function _create<T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>
  function _create(type: string, fn = identity): CommandCreator {
    const _type = scope + type
    const creator: any = (payload: any, meta?: any) => createCommand(_type, fn(payload), meta)
    creator.type = _type
    creator.isolated = false
    return creator
  }
}

export const create = scoped('')

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
export function match<T>(creator: CommandCreator<T, any>) {
  return (command: any): command is Command<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand(command: any): command is Command {
  return Object(command) === command && typeof command.type === 'string'
}

//
// ─── ISOLATE ────────────────────────────────────────────────────────────────────
//
function isolatedCommandCreator<T extends AnyCommandCreator>(id: string, creator: T): T {
  const key = `${creator.type}#${id}`
  const isolated: any = (...args: any[]) => {
    const command: Command = creator.apply(null, args)
    command.type = key
    command._isolated = true
    return command
  }
  isolated.type = key
  isolated.isolated = true

  return isolated as T
}

export function isolate<T extends AnyCommandCreator>(id: string, creator: T): T
export function isolate<T extends AnyCommandCreator>(id: string, creators: T[]): T[]
export function isolate(id: string, creators: any) {
  if (Array.isArray(creators)) {
    return creators.map(fn => isolatedCommandCreator(id, fn))
  }
  return isolatedCommandCreator(id, creators)
}

export function isIsolatedCommand(command: Command) {
  return isCommand(command) && '_isolated' in command && Boolean(command._isolated)
}

export function isIsoaltedCreator(creator: AnyCommandCreator) {
  return creator.isolated
}

export function getRawType(command: Command) {
  return command.type.replace(/#[^#]*$/, '')
}
