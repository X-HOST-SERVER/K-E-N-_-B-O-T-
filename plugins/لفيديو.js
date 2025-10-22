import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    console.log(`[${command}] triggered by: ${m.sender || m.key?.remoteJid || 'unknown'}`)

    // تحقق من الرد (reply)
    if (!m.quoted) {
      return await m.reply(
`╔═━━••【🧬】••━━═╗
*⚠️ اعمل ريبلاي على الاستيكر اللي عاوز تحوله لفيديو*
*استخدم:* ${usedPrefix + command}
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*`
      )
    }

    // حاول الحصول على الـ mimetype
    let mime = m.quoted.mimetype || (m.quoted.msg && Object.values(m.quoted.msg)[0]?.mimetype) || ''
    console.log('detected mime:', mime)

    // قبول webp أو audio أو image أو video
    if (!/webp|audio|image|video/.test(mime)) {
      return await m.reply(
`╔═━━••【🧬】••━━═╗
*⚠️ الملف المقتبس يجب أن يكون استيكر (webp) أو ملف صوت/صورة/فيديو*
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*`
      )
    }

    // دالة تحميل مرنة تحاول عدة طرق مع فشل آمن
    const downloadQuotedMedia = async () => {
      // بعض نسخ المكتبات تتيح m.quoted.download()
      try {
        if (typeof m.quoted.download === 'function') {
          return await m.quoted.download()
        }
      } catch (e) {
        console.warn('m.quoted.download failed:', e.message)
      }

      // بعض الإصدارات توفر m.quoted.msg و conn.download? جربها بحذر
      try {
        if (m.quoted && m.quoted.msg && typeof conn.download === 'function') {
          // قد تتطلب conn.download(pass message)
          return await conn.download(m.quoted.msg)
        }
      } catch (e) {
        console.warn('conn.download(m.quoted.msg) failed:', e.message)
      }

      // آخر محاولة: بعض مكتبات Baileys لديها downloadAndSaveMediaMessage
      try {
        if (typeof conn.downloadAndSaveMediaMessage === 'function') {
          const tmpPath = await conn.downloadAndSaveMediaMessage(m.quoted)
          // لو حصلت على مسار ملف، اقرأه (حاجة لـ fs) — لكن نتجنب تعقيد مسارات هنا
          // بدل ذلك، رمي خطأ لتوضيح الحاجة لنسخة مكتبة محددة
          throw new Error('downloadAndSaveMediaMessage returned a file path; لم نقرأه تلقائياً في هذا الهاندلر.')
        }
      } catch (e) {
        console.warn('conn.downloadAndSaveMediaMessage attempt failed or returned path:', e.message)
      }

      throw new Error('فشل تحميل الملف المقتبس — تأكد من أن جلسة conn تدعم التحميل (m.quoted.download أو conn.download موجودة).')
    }

    const media = await downloadQuotedMedia()
    if (!media || (Buffer.isBuffer(media) === false && typeof media !== 'string')) {
      throw new Error('الوسائط المُحمّلة ليست Buffer أو URL — تأكد من أن الدالة webp2mp4/ffmpeg تستقبل البافر أو عدّلها بحسب مكتبتك.')
    }

    // تحويل
    let out = null
    if (/webp/.test(mime)) {
      out = await webp2mp4(media) // قد يرجع Buffer أو رابط
    } else if (/audio/.test(mime)) {
      out = await ffmpeg(media, [
        '-filter_complex', 'color',
        '-pix_fmt', 'yuv420p',
        '-crf', '51',
        '-c:a', 'copy',
        '-shortest'
      ], 'mp3', 'mp4')
    } else if (/image/.test(mime)) {
      // صورة -> فيديو قصير (6 ثواني)
      out = await ffmpeg(media, [
        '-loop', '1',
        '-i', 'pipe:0',
        '-c:v','libx264',
        '-t','6',
        '-pix_fmt','yuv420p',
        '-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2'
      ], 'png', 'mp4')
    } else if (/video/.test(mime)) {
      // لو الفيديو، نرسله كما هو (أو نعيد تغليفه)
      out = media
    }

    // الـ out قد يكون Buffer أو كائن أو رابط — حاول التعامل مع الأنواع الشائعة
    let videoBuffer = null
    if (Buffer.isBuffer(out)) {
      videoBuffer = out
    } else if (typeof out === 'object' && out !== null) {
      // مثال: بعض الدوال ترجع {result: Buffer} أو {data: Buffer}
      if (Buffer.isBuffer(out.result)) videoBuffer = out.result
      else if (Buffer.isBuffer(out.data)) videoBuffer = out.data
      else if (typeof out.url === 'string') {
        // نرسل كـ رابط مباشر
        return await conn.sendMessage(m.chat, { video: { url: out.url }, caption: 
`╔═━━••【🧬】••━━═╗
*✅ تم تنفيذ طلبك بنجاح!* 🎉
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*` }, { quoted: m })
      } else {
        throw new Error('مخرجات التحويل غير معروفة (object)')
      }
    } else if (typeof out === 'string') {
      // رابط
      return await conn.sendMessage(m.chat, { video: { url: out }, caption:
`╔═━━••【🧬】••━━═╗
*✅ تم تنفيذ طلبك بنجاح!* 🎉
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*` }, { quoted: m })
    } else {
      throw new Error('تعذر استخراج البافر الناتج من عملية التحويل.')
    }

    // أخيراً: إرسال الفيديو كبافر
    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'sticker.mp4',
      caption:
`╔═━━••【🧬】••━━═╗
*✅ تم تنفيذ طلبك بنجاح!* 🎉
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*`
    }, { quoted: m })

  } catch (err) {
    console.error('handler error:', err)
    // رسالة خطأ ودودة للمستخدم مع نصّ الخطأ (يساعدنا بالتصحيح)
    await m.reply(
`╔═━━••【🧬】••━━═╗
*❌ فشل تنفيذ الأمر:* ${err.message || err}
*تفاصيل في الكونسول.* 
╚═━━••【🧬】••━━═╝
> *𝑲𝑬𝑵 𝑩𝑶𝑻*`
    )
  }
}

handler.help = ['tovideo']
handler.tags = ['sticker']
handler.command = ['لفديو', 'tomp4', 'لمقطع', 'لفيديو']

export default handler