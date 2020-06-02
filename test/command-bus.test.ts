import { CommandBus } from '../src/command-bus'
import { create, Command } from '../src/command'
import { fromEvent } from 'rxjs'

const COMMAND = create<number>('COMMAND')

test('on/dispatch/off', () => {
  expect.assertions(6)
  const bus = new CommandBus()
  const l1 = jest.fn()
  const l2 = jest.fn()
  /* on */
  bus.on('*', l1)
  bus.on(COMMAND, l2)
  expect(bus.getListeners('*')).toEqual(new Set([l1]))
  expect(bus.getListeners(COMMAND)).toEqual(new Set([l2]))
  /* dispatch */
  bus.dispatch(COMMAND(1))
  expect(l1).toBeCalledWith(COMMAND(1))
  expect(l2).toBeCalledWith(COMMAND(1))
  /* off */
  bus.off('*', l1)
  bus.off(COMMAND, l2)
  expect(bus.getListeners('*')).toEqual(new Set([]))
  expect(bus.getListeners(COMMAND)).toEqual(new Set([]))
})

test('EventEmitter Interface', () => {
  expect.assertions(3)

  const bus = new CommandBus()
  const sub = fromEvent<Command<any, any>>(bus, '*').subscribe((c) => expect(c.payload).toBe(1))
  expect(bus.getListeners('*')?.size).toBe(1)
  bus.dispatch(COMMAND(1))
  sub.unsubscribe()
  expect(bus.getListeners('*')?.size).toBe(0)
})

test('alias', () => {
  const bus = new CommandBus()
  expect(bus.addListener).toBe(bus.on)
  expect(bus.addListener).toBe(bus.addEventListener)
  expect(bus.removeListener).toBe(bus.off)
  expect(bus.removeEventListener).toBe(bus.removeEventListener)
})
