import cond from 'ramda/src/cond'
import T from 'ramda/src/T'
import { createStore } from 'redux'

const isAllTimeHigh = store => event =>
  Number(event.trade.price) > Number(store.getState().high)

const is2020High = store => event =>
  Number(event.trade.price) > Number(store.getState()['2020_high'])

const SET_HIGH = ({ type }) => type === 'SET_HIGH'
const SET_2020_HIGH = ({ type }) => type === 'SET_2020_HIGH'

const init = {
  high: '0',
  '2020_high': '0'
}

const reducers = (store = init, action) =>
  cond([
    [SET_HIGH, ({ high }) => ({ ...store, high })],
    [SET_2020_HIGH, ({ high }) => ({ ...store, '2020_high': high })],
    [T, () => store]
  ])(action)

export default () => {
  const store = createStore(reducers)

  return {
    ...store,
    isAllTimeHigh: isAllTimeHigh(store),
    is2020High: is2020High(store)
  }
}
