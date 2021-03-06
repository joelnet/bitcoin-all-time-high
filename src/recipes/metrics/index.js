import config from 'config'
import express from 'express'
import client from 'prom-client'
import { Observable } from 'rxjs'

export default async ({ dependencies: { db, log }, events } = {}) => {
  const highs = db.highs.find({})
  const port = config.get('metrics.port')
  const host = config.get('metrics.host')

  const allTimeHighGauge = new client.Gauge({
    name: 'ath_coinbase_all_time_high',
    help: 'All Time High price of Bitcoin on Coinbase Pro'
  })

  const bitcoin2020HighGauge = new client.Gauge({
    name: 'ath_coinbase_2020_high',
    help: '2020 High price of Bitcoin on Coinbase Pro'
  })

  const upGauge = new client.Gauge({
    name: 'ath_up',
    help: '1 = up, 0 = not up'
  })

  const tradeCounter = new client.Counter({
    name: 'ath_trades_count',
    help: 'total number of trades'
  })

  const priceGuage = new client.Gauge({
    name: 'ath_coinbase_price',
    help: 'Price of Bitcoin on Coinbase Pro'
  })

  client.collectDefaultMetrics({ timeout: 5000, prefix: 'ath_' })
  upGauge.set(1)
  highs.then(highs => {
    const allTimeHigh = highs
      .filter(({ period }) => period === undefined)
      .map(({ high }) => Number(high))[0]

    const bitcoin2020High = highs
      .filter(({ period }) => period === '2020')
      .map(({ high }) => Number(high))[0]

    log.trace({ allTimeHigh, bitcoin2020High: bitcoin2020High })

    allTimeHighGauge.set(allTimeHigh)
    bitcoin2020HighGauge.set(bitcoin2020High)
  })

  express()
    .get('/metrics', (_, res) => res.end(client.register.metrics()))
    .listen(port, host, () =>
      log.info(`Metrics listening on http://${host}:${port}`)
    )

  Observable.fromEvent(events, 'gdax.TRADE').subscribe(
    ({ trade: { price } }) => {
      priceGuage.set(Number(price))
      tradeCounter.inc()
    }
  )
}
