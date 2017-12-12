/* eslint-disable global-require,import/no-dynamic-require */
import { EventEmitter2 } from 'eventemitter2'
import Log from './log'
import Datastore from './lib/datastore'
import { getRecipes, getPlugins } from './lib/pluginHelper'

const pluginNames = process.argv.slice(2)
const recipes = getRecipes(pluginNames)
const plugins = getPlugins(pluginNames)

const events = new EventEmitter2({ wildcard: true })
const log = Log({ name: 'all-time-high' })
const db = {
  highs: Datastore({ filename: `${process.cwd()}/.data/exchange.highs.db` }),
}
const dependencies = { log, db }

log.info('Starting.')

plugins
  .map(name => require(`${__dirname}/plugins/${name}`).default)
  .map(plugin => plugin({ events }))

recipes.map(recipe =>
  recipe({ dependencies, events })
    .catch(err => dependencies.log.error(err)))
