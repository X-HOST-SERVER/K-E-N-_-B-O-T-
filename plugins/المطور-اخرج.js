let handler = async (m, { conn, args, command }) => {
  await m.reply('*مش هتوحشوني مع السلامه اللي باعنا خسر دلعنا ⁦^⁠_⁠^⁩*') 
  
  // خروج البوت الأساسي
  await conn.groupLeave(m.chat)

  // خروج جميع البوتات الفرعية (JadiBot)
  if (global.conns && global.conns.length > 0) {
    for (let jadibot of global.conns) {
      try {
        await jadibot.groupLeave(m.chat)
      } catch (e) {
        console.log(`فشل خروج البوت الفرعي: ${e}`)
      }
    }
  }
}

handler.command = /^(out|leavegc|اخرج|برا)$/i
handler.group = true
handler.rowner = true

export default handler