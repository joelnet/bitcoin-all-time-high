import { getHighs } from './getHighs'
import { loadModules } from './loadModules'
import createStore from './store'

export default async ({ dependencies: { db, log }, events } = {}) => {
  const store = createStore()
  const dependencies = { events, db, log, store }
  const { high, high2020 } = await getHighs(db)

  const updateHigh = action => action.high && store.dispatch(action)

  loadModules('events/**/*.event.js').map(({ event }) => event(dependencies))

  updateHigh({ type: 'SET_HIGH', high })
  updateHigh({ type: 'SET_2020_HIGH', high: high2020 })

  log.info('Previous all time high:', store.getState().high)
}
