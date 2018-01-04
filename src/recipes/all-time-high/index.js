import config from 'config'
import { Observable } from 'rxjs'
import dissoc from 'ramda/src/dissoc'
import when from 'ramda/src/when'
import complement from 'ramda/src/complement'
import isEmpty from 'ramda/src/isEmpty'
import createStore from './store'

const isNotEmpty = complement(isEmpty)

export default async ({
  dependencies: { db, log },
  events,
} = {}) => {
  const store = createStore()
  const highs = await db.highs.find({})

  Observable.fromEvent(events, '*.ERROR')
    .subscribe(err => log.error(err))

  Observable.fromEvent(events, 'gdax.TRADE')
    .filter(store.isAllTimeHigh)
    .subscribe(({ exchange, trade }) =>
      events.emit('core.NEW_HIGH', {
        exchange,
        price: trade.price,
        pair: trade.product_id,
        time: trade.time
      }))

  Observable.fromEvent(events, 'core.NEW_HIGH')
    .subscribe(({ price: high }) => (
      log.info('NEW ALL TIME HIGH!', store.getState().high, '->', high),
      store.dispatch({ type: 'SET_HIGH', high })
    ))

  Observable.fromEvent(events, 'core.NEW_HIGH')
    .debounceTime(config.get('debounce'))
    .subscribe(async ({ price: high, exchange, time }) => {
      log.debug('core.NEW_HIGH:DEBOUNCED', { exchange, high, time })

      db.highs.update({ exchange }, { $set: { high } }, { upsert: true })

      events.emit('media.CREATE', { exchange, high, time })
    })

  Observable.fromEvent(events, 'media.CREATE:DONE')
    .subscribe(({ exchange, high, time, image, text }) => {
      log.debug('media.CREATE:DONE', exchange, high, time)
      events.emit('twitter.POST_MEDIA', { exchange, high, time, image, text })
    })

  Observable.fromEvent(events, 'twitter.POST_MEDIA:DONE')
    .subscribe(data => log.info('twitter.POST_MEDIA:DONE', dissoc('image', data)))

  Observable.fromEvent(events, 'gdax.CLOSE')
    .subscribe(() => log.info('GDAX connection closed.'))

  when(isNotEmpty, () => store.dispatch({ type: 'SET_HIGH', high: highs[0].high }), highs)

  log.info('Previous all time high:', store.getState().high)
}
