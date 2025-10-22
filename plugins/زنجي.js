let handler = async (m, { conn, text }) => {
    // إذا لم يكن هناك نص أو منشن
    if (!text && !m.mentionedJid?.length) {
        const exampleMessage = `
╔═━━••【🍬】••━━═╗
✦ اكتب الأمر مع منشن الشخص ✦
مثال:
.زنجي @الاسم
╚═━━••【📮】••━━═╝
`.trim()
        
        return await conn.sendMessage(m.chat, { 
            text: exampleMessage 
        }, { quoted: m })
    }

    // تحديد المستخدم المذكور
    let mentionedUser
    if (m.mentionedJid && m.mentionedJid[0]) {
        mentionedUser = m.mentionedJid[0]
    } else {
        // إزالة الرموز الخاصة من النص لاستخراج الرقم
        mentionedUser = text.replace(/[@ .+-]/g, '') + '@s.whatsapp.net'
    }

    // نسب من 0% لحد 100%
    const randomPercent = Math.floor(Math.random() * 101) + '%'

    // الرسالة
    let message = `
╔═━━••【🍬】••━━═╗
✦ المنشن ↜ @${mentionedUser.split("@")[0]}
✦ النسبة ↜ ${randomPercent}
╚═━━••【📮】••━━═╝
`.trim()

    // إرسال الرسالة مع المنشن
    await conn.sendMessage(m.chat, { 
        text: message, 
        mentions: [mentionedUser] 
    }, { quoted: m })
}

handler.help = ["زنجي @tag"]
handler.tags = ['fun']
handler.command = /^(زنجي)$/i

export default handler