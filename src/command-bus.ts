import { Command, AnyCommandCreator } from './command'

export type BusTarget<T = any> = typeof WILDCARD | symbol | string | AnyCommandCreator<T>
export type CommandListener<T = any> = (commad: Command<T>) => any
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
  const eventMap = new Map<string | symbol, Set<CommandListener>>()
  const allListeners = new Set<CommandListener>()

  function dispatch(command: Command) {
    for (const listener of eventMap.get(command.type) || []) {
      listener(command)
    }
    for (const listener of allListeners) {
      listener(command)
    }
    return command
  }

  function on<T = any>(target: BusTarget<T>, listener: CommandListener<T>) {
    const type = getEventName(target)
    const listeners = isWildcard(type) ? allListeners : eventMap.get(type)
    listeners ? listeners.add(listener) : eventMap.set(type, new Set([listener]))
    return listener
  }

  function off(target: BusTarget, listener: CommandListener) {
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
