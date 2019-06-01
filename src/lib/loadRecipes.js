import { getRecipes } from './pluginHelper'

export const loadRecipes = ({ recipeNames, events, dependencies }) =>
  getRecipes(recipeNames).map(recipe =>
    recipe({ dependencies, events }).catch(err => dependencies.log.error(err))
  )
