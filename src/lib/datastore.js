import Datastore from 'nedb'
import promisify from 'functional-helpers/promisify'

export default ({ filename }) => {
  const db = new Datastore({ filename, autoload: true })

  db.ensureIndex({ fieldName: 'id', unique: true })

  return {
    find: promisify(db.find, db),
    insert: promisify(db.insert, db),
    update: promisify(db.update, db),
  }
}
