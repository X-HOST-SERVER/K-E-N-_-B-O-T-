import fs from 'fs'
import path from 'path'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

let handler = async (m, { conn, usedPrefix, command }) => {
    const usageMessage = `
╔═━━••【🧬】••━━═╗
*✦ طريقة الاستخدام: ✦*
- أرسل ملصق
- ثم رد عليه بالأمر: *${usedPrefix + command}*
╚═━━••【📮】••━━═╝
`

    const q = m.quoted || m
    const mime = q?.mimetype || q?.mediaType || ''

    if (!/webp/.test(mime)) {
        return m.reply(usageMessage)
    }

    try {
        const media = await q.download()
        if (!media) throw new Error("فشل تحميل الملصق")

        // إنشاء مجلد tmp إذا مش موجود
        const tmpDir = path.join('./tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        // مسارات الملفات المؤقتة
        const tmpIn = path.join(tmpDir, `${Date.now()}.webp`)
        const tmpOut = path.join(tmpDir, `${Date.now()}.png`)

        fs.writeFileSync(tmpIn, media)

        // تحويل الملصق إلى PNG
        await exec(`ffmpeg -i ${tmpIn} ${tmpOut}`)

        const buffer = fs.readFileSync(tmpOut)

        await conn.sendFile(
            m.chat,
            buffer,
            'sticker.png',
            `
╔═━━••【🧬】••━━═╗
*✦ تم تحويل الملصق إلى صورة بنجاح ✦*
╚═━━••【📮】••━━═╝

𝑲𝑬𝑵 𝑩𝑶𝑻
            `.trim(),
            m
        )

        // حذف الملفات المؤقتة
        fs.unlinkSync(tmpIn)
        fs.unlinkSync(tmpOut)

    } catch (e) {
        console.error("Sticker to Image Error:", e)
        m.reply(`
╔═━━••【🧬】••━━═╗
*✦ ⚠️ فشل التحويل: ${e.message} ✦*
╚═━━••【📮】••━━═╝

𝑲𝑬𝑵 𝑩𝑶𝑻
        `)
    }
}

handler.help = ['toimg', 'img', 'jpg', 'لصوره', 'لصورة']
handler.tags = ['sticker']
handler.command = ['toimg', 'img', 'jpg', 'لصوره', 'لصورة']

export default handler