import { identity, AnyFunc, constant } from '@typoerr/atomic'

export interface Command<P, M = undefined> {
  type: string
  payload: P
  meta: M
}

export interface CommandCreator<T extends any[], P, M = undefined> {
  type: string
  (...args: T): Command<P, M>
}

interface MapperObject<T extends any[], R1, R2> {
  payload: (...val: T) => R1
  meta?: (...val: T) => R2
}

export interface CommandCreatorFactoryResult {
  (type: string): CommandCreator<[undefined?], undefined>
  <P>(type: string): CommandCreator<[P], P>
  <T extends AnyFunc>(type: string, mapper?: T): CommandCreator<Parameters<T>, ReturnType<T>>
  <T extends any[], P, M>(type: string, mappers?: MapperObject<T, P, M>): CommandCreator<T, P, M>
}

function fromMapper(scope: string, type: string, mapper?: Function) {
  type = scope + type
  const create = (...args: any[]) => {
    const payload = (mapper || identity)(...args)
    return { type, payload, meta: undefined }
  }
  create.type = type
  return create
}

function fromMaperObject(scope: string, type: string, mappers: MapperObject<any, any, any>) {
  type = scope + type
  const create = (...args: any[]) => {
    const payload = mappers.payload(...args)
    const meta = (mappers.meta || constant(undefined))(...args)
    return { type, payload, meta }
  }
  create.type = type
  return create
}

export function factory(scope: string): CommandCreatorFactoryResult {
  return function creator(type: string, mapper?: AnyFunc | MapperObject<any, any, any>) {
    if (typeof mapper === 'function') {
      return fromMapper(scope, type, mapper)
    } else if (typeof mapper === 'object') {
      return fromMaperObject(scope, type, mapper)
    } else {
      return fromMapper(scope, type)
    }
  }
}

export const create = factory('')

export function match<T extends CommandCreator<any, any>>(creator: T) {
  return (command?: any): command is ReturnType<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand<T extends Command<any, any>>(command: any | T): command is T {
  return Object(command) === command && typeof command.type === 'string'
}
