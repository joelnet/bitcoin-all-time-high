import { join } from 'path'
import { getPluginNames } from './pluginHelper'

const root = join(__dirname, '../plugins')

export const loadPlugins = ({ recipes, events }) =>
  getPluginNames(recipes)
    .map(name => require(join(root, name)).default)
    .map(plugin => plugin({ events }))
