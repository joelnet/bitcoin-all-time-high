import PImage from 'pureimage'
import pipe from 'ramda/src/pipe'
import fs from 'fs-extra'
import { WritableStreamBuffer } from 'stream-buffers'

const registerFont = (file, name) =>
  new Promise(resolve => PImage.registerFont(file, name).load(resolve))

const getImage = pipe(
  fs.createReadStream,
  PImage.decodePNGFromStream
)

const imageToBase64 = img => {
  const stream = new WritableStreamBuffer()
  return PImage.encodePNGToStream(img, stream)
    .then(() => stream.getContentsAsString('base64'))
}

const writeText = (img, item) => {
  const ctx = img.getContext('2d')
  Object.assign(ctx, { fillStyle: item.color, font: `${item.size}pt 'Custom Font'` })
  ctx.fillText(item.text, item.x, item.y)
  return img
}

const writeTexts = texts => img =>
  texts.reduce(writeText, img)

export default ({ events }) => {
  const mediaCreate = async ({ exchange, high, time, data }) =>
    registerFont(data.font, 'Custom Font')
      .then(() => getImage(data.image))
      .then(writeTexts(data.texts))
      .then(imageToBase64)
      .then(image => events.emit('media.CREATE:DONE', { exchange, high, time, image }))

  events.on('media.CREATE', mediaCreate)
}
