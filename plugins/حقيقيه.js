import fetch from 'node-fetch'
import translate from '@vitalets/google-translate-api'

let yoMamaJokeHandler = async (m, { conn }) => {
  try {
    let factResponse = await fetch(`https://nekos.life/api/v2/fact`)
    let nameResponse = await fetch(`https://nekos.life/api/v2/name`)

    if (!factResponse.ok || !nameResponse.ok) {
      throw new Error(`فشل طلب API: ${factResponse.status} / ${nameResponse.status}`)
    }

    let factJson = await factResponse.json()
    let nameJson = await nameResponse.json()

    let fact = factJson.fact || "لم يتم العثور على حقيقة."
    let name = nameJson.name || "مجهول"

    // ترجمة الحقيقة للعربية
    let translation = await translate(fact, { to: 'ar' })
    let translatedFact = translation.text

    let message = `
╔═━━••【🧬】••━━═╗
📖 *الحقيقة*: ${translatedFact}
🖋️ *الكاتب*: ${name}
╚═━━••【📮】••━━═╝
    `.trim()

    await m.reply(message)
  } catch (error) {
    console.error(error)
    await m.reply(`
╔═━━••【🧬】••━━═╗
✦ حصل خطأ، جرّب تاني ✦
╚═━━••【📮】••━━═╝
    `.trim())
  }
}

yoMamaJokeHandler.help = ['حقيقه', 'اقتباس2', 'مثابره']
yoMamaJokeHandler.tags = ['fun']
yoMamaJokeHandler.command = /^(اقتباس2|حقيقه|مثابره)$/i

export default yoMamaJokeHandler