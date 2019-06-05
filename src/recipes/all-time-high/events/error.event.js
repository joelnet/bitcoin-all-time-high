import { Observable } from 'rxjs'

export const event = ({ events, log }) =>
  Observable.fromEvent(events, '*.ERROR').subscribe(log.error)
