/* eslint-disable global-require,import/no-dynamic-require */
import flatten from 'ramda/src/flatten'
import map from 'ramda/src/map'
import pipe from 'ramda/src/pipe'
import uniq from 'ramda/src/uniq'
import { join } from 'path'

const dirname = join(__dirname, '..')

export const getRecipes = map(recipeName => require(`${dirname}/recipes/${recipeName}`).default)

export const getPlugins = pipe(
  map(recipeName => require(`${dirname}/recipes/${recipeName}`).plugins),
  flatten,
  uniq
)
