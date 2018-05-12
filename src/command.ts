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

export type CommandSrcMapper<T, U = undefined> = (value: T) => {
  payload?: U
  [key: string]: any,
}

export type AnyCommandCreator<T = any> = EmptyCommandCreator | CommandCreator<T>

//
// ─── COMMAND CREATOR ────────────────────────────────────────────────────────────
//
function defaultCommandMapper(payload: any): any {
  return { payload }
}

export function scoped(scope: string) {
  return factory

  function factory(type: string): EmptyCommandCreator
  function factory<T>(type: string): CommandCreator<T>
  function factory<T = undefined, U = any>(type: string, mapper: CommandSrcMapper<U, T>): CommandCreator<T, U>
  function factory(type: string, mapper = defaultCommandMapper): CommandCreator {
    type = scope + type
    const creator: any = (src: any) => ({ type, payload: undefined, ...mapper(src) })
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
