import { Observable } from 'rxjs'

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

  protected registory = new Map<string | symbol, Set<Function>>()

  constructor() {
    super(observer =>
      this.on(CommandBus.WILDCARD, observer.next.bind(observer)),
    )
  }

  addListener<T extends CommandCreator>(
    type: T,
    handler: (val: Parameters<T>) => void,
  ): Function
  addListener(type: ListenerType, handler: Function): Function
  addListener(type: ListenerType, handler: Function) {
    const listeners = this.getListeners(type)
    if (listeners) {
      listeners.add(handler)
    } else {
      this.registory.set(CommandBus.getType(type), new Set([handler]))
    }
    return handler
  }

  removeListener<T extends CommandCreator>(
    type: T,
    handler: (val: Parameters<T>) => void,
  ): Function
  removeListener(type: ListenerType, handler: Function): Function
  removeListener(type: ListenerType, handler: Function) {
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
    listeners.forEach(fn => fn(command))
    return command
  }

  getListeners(type: ListenerType) {
    return this.registory.get(CommandBus.getType(type))
  }
}
