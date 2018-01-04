/* eslint-disable global-require,import/no-dynamic-require */
import map from 'ramda/src/map'
import pipe from 'ramda/src/pipe'
import props from 'ramda/src/props'
import uniq from 'ramda/src/uniq'
import unnest from 'ramda/src/unnest'
import { join } from 'path'

const dirname = join(__dirname, '..')

export const getRecipes = map(recipeName => require(`${dirname}/recipes/${recipeName}`).default)

export const getPluginNames = recipes => pipe(
  props(Object.keys(recipes)),
  unnest,
  uniq,
)(recipes)
