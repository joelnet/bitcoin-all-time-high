/* eslint-disable global-require,import/no-dynamic-require */
import config from 'config'
import { EventEmitter2 } from 'eventemitter2'
import fs from 'fs-extra'
import './init'
import Log from './log'
import Datastore from './lib/datastore'
import { getRecipes, getPlugins } from './lib/pluginHelper'

const recipeNames = config.get('recipes')
const recipes = getRecipes(recipeNames)
const plugins = getPlugins(recipeNames)

const events = new EventEmitter2({ wildcard: true })
const log = Log({ name: 'all-time-high' })
const db = {
  highs: Datastore({ filename: `${process.cwd()}/.data/exchange.highs.db`, indexField: 'id' }),
}
const dependencies = { log, db, fs }

log.info(`Starting [${recipeNames}].`)

plugins
  .map(name => require(`${__dirname}/plugins/${name}`).default)
  .map(plugin => plugin({ events }))

recipes.map(recipe =>
  recipe({ dependencies, events })
    .catch(err => dependencies.log.error(err)))
