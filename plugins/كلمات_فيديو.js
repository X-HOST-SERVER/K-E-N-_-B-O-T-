import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const tmpDir = './tmp'
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video|audio|mp4|mov|webm|m4a|ogg|opus|3gp|x-m4a/i.test(mime)) {
      return conn.sendMessage(m.chat, { text:
        `╔═━━••【🎥】••━━═╗
✦ لازم ترد على *فيديو* أو *مقطع صوتي* عشان أطلع لك الكلام منه.
✦ مثال: (رد على الفيديو) ${usedPrefix || '.'}${command}
╚═━━••【📮】••━━═╝` }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { text:
      `╔═━━••【⌛】••━━═╗
✦ جاري استخراج النص... استنى شوية
╚═━━••【🔄】••━━═╝`
    }, { quoted: m })

    const mediaBuffer = await q.download?.()
    if (!mediaBuffer) throw new Error('فشل تنزيل الملف.')

    const id = Date.now()
    const inPath = path.join(tmpDir, `in_${id}.mp4`)
    fs.writeFileSync(inPath, mediaBuffer)

    const outPath = path.join(tmpDir, `out_${id}.txt`)

    // تشغيل whisper.cpp محلياً (لازم يكون متسطب عندك)
    await new Promise((resolve, reject) => {
      const proc = spawn('whisper', [inPath, '--language', 'ar', '--output_txt', '--output_file', outPath])
      proc.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`whisper process exited with ${code}`))
      })
    })

    const text = fs.readFileSync(outPath, 'utf-8')

    if (!text) throw new Error('لم يتم استخراج أي نص.')

    await conn.sendMessage(m.chat, { text:
      `╔═━━••【📝】••━━═╗
✦ *النص المستخرج من الفيديو:*  
${text}
╚═━━••【✅】••━━═╝` }, { quoted: m })

    fs.unlinkSync(inPath)
    fs.unlinkSync(outPath)

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text:
      `╔═━━••【❌】••━━═╗
✦ خطأ أثناء استخراج كلام الفيديو:
✦ ${err.message}
╚═━━••【⚠️】••━━═╝` }, { quoted: m })
  }
}

// ✦ تعريف الأمر هنا ✦
handler.help = ['كلمات_فيديو']
handler.tags = ['tools']
handler.command = /^كلمات_فيديو$/i

export default handler