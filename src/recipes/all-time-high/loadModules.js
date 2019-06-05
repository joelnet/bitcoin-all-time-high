import glob from 'glob'
import { map } from 'mojiscript'
import pipe from 'mojiscript/core/pipe/sync'
import { join } from 'path'

const requireAll = pipe([
  map(file => join(__dirname, file)),
  map(require)
]) // prettier-ignore

export const loadModules = pipe([
  path => glob.sync(path, { cwd: __dirname }),
  requireAll
])
