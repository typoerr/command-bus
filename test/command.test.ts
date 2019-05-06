import { create, isCommand, match } from '../src/command'

test('create', () => {
  const a = create('a')
  const b = create<number>('b')
  const c = create('c', () => 1)
  const d = create('d', (x: number, y: number) => x + y)
  const e = create('e', {
    payload: (i: number) => i,
    meta: i => ({ input: i }),
  })

  expect(a()).toStrictEqual({ type: 'a', payload: undefined, meta: undefined })
  expect(b(1)).toStrictEqual({ type: 'b', payload: 1, meta: undefined })
  expect(c()).toStrictEqual({ type: 'c', payload: 1, meta: undefined })
  expect(d(1, 2)).toStrictEqual({ type: 'd', payload: 3, meta: undefined })
  expect(e(1)).toStrictEqual({ type: 'e', payload: 1, meta: { input: 1 } })
})

test('match', () => {
  const a = create<number>('a')
  const b = create<string>('b')
  expect(match(a, a(1))).toBe(true)
  expect(match(a, b('1'))).toBe(false)
})

test('isCommand', () => {
  const A = create('A')
  expect(isCommand(A())).toBe(true)
  expect(isCommand(null)).toBe(false)
})
