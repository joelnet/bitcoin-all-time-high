import { createLogger } from 'bunyan'
import bformat from 'bunyan-format'
import config from 'config'
import { pipe, merge } from 'ramda'

const period = {
  dailyRotation: '1d'
}
const level = config.get('debug.level')
const streams = [
  { stream: bformat({ outputMode: 'short' }) },
  {
    type: 'rotating-file',
    path: `${process.cwd()}/.data/all-time-high.log`,
    period: period.dailyRotation,
    count: 3
  }
]
const defaultOptions = merge({ streams, level })

export default pipe(
  defaultOptions,
  createLogger,
)
