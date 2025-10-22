import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
╔═━━••【🧬】••━━═╗
✦ *إدخل النص لإنشاء الصورة مع الأمر:*  
*مثال:* ${usedPrefix + command} "cat in space"  
*يرجى كتابة الوصف باللغة الإنجليزية* ✦
╚═━━••【📮】••━━═╝
`)

  m.reply(`
╔═━━••【🧬】••━━═╗
✦ *جاري معالجة الصورة، يرجى الانتظار...* ✦
╚═━━••【📮】••━━═╝
`)

  let imageUrl = await generateImage(text)
  if (!imageUrl) return m.reply(`
╔═━━••【🧬】••━━═╗
✦ *فشل في إنشاء الصورة. حاول تغيير النص (prompt).* ✦
╚═━━••【📮】••━━═╝
`)

  await conn.sendMessage(m.chat, { 
    image: { url: imageUrl }, 
    caption: `
╔═━━••【🧬】••━━═╗
✦ *تم إنشاء الصورة بنجاح!* ✦
*النص المدخل:* ${text}
╚═━━••【📮】••━━═╝
`
  }, { quoted: m })
}

handler.help = ['deepimg', 'تخيل']
handler.command = /^(deepimg|تخيل)$/i
handler.tags = ['tools']

export default handler

async function generateImage(prompt) {
  try {
    let { data } = await axios.post("https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev", {
      prompt,
      size: "1024x1024",
      device_id: `dev-${Math.floor(Math.random() * 1000000)}`
    }, {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://deepimg.ai",
        Referer: "https://deepimg.ai/"
      }
    })
    return data?.data?.images?.[0]?.url || null
  } catch (err) {
    console.error(err.response ? err.response.data : err.message)
    return null
  }
}