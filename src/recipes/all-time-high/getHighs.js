import { allPass, filter, head, map } from 'mojiscript'
import pipe from 'mojiscript/core/pipe/sync'

const isGdax = ({ exchange }) => exchange === 'gdax'
const isPeriodAllTime = ({ period }) => period === undefined
const isPeriod2020 = ({ period }) => period === '2020'

const getAllTimeHigh = pipe([
  filter(allPass([isGdax, isPeriodAllTime])),
  map(({ high }) => high),
  head
]) // prettier-ignore

const get2020High = pipe([
  filter(allPass([isGdax, isPeriod2020])),
  map(({ high }) => high),
  head
]) // prettier-ignore

export const getHighs = db =>
  db.highs.find({}).then(highs => ({
    high: getAllTimeHigh(highs),
    high2020: get2020High(highs)
  }))
