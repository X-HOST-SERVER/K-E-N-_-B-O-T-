import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
    if (!m.quoted) {
        await conn.sendMessage(m.chat, { text: `
╔═━━••【🧬】••━━═╗
✦ 👀 لازم ترد على الاستيكر اللي عايز تضيف عليه اسم الباكدج!
✦ مثال: 
⟣ .حقوق MyPack|KEN BOT
╚═━━••【📮】••━━═╝
        `}, { quoted: m })
        return
    }

    let stiker = false
    try {
        let [packname, ...author] = text.split('|')
        author = (author || []).join('|')
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) throw '👀 لازم الرد يكون على استيكر!'

        let img = await m.quoted.download()
        if (!img) throw '📥 فشل تحميل الاستيكر! حاول تاني.'

        stiker = await addExif(img, packname || '', author || '')

    } catch (e) {
        console.error(e)
        if (Buffer.isBuffer(e)) stiker = e
    } finally {
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
        } else {
            await conn.sendMessage(m.chat, { text: `
╔═━━••【❌】••━━═╗
✦ حصل خطأ!  
✦ تأكد أنك رديت على استيكر وأضفت اسم الباكدج بالشكل الصحيح.  
✦ مثال: .حقوق MyPack|KEN BOT
╚═━━••【📮】••━━═╝
            `}, { quoted: m })
        }
    }
}

handler.help = ['حقوق <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^حقوق|سرقة$/i
export default handler