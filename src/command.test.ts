import { create, match, isCommand, scoped, isolate, isIsoaltedCreator, isIsolatedCommand, getRawType } from './command'

test('create emptry command creator', () => {
  const COMMAND = create('A')
  expect(COMMAND()).toEqual({ type: 'A', payload: undefined })
  expect(COMMAND.type).toBe('A')
})

test('create command creator', () => {
  const COMMAND = create<number>('A')
  expect(COMMAND(1)).toEqual({ type: 'A', payload: 1 })
  expect(COMMAND.type).toBe('A')
})

test('create command creator with payload creator', () => {
  const COMMAND = create('A', (s: string) => s.length)
  expect(COMMAND('hello')).toEqual({ type: 'A', payload: 5 })
  expect(COMMAND.type).toBe('A')
})

test('scoped', () => {
  const A = scoped('A/')
  const B = A<number>('B')
  const C = A('C', (s: string) => s.length)

  expect(B.type).toBe('A/B')
  expect(B.isolated).toBe(false)
  expect(C.type).toBe('A/C')
  expect(C.isolated).toBe(false)
  expect(B(1)).toEqual({ type: 'A/B', payload: 1 })
  expect(C('abc', { context: true })).toEqual({ type: 'A/C', payload: 3, meta: { context: true } })
})

test('isolate / isIsolatedXXX / getRawType', () => {
  const _A = create<number>('A')
  const _B = create('B')
  const [A, B] = isolate('1', [_A, _B])
  const command = B(1)
  expect(isIsoaltedCreator(A)).toBe(true)
  expect(isIsoaltedCreator(_A)).toBe(false)
  expect(_B.type).toBe('B')
  expect(B.type).toBe('B#1')
  expect(command).toEqual({ type: 'B#1', payload: 1, _isolated: true })
  expect(isIsolatedCommand(command)).toBe(true)
  expect(getRawType(command)).toBe('B')
})

test('match', () => {
  const A = create<number>('A')
  const B = create<number>('B')
  const isCommandA = match(A)
  expect(isCommandA(A(1))).toBe(true)
  expect(isCommandA(B(1))).toBe(false)
})

test('isCommand', () => {
  const A = create('A')
  expect(isCommand(A)).toBe(true)
  expect(isCommand(null)).toBe(false)
})

