import cond from 'ramda/src/cond'
import T from 'ramda/src/T'
import { createStore } from 'redux'

const isAllTimeHigh = store => event =>
  Number(event.trade.price) > Number(store.getState().high)

const is2019High = store => event =>
  Number(event.trade.price) > Number(store.getState()['2019_high'])

const SET_HIGH = ({ type }) => type === 'SET_HIGH'
const SET_2019_HIGH = ({ type }) => type === 'SET_2019_HIGH'

const init = {
  high: '0',
  '2019_high': '0'
}

const reducers = (store = init, action) =>
  cond([
    [SET_HIGH, ({ high }) => ({ ...store, high })],
    [SET_2019_HIGH, ({ high }) => ({ ...store, '2019_high': high })],
    [T, () => store]
  ])(action)

export default () => {
  const store = createStore(reducers)

  return {
    ...store,
    isAllTimeHigh: isAllTimeHigh(store),
    is2019High: is2019High(store)
  }
}
