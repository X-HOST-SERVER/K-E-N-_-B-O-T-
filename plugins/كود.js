import { toDataURL } from 'qrcode'

let handler = async (m, { conn, text, command }) => {
    let commandText = command.includes('code') || command.includes('كود') ? 'كود' : 'رمز QR'

    if (!text) return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
**✦ طريقة الاستخدام: ✦**

- أرسل الأمر **\`.${commandText} <النص>\`**
- سيتم تحويل النص إلى **${commandText}** وإرساله إليك.
**✦ مثال: ✦**
\`.${commandText} مرحبًا\`
╚═━━••【📮】••━━═╝
`, m)

    conn.sendFile(
        m.chat, 
        await toDataURL(text.slice(0, 2048), { scale: 8 }), 
        'qrcode.png', 
        `
╔═━━••【🧬】••━━═╗
**✦ تم إنشاء ${commandText} بنجاح! ✦**
╚═━━••【📮】••━━═╝
`, 
        m
    )
}

handler.help = ['', 'code', 'كود'].map(v => 'qr' + v)
handler.tags = ['tools']
handler.command = /^(qr|qrcode|كود)$/i
handler.register = true

export default handler