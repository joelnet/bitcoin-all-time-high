import promisify from 'functional-helpers/promisify'
import Datastore from 'nedb'

export default ({ filename }) => {
  const db = new Datastore({ filename, autoload: true })

  return {
    find: promisify(db.find, db),
    insert: promisify(db.insert, db),
    update: promisify(db.update, db)
  }
}
