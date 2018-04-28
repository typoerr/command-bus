import { merge, of } from 'rxjs'
import { select, EventSource } from './select'
import { Dispatcher } from './dispatcher'
import { createCommandBus } from './command-bus'
import { create, Command } from './command'
import { tap, take, toArray } from 'rxjs/operators'

const ACTION = {
  FOO: create<number>('FOO'),
  BAR: create<string>('BAR'),
  BAZ: create<string>('BAZ'),
}

const evaluate = (a: Command) => (b: Command) => expect(a).toEqual(b)

test('select command from command-bus', done => {
  const bus = createCommandBus()
  const action = ACTION.FOO(1)
  const action$ = select(bus, ACTION.FOO).pipe(
    tap(evaluate(action)),
  )
  action$.subscribe(done.bind(undefined, undefined))
  bus.dispatch(ACTION.FOO(1))
})

test('select command from dispatcher', done => {
  expect.assertions(1)
  const dispatcher = new Dispatcher()
  const action = ACTION.FOO(1)
  const action$ = select(dispatcher, ACTION.FOO).pipe(
    tap(evaluate(action)),
  )
  action$.subscribe(done.bind(undefined, undefined))
  dispatcher.dispatch(action)
})

test('select commands from dispatcher', done => {
  expect.assertions(1)
  const dispatcher = new Dispatcher()
  const action$ = select(dispatcher, [ACTION.BAR, ACTION.BAZ]).pipe(take(2), toArray())
  action$.subscribe(commands => {
    expect(commands).toEqual([ACTION.BAR('BAR'), ACTION.BAZ('BAZ')])
    done()
  })
  dispatcher.dispatch(ACTION.FOO(1))
  dispatcher.dispatch(ACTION.BAR('BAR'))
  dispatcher.dispatch(ACTION.BAZ('BAZ'))
})

test('select command from action$', () => {
  expect.assertions(1)
  const action$ = of(ACTION.FOO(1))
  return select(action$, ACTION.FOO).pipe(
    tap(evaluate(ACTION.FOO(1))),
  ).toPromise()
})


test('select commands from action$', async () => {
  expect.assertions(1)
  const action$ = of<Command>(ACTION.FOO(1), ACTION.BAR('BAR'), ACTION.BAZ('BAZ'))
  const commands = await select(action$, [ACTION.BAR, ACTION.BAZ]).pipe(toArray()).toPromise()
  expect(commands).toEqual([ACTION.BAR('BAR'), ACTION.BAZ('BAZ')])
})

test('select eventName from dispatcher', done => {
  expect.assertions(1)
  const dispatcher = new Dispatcher()
  const action$ = select(dispatcher, ACTION.FOO.type).pipe(
    tap(evaluate(ACTION.FOO(1))),
  ).subscribe(done.bind(undefined, undefined))
  dispatcher.dispatch(ACTION.FOO(1))
  dispatcher.dispatch(ACTION.BAR('BAR'))
  dispatcher.dispatch(ACTION.BAZ('BAZ'))
})
