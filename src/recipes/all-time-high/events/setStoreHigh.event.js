import { Observable } from 'rxjs'

export const event = ({ events, store, log }) =>
  Observable.fromEvent(events, 'core.NEW_HIGH').subscribe(
    ({ price: high }) => (
      log.info('NEW ALL TIME HIGH!', store.getState().high, '->', high),
      store.dispatch({ type: 'SET_HIGH', high })
    )
  )
