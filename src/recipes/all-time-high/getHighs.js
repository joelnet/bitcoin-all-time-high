import { allPass, filter, head, map } from 'mojiscript'
import pipe from 'mojiscript/core/pipe/sync'

const isGdax = ({ exchange }) => exchange === 'gdax'
const isPeriodAllTime = ({ period }) => period === undefined
const isPeriod2019 = ({ period }) => period === '2019'

const getAllTimeHigh = pipe([
  filter(allPass([isGdax, isPeriodAllTime])),
  map(({ high }) => high),
  head
]) // prettier-ignore

const get2019High = pipe([
  filter(allPass([isGdax, isPeriod2019])),
  map(({ high }) => high),
  head
]) // prettier-ignore

export const getHighs = db =>
  db.highs.find({}).then(highs => ({
    high: getAllTimeHigh(highs),
    high2019: get2019High(highs)
  }))
