import { Observable } from 'rxjs'

export const event = ({ events, log }) =>
  Observable.fromEvent(events, 'gdax.CLOSE').subscribe(() => {
    log.error('GDAX connection closed.')
    process.exit(1)
  })
