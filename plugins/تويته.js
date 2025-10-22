let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`
╔═━━••【🧬】••━━═╗
✦ فين النص يا حب ✦
✦ مثال: .تويته صباح الخير يا عالم ✦
╚═━━••【📮】••━━═╝
    `.trim())
  }

  try {
    const avatar = await conn
      .profilePictureUrl(m.sender, 'image')
      .catch(_ => 'https://files.catbox.moe/fd2422.jpg')
    const displayName = conn.getName(m.sender)
    const username = m.sender.split('@')[0]
    const replies = '69' // تقدر تغير الرقم هنا
    const retweets = '69' // تقدر تغير الرقم هنا
    const theme = 'dark' // ممكن تغير لـ light

    const url = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(text)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`

    await conn.sendFile(m.chat, url, 'tweet.png', `
╔═━━••【🧬】••━━═╗
✦ شكراً لتغريدتك يا ${displayName} ✦
╚═━━••【📮】••━━═╝
    `.trim(), m)
  } catch (e) {
    console.log(e)
    await m.reply(`
╔═━━••【🧬】••━━═╗
✦ حصل خطأ، جرّب تاني بعد شوية ✦
╚═━━••【📮】••━━═╝
    `.trim())
  }
}

handler.help = ['tweet <comment>']
handler.tags = ['maker']
handler.command = /^(tweet|تويته|تغريده)$/i

export default handler