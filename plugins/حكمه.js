import { hikamList } from './hikam-db.js'

let handler = async (m, { conn }) => {
  try {
    // اختيار حكمة عشوائية
    let random = hikamList[Math.floor(Math.random() * hikamList.length)]

    let message = `
╔═━━••【🧬】••━━═╗
📖 *الحكمة*: ${random.text}
🖋️ *النوع من*: ${random.author}
╚═━━••【📮】••━━═╝
    `.trim()

    await m.reply(message)
  } catch (err) {
    console.error(err)
    await m.reply("❌ حصل خطأ في جلب الحكمة")
  }
}

handler.help = ['حكم', 'اقتباس']
handler.tags = ['fun']
handler.command = /^(حكم|حكمه|اقتباس)$/i

export default handler