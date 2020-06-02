import { Observable } from 'rxjs'
import { AnyFunction } from '@typoerr/atomic'

interface Command {
  type: string
  payload: unknown
  [key: string]: any
}

interface CommandCreator {
  type: string
  (...val: any[]): any
}

type ListenerType = string | symbol | { type: string }

export class CommandBus extends Observable<Command> {
  static WILDCARD = '*'

  static getType(type: ListenerType) {
    return Object(type) === type ? (type as any).type : type
  }

  /* alias */
  on = this.addListener
  off = this.removeListener
  addEventListener = this.addListener
  removeEventListener = this.removeListener

  protected registory = new Map<string | symbol, Set<AnyFunction>>()

  constructor() {
    super((observer) => this.on(CommandBus.WILDCARD, observer.next.bind(observer)))
  }

  addListener<T extends CommandCreator>(type: T, handler: (val: T) => void): AnyFunction
  addListener(type: ListenerType, handler: AnyFunction): AnyFunction
  addListener(type: ListenerType, handler: AnyFunction) {
    const listeners = this.getListeners(type)
    if (listeners) {
      listeners.add(handler)
    } else {
      this.registory.set(CommandBus.getType(type), new Set([handler]))
    }
    return handler
  }

  removeListener<T extends CommandCreator>(type: T, handler: (val: T) => void): AnyFunction
  removeListener(type: ListenerType, handler: AnyFunction): AnyFunction
  removeListener(type: ListenerType, handler: AnyFunction) {
    const listeners = this.getListeners(type)
    if (listeners) {
      listeners.delete(handler)
    }
    return handler
  }

  dispatch<T extends Command>(command: T) {
    const listeners = [
      ...(this.getListeners(command) || []),
      ...(this.getListeners(CommandBus.WILDCARD) || []),
    ]
    listeners.forEach((fn) => fn(command))
    return command
  }

  getListeners(type: ListenerType) {
    return this.registory.get(CommandBus.getType(type))
  }
}
