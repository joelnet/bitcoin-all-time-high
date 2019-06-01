import { encodePNGToStream } from 'pureimage'
import { WritableStreamBuffer } from 'stream-buffers'
import always from 'ramda/src/always'
import pipeAsync from '../../lib/pipeAsync'

const imageToStream = (img, stream = new WritableStreamBuffer()) =>
  encodePNGToStream(img, stream).then(always(stream))

const streamToBase64 = stream => stream.getContentsAsString('base64')

export default pipeAsync(imageToStream, streamToBase64)
