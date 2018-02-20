import { select, EventSource } from './select'
import { Dispatcher } from './dispatcher'
import { create, Command } from './command'
import { merge } from 'rxjs/observable/merge'
import { of } from 'rxjs/observable/of'
import { tap, concatMap, skip, filter, shareReplay } from 'rxjs/operators'

const ev = new Dispatcher()

const ACTION = {
  FOO: create<number>('FOO'),
  BAR: create<string>('BAR'),
  BAZ: create<string>('BAZ'),
}

const evaluate = (a: Command) => (b: Command) => expect(a).toEqual(b)

describe('select by command creator', () => {
  const action = ACTION.FOO(1)

  test('from dispatcher', done => {
    expect.assertions(1)
    const action$ = select(ev, ACTION.FOO).pipe(tap(evaluate(action)))
    action$.subscribe(done.bind(undefined, undefined))
    ev.dispatch(action)
  })

  test('select observable action', () => {
    expect.assertions(1)
    return select(of(action), ACTION.FOO).pipe(tap(evaluate(action))).toPromise()
  })
})

describe('select command creators', () => {
  const bar = ACTION.BAR('BAR')
  const baz = ACTION.BAZ('BAZ')
  const epic = (src: EventSource) => select(src, [ACTION.BAR, ACTION.BAZ]).pipe(shareReplay(1))
  const filterByAction = (a: Command) => filter((b: Command) => a.type === b.type)

  test('from dispatcher', done => {
    expect.assertions(2)

    const action$ = epic(ev).pipe(
      concatMap(action => merge(
        of(action).pipe(filterByAction(bar), tap(evaluate(bar))),
        of(action).pipe(filterByAction(baz), tap(evaluate(baz))),
      )),
      skip(1),
    )

    action$.subscribe(done.bind(undefined, undefined))
    ev.dispatch(bar)
    ev.dispatch(baz)
  })

  test('from observable action', () => {
    expect.assertions(2)
    const bar$ = epic(of(bar)).pipe(tap(evaluate(bar)))
    const baz$ = epic(of(baz)).pipe(tap(evaluate(baz)))
    return merge(bar$, baz$).toPromise()
  })
})

test('dispatcher + event name', done => {
  const action = ACTION.FOO(1)
  const action$ = select(ev, ACTION.FOO.type).pipe(tap(evaluate(action)))
  action$.subscribe(done.bind(undefined, undefined))
  ev.dispatch(action)
})
