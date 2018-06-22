import { factory, match, isCommand } from './command'

const create = factory('TEST/')

test('empty command creator', () => {
  const A = create('A')

  expect(A()).toEqual({ type: 'TEST/A' })
  expect(A.type).toBe('TEST/A')
})

test('typed command creator', () => {
  const A = create<number>('A')
  const B = create<{ amount: number }>('B')
  expect(A(1)).toEqual({ type: 'TEST/A', payload: 1 })
  expect(B({ amount: 1 })).toEqual({ type: 'TEST/B', amount: 1 })
  expect(A.type).toBe('TEST/A')
})

test('command creator with mapper', () => {
  const A = create('A', () => 1)
  const B = create('B', (a: number, b: number) => a + b)
  const C = create('C', (a: number, b: number) => ({ a, b }))

  expect(A()).toEqual({ type: 'TEST/A', payload: 1 })
  expect(A.type).toBe('TEST/A')
  expect(B(1, 2)).toEqual({ type: 'TEST/B', payload: 3 })
  expect(C(1, 2)).toEqual({ type: 'TEST/C', a: 1, b: 2 })
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
