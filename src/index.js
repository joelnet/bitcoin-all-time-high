import './init'
import config from 'config'
import { EventEmitter2 } from 'eventemitter2'
import fs from 'fs-extra'
import Log from './log'
import Datastore from './lib/datastore'
import { loadPlugins } from './lib/loadPlugins'
import { loadRecipes } from './lib/loadRecipes'

const recipeNames = Object.keys(config.get('recipes'))

const events = new EventEmitter2({ wildcard: true })
const log = Log({ name: 'all-time-high' })
const db = {
  highs: Datastore({
    filename: `${process.cwd()}/.data/exchange.highs.db`,
    indexField: 'id'
  })
}
const dependencies = { log, db, fs }

log.info(`Starting [${recipeNames}].`)

loadPlugins({ recipes: config.get('recipes'), events })
loadRecipes({ recipeNames, events, dependencies })
