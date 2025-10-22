// 🎵 تحميل صوت من YouTube 🧬
// 𝑲𝑬𝑵 𝑩𝑶𝑻 🧰

import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    let contoh = `${usedPrefix + command} https://youtube.com/watch?v=l_WQdAWZJ8I`
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

  let url, video
  let query = text.trim()

  if (query.startsWith('http')) {
    url = query
    let search = await yts({ videoId: url.split("v=")[1] })
    video = search
  } else {
    let search = await yts(query)
    if (!search.videos.length) throw `
╔═━━••【🧬】••━━═╗
*✦ ❌ لم يتم العثور على نتائج*
╚═━━••【🧬】••━━═╝
    `
    video = search.videos[0]
    url = video.url
  }

  try {
    let res = await fetch(`https://api.rapikzyeah.biz.id/api/downloader/donlotyete?url=${encodeURIComponent(url)}&type=mp3&quality=256`)
    let json = await res.json()

    if (!json.downloadUrl) throw `
╔═━━••【🧬】••━━═╗
*✦ ❌ لم يتم العثور على رابط التنزيل*
╚═━━••【🧬】••━━═╝
    `

    // ✅ تجهيز الكابشن مع الصورة
    const caption = `╭━━〔 *⛩️  YOUTUBE - MP3 🌪️* 〕━━⬣
┃ ✦🎵 *العنوان:* ${video.title}
┃ ✦⏱️ *المدة:* ${video.timestamp}
┃ ✦📺 *القناة:* ${video.author.name}
┃ ✦👁️ *المشاهدات:* ${video.views.toLocaleString()}
┃ ✦📅 *منذ:* ${video.ago}
┃ ✦🔗 *الرابط:* ${url}
╰━━━━━━━━━━━━━━━━━━⬣

> ⏳ جاري تجهيز الصوت...`

    // ✅ إرسال الصورة مع المعلومات
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: caption
    }, { quoted: m })

    // ✅ إرسال الصوت
    await conn.sendMessage(m.chat, {
      audio: { url: json.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`
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

handler.help = ['ytmp3 <رابط أو عنوان>']
handler.tags = ['downloader']
handler.command = ['ytmp3']
handler.register = true

export default handler