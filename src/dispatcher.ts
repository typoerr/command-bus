import { Command } from './command'
import { EventEmitter2, ConstructorOptions } from 'eventemitter2'

export type DispatcherOptions = ConstructorOptions

export class Dispatcher extends EventEmitter2 {
  dispatch<U extends Command>(command: U) {
    super.emit(command.type, command)
    return command
  }

  subscribe<U extends Command>(listener: (command: U) => void) {
    const _listener = (_: any, command: U) => listener(command)
    super.onAny(_listener)
    return () => super.offAny(_listener)
  }
}
