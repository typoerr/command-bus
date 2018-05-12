import { create, match, isCommand, scoped } from './command'

test('create emptry command creator', () => {
  const COMMAND = create('A')
  expect(COMMAND()).toEqual({ type: 'A', payload: undefined })
  expect(COMMAND.type).toBe('A')
})

test('create typed command creator', () => {
  const COMMAND = create<number>('A')
  expect(COMMAND(1)).toEqual({ type: 'A', payload: 1 })
  expect(COMMAND.type).toBe('A')
})

test('create command creator with mapper', () => {
  const A = create('A', (s: string) => ({ payload: s.length, meta: true }))
  const B = create('B', (cond: boolean) => ({ meta: cond }))
  expect(A('hello')).toEqual({ type: 'A', payload: 5, meta: true })
  expect(B(true)).toEqual({ type: 'B', payload: undefined, meta: true })
  expect(A.type).toBe('A')
  expect(B.type).toBe('B')
})

test('scoped', () => {
  const COMMAND = scoped('A/')('B')
  expect(COMMAND.type).toBe('A/B')
  expect(COMMAND()).toEqual({ type: 'A/B', payload: undefined })
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
