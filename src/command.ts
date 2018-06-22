import { HashMap, isObject } from '@cotto/utils.ts'

//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//
// tslint:disable:max-line-length
export type OverwriteRet<Fn, R> =
  Fn extends (() => any) ? (() => R) :
  Fn extends ((a: infer A) => any) ? (a: A) => R :
  Fn extends ((a: infer A, b: infer B) => any) ? (a: A, b: B) => R :
  Fn extends ((a: infer A, b: infer B, c: infer C) => any) ? (a: A, b: B, c: C) => R :
  Fn extends ((a: infer A, b: infer B, c: infer C, d: infer D) => any) ? (a: A, b: B, c: C, d: D) => R :
  Fn extends ((a: infer A, b: infer B, c: infer C, d: infer D, e: infer E) => any) ? (a: A, b: B, c: C, d: D, e: E) => R :
  Fn extends ((a: infer A, b: infer B, c: infer C, d: infer D, e: infer E, f: infer F) => any) ? (a: A, b: B, c: C, d: D, e: E, f: F) => R :
  never
// tslint:enable:max-line-length

interface AnyFunction {
  (...value: any[]): any
}

export type Command<T = {}> = T extends HashMap
  ? { type: string } & T
  : { type: string, payload: T }

export interface AnyCommand {
  type: string
  [key: string]: any
}

export interface AnyCommandCreator {
  type: string
  (...value: any[]): Command
}

export interface EmptyCommandCreator {
  type: string
  (): Command
}

export interface TypedCommandCreator<T> {
  type: string
  (value: T): Command<T>
}

export type ComamndCreatorWithMapper<F extends AnyFunction> =
  & { type: string }
  & OverwriteRet<F, Command<ReturnType<F>>>

export interface CreatorFactory {
  (type: string): EmptyCommandCreator
  <T>(type: string): TypedCommandCreator<T>
  <F extends AnyFunction>(type: string, mapper: F): ComamndCreatorWithMapper<F>
}

//
// ─── IMPL ────────────────────────────────────────────────────────────────────
//
function ensureObject(value: any, key: string) {
  return isObject(value) ? value : { [key]: value }
}

export function factory(scope: string): CreatorFactory {
  return (type: string, mapper?: Function) => {
    type = scope + type
    const creator: any = (...value: any[]) => {
      const body = ensureObject(mapper ? mapper(...value) : value[0], 'payload')
      return { type, ...body }
    }
    creator.type = type
    return creator
  }
}

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
export function match<T extends AnyCommandCreator>(creator: T) {
  return (command?: any): command is ReturnType<T> => {
    return command != null && command.type === creator.type
  }
}

export function isCommand<T>(command: any | T): command is Command<T> {
  return Object(command) === command && typeof command.type === 'string'
}
