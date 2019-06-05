import { Observable } from 'rxjs'

export const event = ({ events, store }) =>
  Observable.fromEvent(events, 'gdax.TRADE')
    .filter(store.is2019High)
    .subscribe(({ exchange, trade }) =>
      events.emit('core.NEW_2019_HIGH', {
        exchange,
        price: trade.price,
        pair: trade.product_id,
        time: trade.time
      })
    )
