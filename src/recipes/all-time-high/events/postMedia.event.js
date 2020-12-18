import { Observable } from 'rxjs'

export const event = ({ events, log }) =>
  Observable.fromEvent(events, 'media.CREATE:DONE').subscribe(
    ({ exchange, high, time, image, text }) => {
      log.debug('media.CREATE:DONE', exchange, high, time)

      events.emit('twitter.POST_MEDIA', { exchange, high, time, image, text })
    }
  )
