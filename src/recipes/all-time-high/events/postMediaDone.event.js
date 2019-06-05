import dissoc from 'ramda/src/dissoc'
import { Observable } from 'rxjs'

export const event = ({ events, log }) =>
  Observable.fromEvent(events, 'twitter.POST_MEDIA:DONE').subscribe(data =>
    log.info('twitter.POST_MEDIA:DONE', JSON.stringify(dissoc('image', data)))
  )
