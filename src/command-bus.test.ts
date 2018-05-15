import { createCommandBus } from './command-bus'
import { factory } from './command'

const create = factory('')

const COMMAND = create<number>('COMMAND')

test('listen/unlisten command by wildcard', () => {
  expect.assertions(4)
  const mockA = jest.fn()
  const mockB = jest.fn()
  const bus = createCommandBus()

  bus.on('*', mockA)
  bus.on('*', mockB)
  expect(bus.getListeners('*')).toEqual([mockA, mockB])

  bus.dispatch(COMMAND(1))
  expect(mockA).toBeCalledWith(COMMAND(1))
  expect(mockB).toBeCalledWith(COMMAND(1))

  bus.off('*', mockA)
  expect(bus.getListeners('*')).toEqual([mockB])
})

test('listen/unlisten command by command creator', () => {
  expect.assertions(4)
  const mockA = jest.fn()
  const mockB = jest.fn()
  const bus = createCommandBus()

  bus.on(COMMAND, mockA)
  bus.on(COMMAND, mockB)
  expect(bus.getListeners(COMMAND)).toEqual([mockA, mockB])

  bus.dispatch(COMMAND(1))
  expect(mockA).toBeCalledWith(COMMAND(1))
  expect(mockB).toBeCalledWith(COMMAND(1))

  bus.off(COMMAND, mockA)
  expect(bus.getListeners(COMMAND)).toEqual([mockB])
})

test('listen/unlisten command by string', () => {
  expect.assertions(4)
  const mockA = jest.fn()
  const mockB = jest.fn()
  const bus = createCommandBus()

  bus.on(COMMAND.type, mockA)
  bus.on(COMMAND.type, mockB)
  expect(bus.getListeners(COMMAND.type)).toEqual([mockA, mockB])

  bus.dispatch(COMMAND(1))
  expect(mockA).toBeCalledWith(COMMAND(1))
  expect(mockB).toBeCalledWith(COMMAND(1))

  bus.off(COMMAND, mockA)
  expect(bus.getListeners(COMMAND.type)).toEqual([mockB])
})


test('alias', () => {
  const bus = createCommandBus()
  expect(bus.on).toBe(bus.addEventListener)
  expect(bus.on).toBe(bus.addListener)
  expect(bus.off).toBe(bus.removeEventListener)
  expect(bus.off).toBe(bus.removeListener)
})
