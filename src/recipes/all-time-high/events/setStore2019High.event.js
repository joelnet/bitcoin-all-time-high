import { Observable } from 'rxjs'

export const event = ({ events, store, log }) =>
  Observable.fromEvent(events, 'core.NEW_2019_HIGH').subscribe(
    ({ price: high }) => (
      log.info('NEW 2019 HIGH!', store.getState()['2019_high'], '->', high),
      store.dispatch({ type: 'SET_2019_HIGH', high })
    )
  )
