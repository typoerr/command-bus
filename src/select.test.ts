import { merge, of } from 'rxjs'
import { select, EventSource } from './select'
import { createCommandBus } from './command-bus'
import { factory, Command } from './command'
import { tap, take, toArray } from 'rxjs/operators'

const create = factory('')

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

test('select command from eventname', done => {
  expect.assertions(1)
  const bus = createCommandBus()
  const action$ = select(bus, ACTION.FOO.type).pipe(
    tap(evaluate(ACTION.FOO(1))),
  ).subscribe(done.bind(undefined, undefined))
  bus.dispatch(ACTION.FOO(1))
  bus.dispatch(ACTION.BAR('BAR'))
  bus.dispatch(ACTION.BAZ('BAZ'))
})
