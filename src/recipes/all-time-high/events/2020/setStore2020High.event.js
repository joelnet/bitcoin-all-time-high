import { Observable } from 'rxjs'

export const event = ({ events, store, log }) =>
  Observable.fromEvent(events, 'core.NEW_2020_HIGH').subscribe(
    ({ price: high }) => (
      log.info('NEW 2020 HIGH!', store.getState()['2020_high'], '->', high),
      store.dispatch({ type: 'SET_2020_HIGH', high })
    )
  )
