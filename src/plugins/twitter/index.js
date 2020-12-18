import config from 'config'
import fs from 'fs'
import promisify from 'functional-helpers/promisify'
import indexOf from 'ramda/src/indexOf'
import when from 'ramda/src/when'
import Twit from 'twit'

const hasMimeType = indexOf(',')
const stripMimeType = image => image.substr(image.indexOf(',') + 1)

export default ({ events }) => {
  const { enabled, ...options } = config.get('twitter')
  const twit = new Twit(options)
  const post = promisify(twit.post, twit)

  const postMedia = async ({ exchange, high, time, image, text }) => {
    const newImage = when(hasMimeType, stripMimeType, image)
    const { media_id_string } = await post('media/upload', {
      media_data: newImage
    })

    const metadata = { media_id: media_id_string, alt_text: { text } }
    const status = { status: text, media_ids: [media_id_string] }

    if (enabled) {
      await post('media/metadata/create', metadata)
      await post('statuses/update', status)
    } else {
      const file = Buffer.from(image, 'base64')
      fs.writeFileSync(process.cwd() + '/DELME.jpg', file)
    }

    events.emit('twitter.POST_MEDIA:DONE', { exchange, high, time, image })
  }

  events.on('twitter.POST_MEDIA', postMedia)
}
