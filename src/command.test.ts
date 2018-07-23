import { create, match, isCommand } from './command'

test('create', () => {
  const a = create('a')
  const b = create<number>('b')
  const c = create('c', () => 1)
  const d = create('d', (i: number) => i, i => ({ input: i }))
  const e = create('e', (x: number, y: number) => x + y)

  expect(a()).toStrictEqual({ type: 'a', payload: undefined })
  expect(b(1)).toStrictEqual({ type: 'b', payload: 1 })
  expect(c()).toStrictEqual({ type: 'c', payload: 1 })
  expect(d(1)).toStrictEqual({ type: 'd', payload: 1, input: 1 })
  expect(e(1, 2)).toStrictEqual({ type: 'e', payload: 3 })
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
