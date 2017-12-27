/* eslint-disable camelcase */
import Twit from 'twit'
import config from 'config'
import promisify from 'functional-helpers/promisify'
import when from 'ramda/src/when'
import indexOf from 'ramda/src/indexOf'

const hasMimeType = indexOf(',')
const stripMimeType = image =>
  image.substr(image.indexOf(',') + 1)

export default ({ events }) => {
  const options = config.get('twitter')
  const twit = new Twit(options)
  const post = promisify(twit.post, twit)

  const postMedia = async ({ exchange, high, time, image, text }) => {
    const newImage = when(hasMimeType, stripMimeType, image)
    const { media_id_string } = await post('media/upload', { media_data: newImage })

    await post('media/metadata/create', { media_id: media_id_string, alt_text: { text } })
    await post('statuses/update', { status: text, media_ids: [media_id_string] })

    events.emit('twitter.POST_MEDIA:DONE', { exchange, high, time, image })
  }

  events.on('twitter.POST_MEDIA', postMedia)
}
