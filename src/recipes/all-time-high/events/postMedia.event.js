import { Observable } from 'rxjs'
// import fs from 'fs'

export const event = ({ events, log }) =>
  Observable.fromEvent(events, 'media.CREATE:DONE').subscribe(
    ({ exchange, high, time, image, text }) => {
      log.debug('media.CREATE:DONE', exchange, high, time)

      // /* DEBUG: uncomment to debug */
      // const file = Buffer.from(image, 'base64')
      // fs.writeFileSync(process.cwd() + '/DELME.jpg', file)

      events.emit('twitter.POST_MEDIA', { exchange, high, time, image, text })
    }
  )
