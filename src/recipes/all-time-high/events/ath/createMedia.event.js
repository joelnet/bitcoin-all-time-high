import config from 'config'
import moment from 'moment'
import numeral from 'numeral'
import { Observable } from 'rxjs'
import 'moment-timezone'

export const event = ({ events, log, db }) =>
  Observable.fromEvent(events, 'core.NEW_HIGH')
    .debounceTime(config.get('debounce'))
    .subscribe(async ({ price: high, exchange, time }) => {
      log.debug(
        'core.NEW_HIGH:DEBOUNCED',
        JSON.stringify({ exchange, high, time })
      )

      await db.highs.update(
        { exchange, period: { $exists: false } },
        { $set: { high } },
        { upsert: true }
      )

      const value = numeral(high).format('$0,0')

      const data = {
        image: './images/bitcoin-clouds-1012x506.png',
        width: 1012,
        height: 506,
        font: 'images/Roboto-Bold.ttf',
        texts: [
          { text: value, size: 40, color: '#50b8ef', x: 240, y: 50 },
          { text: value, size: 40, color: '#50b8ef', x: 640, y: 290 },
          { text: value, size: 40, color: '#50b8ef', x: 560, y: 130 },
          { text: value, size: 40, color: '#2d97e5', x: 40, y: 40 },
          { text: value, size: 40, color: '#2d97e5', x: 400, y: 70 },
          { text: value, size: 40, color: '#2d97e5', x: 800, y: 130 },
          { text: value, size: 40, color: '#2d97e5', x: 300, y: 230 },
          { text: value, size: 120, color: '#ffffff', x: 400, y: 190 }
        ]
      }

      const date = moment(time).ye
      const dollarsAndCents = numeral(high).format('$0,0.00')
      const text = `🎉🎉 NEW HIGH IN ${date.year()} 🎉🎉\n\n 1 Bitcoin = ${dollarsAndCents} USD\n\n ${date
        .tz(config.get('timezone'))
        .format('dddd, MMMM Do YYYY, h:mm:ss a')} on ${exchange.toUpperCase()}`

      events.emit('media.CREATE', { exchange, high, time, data, text })
    })
