import Datastore from 'nedb'
import promisify from 'functional-helpers/promisify'
import when from 'ramda/src/when'

export default ({ filename, indexField }) => {
  const db = new Datastore({ filename, autoload: true })

  when(x => x, fieldName => db.ensureIndex({ fieldName, unique: true }), indexField)

  return {
    find: promisify(db.find, db),
    insert: promisify(db.insert, db),
    update: promisify(db.update, db),
  }
}
