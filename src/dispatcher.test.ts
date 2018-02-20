import { Dispatcher } from './dispatcher'

test('subscribe/unsubscribe', () => {
  const dispatcher = new Dispatcher()
  const listener = jest.fn()
  const unsubscribe = dispatcher.subscribe(listener)
  expect(dispatcher.listenersAny().length).toBe(1)
  unsubscribe()
  expect(dispatcher.listenersAny().length).toBe(0)
})

test('dispatch', () => {
  expect.assertions(2)
  const dispatcher = new Dispatcher()
  const action = { type: 'foo', payload: 1 }
  dispatcher.subscribe(x => expect(x).toEqual(action))
  const result = dispatcher.dispatch(action)
  expect(result).toEqual(action)
})
