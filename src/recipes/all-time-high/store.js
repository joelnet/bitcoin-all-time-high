import cond from 'ramda/src/cond'
import T from 'ramda/src/T'
import { createStore } from 'redux'

const isAllTimeHigh = store => event =>
  Number(event.trade.price) > Number(store.getState().high)

const SET_HIGH = ({ type }) => type === 'SET_HIGH'

const init = {
  high: '0'
}

const reducers = (store = init, action) =>
  cond([
    [SET_HIGH, ({ high }) => ({ ...store, high })],
    [T, () => store]
  ])(action) // prettier-ignore

export default () => {
  const store = createStore(reducers)

  return { ...store, isAllTimeHigh: isAllTimeHigh(store) }
}
