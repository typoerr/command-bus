import { factory, match, isCommand } from './command'

const create = factory('TEST/')

test('empty command creator', () => {
  const A = create('A')

  expect(A()).toEqual({ type: 'TEST/A' })
  expect(A.type).toBe('TEST/A')
})

test('typed command creator', () => {
  const A = create<number>('A')
  expect(A(1)).toEqual({ type: 'TEST/A', payload: 1 })
  expect(A.type).toBe('TEST/A')
})

test('command creator with mapper', () => {
  const A = create('A', () => 1)
  const B = create('B', (a: number) => a + 1)
  const C = create('C', (a: number) => a, i => ({ meta: i })) // tslint:disable-line
  const D = create('D', () => 1, (i: number) => ({ meta: i }))

  expect(A()).toEqual({ type: 'TEST/A', payload: 1 })
  expect(A.type).toBe('TEST/A')
  expect(B(1)).toEqual({ type: 'TEST/B', payload: 2 })
  expect(C(1)).toEqual({ type: 'TEST/C', payload: 1, meta: 1 })
  expect(D(1)).toEqual({ type: 'TEST/D', payload: 1, meta: 1 })
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
