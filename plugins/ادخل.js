let handler = async (m, { conn, text, usedPrefix, command, args, participants, isOwner }) => {

  // لو اللي بيستعمل الأمر مش أونر
  if (!isOwner) return conn.sendButton(
    m.chat,
    `*⎔⋅ ╼╃ ⊰ •﹝🧬﹞• ⊱ ╄╾ ⋅⎔*\n\n*يا @${m.sender.split('@')[0]}*\n*لو حابب تضيف البوت لمجموعة، كلم الأونر عشان يظبطلك الموضوع.*`.trim(),
    igfg,
    null,
    [['*اتصل بالأونر*', `${usedPrefix}buyprem`]],
    m,
    { mentions: [m.sender] }
  )

  // التحقق من الرابط
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let delay = time => new Promise(res => setTimeout(res, time))

  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) throw `*✠ أرسل لينك الجروب أولاً.*\n\n*📌 مثال:*\n*${usedPrefix + command}* <الرابط>`
  if (!code) throw `*✠ اللينك غير صحيح يا كبير!*`

  // رسالة الدخول
  m.reply(`*⎔⋅ ╼╃ ⊰ •﹝🧬﹞• ⊱ ╄╾ ⋅⎔*\n*ويــــت… البوت داخل الجروب دلوقتي 🥂.*`)
  await delay(3000)

  try {
    // الانضمام للجروب
    let res = await conn.groupAcceptInvite(code)
    let b = await conn.groupMetadata(res)
    let d = b.participants.map(v => v.id)
    let member = d.toString()

    // تأكيد الدخول
    await m.reply(`*⎔⋅ ╼╃ ⊰ •﹝🧬﹞• ⊱ ╄╾ ⋅⎔*\n*تم دخول 𝐊𝐄𝐍 • 𝐁𝐎𝐓 للجروب بنجاح!*\n\n*✠ معلومات الجروب:*\n*• الاسم:* ${await conn.getName(res)}`)

    // رسالة الترحيب في الجروب
    await conn.reply(res,
      `*⎔⋅ ╼╃ ⊰ •﹝🧬﹞• ⊱ ╄╾ ⋅⎔*\n*هايات جميعاً!*\n\n*@${m.sender.split('@')[0]}* أضافني هنا بأمر من مطوري 𝐊𝐄𝐍....#.# 🧬`,
      m,
      { mentions: d }
    ).then(async () => {
      await delay(7000)
    }).then(async () => {
      await conn.reply(res, `*📮 الدخول العشوائي للبوت بدون إذن المطور قد يؤدي للحظر!*`, 0)
    })

  } catch (e) {
    conn.reply(global.owner[1] + '@s.whatsapp.net', e)
    throw `*📮 حدثت مشكلة أثناء دعوة البوت للجروب.*`
  }
}

handler.help = ['join <chat.whatsapp.com>']
handler.tags = ['owner']
handler.command = ['ادخل', 'انضم']
// handler.owner = true

export default handler