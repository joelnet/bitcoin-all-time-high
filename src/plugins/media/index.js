import Jimp from 'jimp'
import moment from 'moment'
import numeral from 'numeral'
import promisify from 'functional-helpers/promisify'

export default ({ events }) => {
  const mediaCreate = async ({ exchange, high, time }) => {
    const fontBlackLg = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
    const dollars = numeral(high).format('$0,0')
    const dollarsAndCents = numeral(high).format('$0,0.00')
    const date = moment(time)
    const text = `🎉🎉 NEW ALL TIME HIGH 🎉🎉\n\n 1 Bitcoin = ${dollarsAndCents} USD\n\n ${date.format('dddd, MMMM Do YYYY, h:mm:ss a')} on ${exchange.toUpperCase()}`
    const image = await Jimp.read(`${process.cwd()}/images/rocket1-506x253-2.png`)

    image.print(fontBlackLg, 260, 90, dollars)

    const base64 = await promisify(image.getBase64, image)(Jimp.MIME_PNG)

    events.emit('media.CREATE:DONE', { exchange, high, time, image: base64, text })
  }

  events.on('media.CREATE', mediaCreate)
}
