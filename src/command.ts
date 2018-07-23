import { HashMap, identity, constant } from 'utils'

export type Command<P = any, E = HashMap> = E & {
  type: string
  payload: P,
}

export interface CommandCreator<T extends any[], P = undefined, E extends HashMap = {}> {
  type: string,
  (...input: T): Command<P, E>,
}

export interface AnyCommandCreator<P = any, E = {}> {
  type: string
  (...input: any[]): Command<P, E>
}

export interface CreatorFactory {
  (type: string): CommandCreator<[undefined?]>
  <P>(type: string): CommandCreator<[P], P>
  <T extends any[], P, E extends HashMap>(
    type: string,
    payload?: (...v: T) => P,
    extra?: (...v: T) => E,
  ): CommandCreator<T, P, E>
}

export function factory(scope: string): CreatorFactory {
  return (type: string, pm = identity as any, em = constant({})) => {
    type = scope + type
    const creator: any = (...val: any[]) => ({ type, payload: pm(...val), ...em(...val) })
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
