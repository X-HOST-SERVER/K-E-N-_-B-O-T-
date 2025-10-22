import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        throw `📮 *🚀 أدخل وصفًا للصورة التي تريد تخيلها.*

🌐 يرجى كتابة الوصف باللغة الإنجليزية للحصول على نتائج أفضل.

📌 *مثال الاستخدام:*
.${command} A lion sitting on the moon --landscape

📋 *أنواع الأحجام المتاحة:*
- square => صورة مربعة
- potrait => صورة رأسية
- landscape => صورة أفقية

🅜🅘🅝🅐🅣🅞 🅑🅞🅣📮`
    }

    if (text.trim() === '--list') {
        return m.reply(`📮 *📋 الأحجام المتاحة لتوليد الصور:*\n\n- square => 1024x1024 (مربعة)\n- potrait => 1024x1792 (رأسية)\n- landscape => 1792x1024 (أفقية)\n\n📌 مثال:\n.ارسم A castle floating in the sky --landscape\n\n🅜🅘🅝🅐🅣🅞 🅑🅞🅣📮`)
    }

    let size = 'potrait'
    let prompt = text

    if (text.includes('--')) {
        const parts = text.split('--')
        prompt = parts[0].trim()
        size = parts[1].trim().toLowerCase()
    }

    await m.react('⏳')

    try {
        const hsil = await imagen(prompt, size)
        if (!hsil?.data?.[0]?.url) throw '📮 فشل في الحصول على الصورة من API'

        const imgurl = hsil.data[0].url

        await conn.sendMessage(m.chat, {
            image: { url: imgurl },
            caption: `📮 *صورة تم توليدها بالذكاء الاصطناعي:*\n\n🖋️ *الوصف:* ${prompt}\n📐 *الحجم:* ${size}\n\n🅜🅘🅝🅐🅣🅞 🅑🅞🅣📮`
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        throw `📮 حدث خطأ أثناء توليد الصورة.\n💡 تأكد من عدم تجاوز الحد المسموح (عادة صورة كل 60 ثانية).\n\n🔧 *الخطأ:* ${e.message}\n\n🅜🅘🅝🅐🅣🅞 🅑🅞🅣📮`
    }
}

handler.help = ['ارسم']
handler.tags = ['ai']
handler.command = /^ارسم$/i
handler.limit = true
handler.premium = false
export default handler

async function imagen(prompt, size) {
    const photo = {
        'square': '1024x1024',
        'potrait': '1024x1792',
        'landscape': '1792x1024'
    }

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://imagen.exomlapi.com/'
    }

    const data = {
        prompt: prompt,
        model: 'imagen_3_5',
        size: photo[size] || photo['potrait'],
        response_format: 'url'
    }

    const res = await axios.post('https://imagen.exomlapi.com/v1/images/generations', data, {
        headers,
        decompress: true
    })

    return res.data
}