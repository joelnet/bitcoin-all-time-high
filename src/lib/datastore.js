import Datastore from 'nedb'
import promisify from 'functional-helpers/promisify'
import when from 'ramda/src/when'

const indexFieldNotEmpty = x => x

const ensureIndex = db => fieldName =>
  db.ensureIndex({ fieldName, unique: true })

export default ({ filename, indexField }) => {
  const db = new Datastore({ filename, autoload: true })

  when(indexFieldNotEmpty, ensureIndex(db), indexField)

  return {
    find: promisify(db.find, db),
    insert: promisify(db.insert, db),
    update: promisify(db.update, db),
  }
}
