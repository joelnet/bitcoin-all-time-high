import PImage from 'pureimage'
import getImageFromFile from './getImageFromFile'
import imageToBase64 from './imageToBase64'

const registerFont = (file, name) =>
  new Promise(resolve => PImage.registerFont(file, name).load(resolve))

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
      .then(() => getImageFromFile(data.image))
      .then(writeTexts(data.texts))
      .then(imageToBase64)
      .then(image => events.emit('media.CREATE:DONE', { exchange, high, time, image }))

  events.on('media.CREATE', mediaCreate)
}
