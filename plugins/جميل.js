let handler = async (m, { conn, text }) => {
    // لو مفيش منشن ولا نص
    if (!text && !(m.mentionedJid && m.mentionedJid[0])) {
        const exampleMessage = `
╔═════ •『 🍬 』• ═════╗
✦ اكتب الأمر مع منشن الشخص ✦
✦ مثال: .جميل @منشن
╚═════ •『 🍬 』• ═════╝
`.trim()
        
        return await conn.sendMessage(m.chat, { 
            text: exampleMessage 
        }, { quoted: m })
    }

    // تحديد الشخص اللي اتعمله منشن
    const mentionedUser = m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : text.replace(/[@ .+-]/g, '') + '@s.whatsapp.net'

    // نسب من 0% لحد 100%
    const userChar = Array.from({ length: 101 }, (_, i) => `${i}%`)
    const userCharacterSeletion = userChar[Math.floor(Math.random() * userChar.length)]

    // الرسالة
    let message = `
╔═════ •『 🍬 』• ═════╗
✦ المنشن ↜ @${mentionedUser.split("@")[0]}
✦ نسبة الجمال ↜ ${userCharacterSeletion}
╚═════ •『 🍬 』• ═════╝
`.trim()

    // إرسال الرسالة مع المنشن
    await conn.sendMessage(m.chat, { text: message, mentions: [mentionedUser] }, { quoted: m })
}

handler.help = ["جميل @tag"]
handler.tags = ['fun']
handler.command = /^(جميل)/i

export default handler