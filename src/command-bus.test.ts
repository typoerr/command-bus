import { CommandBus } from './command-bus'
import { create } from './command'
import { map } from 'rxjs/operators'

const COMMAND = create<number>('COMMAND')

test('on/dispatch/off', () => {
  expect.assertions(6)
  const bus = new CommandBus()
  const l1 = jest.fn()
  const l2 = jest.fn()
  /* on */
  bus.on('*', l1)
  bus.on(COMMAND, l2)
  expect(bus.getListeners('*')).toEqual([l1])
  expect(bus.getListeners(COMMAND)).toEqual([l2])
  /* dispatch */
  bus.dispatch(COMMAND(1))
  expect(l1).toBeCalledWith(COMMAND(1))
  expect(l2).toBeCalledWith(COMMAND(1))
  /* off */
  bus.off('*', l1)
  bus.off(COMMAND, l2)
  expect(bus.getListeners('*')).toEqual([])
  expect(bus.getListeners(COMMAND)).toEqual([])
})

test('observable interface', () => {
  expect.assertions(1)
  const bus = new CommandBus()
  bus.pipe(map(x => x.payload)).subscribe(value => expect(value).toBe(1))
  bus.dispatch(COMMAND(1))
})

test('alias', () => {
  const bus = new CommandBus()
  expect(bus.on).toBe(bus.addEventListener)
  expect(bus.on).toBe(bus.addListener)
  expect(bus.off).toBe(bus.removeEventListener)
  expect(bus.off).toBe(bus.removeListener)
})
