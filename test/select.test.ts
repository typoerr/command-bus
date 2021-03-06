import { of } from 'rxjs'
import { select } from '../src/select'
import { CommandBus } from '../src/command-bus'
import { factory } from '../src/command'
import { tap, toArray } from 'rxjs/operators'

const create = factory('')

const ACTION = {
  FOO: create('FOO', (i: number) => i),
  BAR: create('BAR', (s: string) => s),
  BAZ: create('BAZ', {
    payload: (s: string) => s,
    meta: (s) => ({ input: s }),
  }),
}

test('select command from command-bus', (done) => {
  expect.assertions(1)
  const bus = new CommandBus()
  const action$ = select(bus, ACTION.FOO).pipe(tap((x) => expect(x).toEqual(ACTION.FOO(1))))
  action$.subscribe(done.bind(undefined, undefined))
  bus.dispatch(ACTION.FOO(1))
})

test('select command from action$', () => {
  expect.assertions(1)
  const action$ = of(ACTION.FOO(1))
  return select(action$, ACTION.FOO)
    .pipe(tap((x) => expect(x).toEqual(ACTION.FOO(1))))
    .toPromise()
})

test('select commands from action$', async () => {
  expect.assertions(1)
  const action$ = of(ACTION.FOO(1), ACTION.BAR('BAR'), ACTION.BAZ('BAZ'))
  const commands = await select.each(action$, [ACTION.BAR, ACTION.BAZ]).pipe(toArray()).toPromise()
  expect(commands).toEqual([ACTION.BAR('BAR'), ACTION.BAZ('BAZ')])
})

test('select command from eventname', (done) => {
  expect.assertions(1)
  const bus = new CommandBus()
  const action$ = select(bus, ACTION.FOO.type).pipe(tap((x) => expect(x).toEqual(ACTION.FOO(1))))

  action$.subscribe(done.bind(undefined, undefined))
  bus.dispatch(ACTION.FOO(1))
  bus.dispatch(ACTION.BAR('BAR'))
  bus.dispatch(ACTION.BAZ('BAZ'))
})
