import { AnyCommandCreator, Command } from './command'

export type BusTarget = symbol | string | AnyCommandCreator

export interface CommandListener {
  (command: Command): void
}

export interface CommandCreatorListener<T extends AnyCommandCreator> {
  (command: ReturnType<T>): void
}

export type CommandBus = ReturnType<typeof createCommandBus>

export const WILDCARD = '*'

function isWildcard(type: string | symbol) {
  return type === WILDCARD
}

function getEventName(target: BusTarget) {
  return (typeof target === 'string' || typeof target === 'symbol')
    ? target
    : target.type
}

export function createCommandBus() {
  const eventMap = new Map<string | symbol, Set<Function>>()
  const allListeners = new Set<Function>()

  function dispatch<T extends Command>(command: T): T {
    for (const listener of eventMap.get(command.type) || []) {
      listener(command)
    }
    for (const listener of allListeners) {
      listener(command)
    }
    return command
  }

  function on<T extends string | symbol>(target: T, listener: CommandListener): CommandListener
  function on<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>
  function on(target: BusTarget, listener: Function) {
    const type = getEventName(target)
    const listeners = isWildcard(type) ? allListeners : eventMap.get(type)
    listeners ? listeners.add(listener) : eventMap.set(type, new Set([listener]))
    return listener
  }

  function off<T extends string | symbol>(target: T, listener: CommandListener): CommandListener
  function off<T extends AnyCommandCreator>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>
  function off<T extends BusTarget>(target: T, listener: Function) {
    const type = getEventName(target)
    const listeners = isWildcard(type) ? allListeners : eventMap.get(type)
    listeners && listeners.delete(listener)
    return listener
  }

  function getListeners(target: BusTarget) {
    const type = getEventName(target)
    const listeners = isWildcard(type) ? allListeners : eventMap.get(type)
    return listeners ? Array.from([...listeners]) : []
  }

  return {
    dispatch,
    on,
    off,
    getListeners,
    /* alias */
    addEventListener: on,
    removeEventListener: off,
    addListener: on,
    removeListener: off,
  }
}
