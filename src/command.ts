import { identity, mapValues, Hash } from '@cotto/utils.ts'

export interface Command<T = any> {
  type: string
  payload: T,
  [key: string]: any
}

export interface EmptyCommandCreator {
  (): Command<undefined>
  type: string
}

export interface CommandCreator<T = any, U = T> {
  (payload: U, meta?: any): Command<T>
  type: string
}

export type CommandCreators = Hash<CommandCreator | EmptyCommandCreator>

export function create(type: string): EmptyCommandCreator
export function create<T>(type: string): CommandCreator<T>
export function create<T, U>(type: string, fn: (val: U) => T): CommandCreator<T, U>
export function create(type: string, fn: Function = identity): CommandCreator {
  const creator: any = (payload: any, meta: any) => ({ type, payload: fn(payload), ...meta })
  creator.type = type
  return creator
}

export function scoped<T extends CommandCreators>(scope: string, creators: T) {
  return mapValues(creators, creator => {
    return create(scope + creator.type, pluck(creator, 'payload'))
  }) as T
}

export function match<T>(creator: CommandCreator<T, any>) {
  return (command: any): command is Command<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand(command: any): command is Command {
  return Object(command) === command && typeof command.type === 'string'
}

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
function pluck(fn: Function, key: string) {
  return (...args: any[]) => {
    const result = fn(...args)
    return result ? result[key] : undefined
  }
}
