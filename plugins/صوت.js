// 🎵 تحميل صوت من YouTube 🧬
// 𝑲𝑬𝑵 𝑩𝑶𝑻 🧰

import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    let contoh = `${usedPrefix + command} سورة الكهف بصوت ماهر المعيقلي`
    return m.reply(
      `
╔═━━••【🧬】••━━═╗
*✦ ⚠️ كيفية الاستخدام:*
➜ اكتب رابط أو عنوان المقطع الصوتي الذي تريد تحميله.

*📌 مثال:*  
${contoh}
╚═━━••【🧬】••━━═╝
      `.trim()
    )
  }

  await m.react("🎧")

  let url
  let query = text.trim()

  if (query.startsWith('http')) {
    url = query
  } else {
    let search = await yts(query)
    if (!search.videos.length) throw `
╔═━━••【🧬】••━━═╗
*✦ ❌ لم يتم العثور على نتائج*
╚═━━••【🧬】••━━═╝
    `
    url = search.videos[0].url
  }

  try {
    await conn.sendMessage(m.chat, {
      text: `
╔═━━••【🧬】••━━═╗
*✦ 🎶 جاري تحميل الصوت بأعلى جودة...*
*✦ ⏳ يرجى الانتظار*
╚═━━••【🧬】••━━═╝
      `
    }, { quoted: m })

    let res = await fetch(`https://api.rapikzyeah.biz.id/api/downloader/donlotyete?url=${encodeURIComponent(url)}&type=mp3&quality=256`)
    let json = await res.json()

    if (!json.downloadUrl) throw `
╔═━━••【🧬】••━━═╗
*✦ ❌ لم يتم العثور على رابط التنزيل*
╚═━━••【🧬】••━━═╝
    `

    await conn.sendMessage(m.chat, {
      audio: { url: json.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${json.title}.mp3`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      text: `
╔═━━••【🧬】••━━═╗
*✦ ✅ تم تحميل الصوت بنجاح*
📄 *العنوان:* ${json.title}
🎚️ *الجودة:* 256kbps
╚═━━••【🧬】••━━═╝

*𝑲𝑬𝑵 𝑩𝑶𝑻 🧰*
      `
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `
╔═━━••【🧬】••━━═╗
*✦ ⚠️ حدث خطأ أثناء التحميل*
> ${e.message}
╚═━━••【🧬】••━━═╝
      `
    }, { quoted: m })
  }

  await m.react("✅")
}

handler.help = ['تحميل-صوت <رابط أو عنوان>']
handler.tags = ['downloader']
handler.command = ['yta', 'صوت']
handler.register = true

export default handler