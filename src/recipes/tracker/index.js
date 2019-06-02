import { Observable } from 'rxjs'
import moment from 'moment'

const dataDir = `${process.cwd()}/.data`

const getFileDate = date => moment(date).format('YYYY-MM-DD')

const getFileName = dir => `${dir}/tracker-${getFileDate(new Date())}.csv`

const formatLine = ({
  exchange,
  trade: { trade_id, side, size, price, product_id, time }
}) => [trade_id, exchange, side, size, price, product_id, time].join(',')

export default async ({ dependencies: { fs, log }, events } = {}) => {
  Observable.fromEvent(events, 'gdax.TRADE').subscribe(
    data => (
      log.trace(
        'track',
        JSON.stringify({
          price: data.trade.price,
          trade: data.trade.product_id
        })
      ),
      fs
        .ensureDir(dataDir)
        .then(() =>
          fs.appendFile(getFileName(dataDir), `${formatLine(data)}\n`, 'utf8')
        )
        .catch(err => log.error(err))
    )
  )
}
