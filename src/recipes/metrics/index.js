/* eslint-disable camelcase */
import config from 'config'
import express from 'express'
import { Observable } from 'rxjs'
import client from 'prom-client'

const createAllTimeHighGauge = async ({ db, log }) => {
  const highs = await db.highs.find({})
  const gauge = new client.Gauge({
    name: 'ath_coinbase_all_time_high',
    help: 'All Time High price of Bitcoin on Coinbase Pro'
  })
  gauge.set(Number(highs[0].high))
  log.trace('highs', JSON.stringify(highs))
}

export default async ({ dependencies: { db, log }, events } = {}) => {
  createAllTimeHighGauge({ db, log })

  client.collectDefaultMetrics({ timeout: 5000, prefix: 'ath_' })

  const upGauge = new client.Gauge({
    name: 'ath_up',
    help: '1 = up, 0 = not up'
  })
  upGauge.set(1)

  const tradeCounter = new client.Counter({
    name: 'ath_trades_count',
    help: 'total number of trades'
  })

  const priceGuage = new client.Gauge({
    name: 'ath_coinbase_price',
    help: 'Price of Bitcoin on Coinbase Pro'
  })

  express()
    .get('/metrics', (_, res) => res.end(client.register.metrics()))
    .listen(config.get('metrics.port'), config.get('metrics.host'), () =>
      log.info(
        `Metrics listening on http://${config.get('metrics.host')}:${config.get(
          'metrics.port'
        )}`
      )
    )

  Observable.fromEvent(events, 'gdax.TRADE').subscribe(
    ({ trade: { price } }) => {
      priceGuage.set(Number(price))
      tradeCounter.inc()
    }
  )
}
