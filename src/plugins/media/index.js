import PImage from 'pureimage'
import getImageFromFile from './getImageFromFile'
import imageToBase64 from './imageToBase64'
import pipeAsync from '../../lib/pipeAsync'

const registerFont = (file, name) =>
  new Promise(resolve => PImage.registerFont(file, name).load(resolve))

const writeText = (img, item) => {
  const ctx = img.getContext('2d')
  return (
    Object.assign(ctx, { fillStyle: item.color, font: `${item.size}pt 'Custom Font'` }),
    ctx.fillText(item.text, item.x, item.y),
    img
  )
}

const writeTexts = texts => img =>
  texts.reduce(writeText, img)

export default ({ events }) => {
  const mediaCreate = ({ exchange, high, time, data }) => pipeAsync(
    () => registerFont(data.font, 'Custom Font'),
    () => getImageFromFile(data.image),
    writeTexts(data.texts),
    imageToBase64,
    image => events.emit('media.CREATE:DONE', { exchange, high, time, image }),
  )()

  events.on('media.CREATE', mediaCreate)
}
