import { create, match, isCommand, scoped } from './command'

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
  const A = scoped('A/', {
    B: create('B'),
    C: create('C', (s: string) => s.length),
  })

  expect(A.B.type).toBe('A/B')
  expect(A.B()).toEqual({ type: 'A/B', payload: undefined })
  expect(A.C.type).toBe('A/C')
  expect(A.C('aa')).toEqual({ type: 'A/C', payload: 2 })
  expect(A.C('aa', { meta: true })).toEqual({ type: 'A/C', payload: 2, meta: true })
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

