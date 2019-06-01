import config from 'config'
import Gdax from 'gdax'
import { Observable } from 'rxjs'

const exchange = 'gdax'
const isTypeMatch = ({ type }) => type === 'match'

export default ({ events }) => {
  const websocket = new Gdax.WebsocketClient(config.get('gdax.pairs'))

  Observable.fromEvent(websocket, 'message')
    .filter(isTypeMatch)
    .subscribe(trade => events.emit('gdax.TRADE', { exchange, trade }))

  Observable.fromEvent(websocket, 'close').subscribe(() => {
    events.emit('gdax.CLOSE')
    process.exit(1)
  })

  Observable.fromEvent(websocket, 'error').subscribe(err =>
    events.emit('gdax.ERROR', { exchange, err })
  )
}
