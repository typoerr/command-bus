import { create, match, isCommand, scoped } from './command'

test('create emptry command creator', () => {
  const A = create('A')
  expect(A()).toEqual({ type: 'A', payload: undefined })
  expect(A.type).toBe('A')
})

test('create typed command creator', () => {
  const A = create<number>('A')
  expect(A(1)).toEqual({ type: 'A', payload: 1 })
  expect(A.type).toBe('A')
})

test('create command creator with payload mapper', () => {
  const A = create('A', (s: string) => s.length)
  expect(A('hello')).toEqual({ type: 'A', payload: 5 })
  expect(A.type).toBe('A')
})

test('create command creator with meta mapper', () => {
  const A = create('A', (s: string) => s.length, (s: string) => ({ meta: s.length }))
  expect(A('hello')).toEqual({ type: 'A', payload: 5, meta: 5 })
  expect(A.type).toBe('A')
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
