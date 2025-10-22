let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
╔═════ •『 🎥 』• ═════╗
*✦ فين النص يا حب ✦*
*✦رد على رابط يوتويب✦*
*✦ مثال: .كومنت شكرا على الفيديو الرائع*
╚═════ •『 🎥 』• ═════╝
    `.trim())
  }

  try {
    // API بديلة تعمل بدون API key
    let apiUrl = `https://some-random-api.com/canvas/misc/youtube-comment?username=${encodeURIComponent(conn.getName(m.sender))}&comment=${encodeURIComponent(text)}&avatar=https://files.catbox.moe/fd2422.jpg`
    
    await conn.sendFile(m.chat, apiUrl, 'ytcomment.png', `
╔═════ •『 ✅ 』• ═════╗
*✦ شكرا لتعليقك ✦*
╚═════ •『 ✅ 』• ═════╝
    `.trim(), m)
    
  } catch (error) {
    console.log(error)
    // إذا فشل، نستخدم طريقة بديلة
    let alternativeApi = `https://vihangayt.me/tools/youtubecomment?text=${encodeURIComponent(text)}&name=${encodeURIComponent(conn.getName(m.sender))}`
    
    try {
      await conn.sendFile(m.chat, alternativeApi, 'ytcomment.jpg', `
╔═════ •『 ✅ 』• ═════╗
*✦ شكرا لتعليقك ✦*
╚═════ •『 ✅ 』• ═════╝
      `.trim(), m)
    } catch (e) {
      // إذا فشلت جميع المحاولات
      await conn.sendMessage(m.chat, {
        text: `
╔═════ •『 🎥 』• ═════╗
*✦ تعليق اليوتيوب ✦*
*✦ الاسم: ${conn.getName(m.sender)}*
*✦ التعليق: ${text}*
> ✦ ملاحظة: الخدمة غير متاحة حالياً
╚═════ •『 🎥 』• ═════╝
        `.trim()
      }, { quoted: m })
    }
  }
}

handler.help = ['ytcomment <comment>']
handler.tags = ['maker']
handler.command = /^(ytcomment|كومنت)$/i
export default handler