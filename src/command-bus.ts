import { AnyCommandCreator, Command } from './command'
import { Observable } from 'rxjs'

export type BusTarget = symbol | string | AnyCommandCreator

export interface CommandListener {
  (command: Command): void
}

export interface CommandCreatorListener<T extends AnyCommandCreator> {
  (command: ReturnType<T>): void
}

export const WILDCARD = '*'

function getEventName(target: BusTarget) {
  return (typeof target === 'string' || typeof target === 'symbol')
    ? target
    : target.type
}

export class CommandBus extends Observable<Command> {
  /* alias */
  addEventListener = this.on
  removeEventListener = this.off
  addListener = this.on
  removeListener = this.off

  protected _listeners = new Map<string | symbol, Set<Function>>()

  constructor() {
    super(observer => this.on('*', observer.next.bind(observer)))
  }

  on<T extends string | symbol>(target: T, listener: CommandListener): CommandListener
  on<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>
  on(target: BusTarget, listener: Function) {
    const type = getEventName(target)
    const listeners = this._listeners.get(type)
    listeners ? listeners.add(listener) : this._listeners.set(type, new Set([listener]))
    return listener
  }

  off<T extends string | symbol>(target: T, listener: CommandListener): CommandListener
  off<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>
  off<T extends BusTarget>(target: T, listener: Function) {
    const type = getEventName(target)
    const listeners = this._listeners.get(type)
    listeners && listeners.delete(listener)
    return listener
  }

  dispatch<T extends Command>(command: T): T {
    const listeners = [...this._listeners.get(command.type) || [], ...this._listeners.get('*') || []]
    listeners.forEach(listener => listener(command))
    return command
  }

  getListeners(target: BusTarget) {
    const type = getEventName(target)
    const listeners = this._listeners.get(type)
    return [...listeners || []]
  }
}
