import { decodePNGFromStream } from 'pureimage'
import pipe from 'ramda/src/pipe'
import { createReadStream } from 'fs-extra'

export default pipe(
  createReadStream,
  decodePNGFromStream
)
