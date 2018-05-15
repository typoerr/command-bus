import { factory, match, isCommand } from './command'

const create = factory('TEST/')

test('create emptry command creator', () => {
  const A = create('A')
  expect(A()).toEqual({ type: 'TEST/A', payload: undefined })
  expect(A.type).toBe('TEST/A')
})

test('create typed command creator', () => {
  const A = create<number>('A')
  expect(A(1)).toEqual({ type: 'TEST/A', payload: 1 })
  expect(A.type).toBe('TEST/A')
})

test('create command creator with payload mapper', () => {
  const A = create('A', (s: string) => s.length)
  const B = create('B', () => 1)
  expect(A('hello')).toEqual({ type: 'TEST/A', payload: 5 })
  expect(A.type).toBe('TEST/A')
  expect(B()).toEqual({ type: 'TEST/B', payload: 1 })
  expect(B.type).toBe('TEST/B')
})

test('create command creator with meta mapper', () => {
  const A = create('A', (s: string) => s.length, (s: string) => ({ meta: s.length }))
  const B = create('B', () => undefined, (i: number) => ({ meta: i }))
  expect(A('hello')).toEqual({ type: 'TEST/A', payload: 5, meta: 5 })
  expect(A.type).toBe('TEST/A')
  expect(B(1)).toEqual({ type: 'TEST/B', payload: undefined, meta: 1 })
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
