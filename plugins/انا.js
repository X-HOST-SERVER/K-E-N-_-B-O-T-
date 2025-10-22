import { createHash } from 'crypto'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let who = m.quoted
      ? m.quoted.sender
      : (m.mentionedJid && m.mentionedJid[0])
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender

    global.db = global.db || { data: { users: {} } }
    global.db.data.users = global.db.data.users || {}
    const users = global.db.data.users

    if (!(who in users)) return m.reply('✳️ المستخدم غير موجود في قاعدة البيانات')

    const user = users[who]
    user.level = Number(user.level ?? 0)
    user.exp = Number(user.exp ?? 0)
    user.role = user.role ?? 'Member'
    user.diamond = user.diamond ?? 0
    user.registered = !!user.registered

    const { min, xp, max } = xpRange(user.level, global.multiplier ?? 1) || { min: 0, xp: 0, max: 0 }
    const currentInLevel = Math.max(0, user.exp - min)
    const need = Math.max(0, max - user.exp)

    // 👇 جلب صورة البروفايل كرابط مباشر
    let pp
    try {
      pp = await conn.profilePictureUrl(who, 'image')
    } catch {
      pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png' // صورة افتراضية أونلاين
    }

    let about = ''
    try { about = (await conn.fetchStatus?.(who) || {}).status || '' } catch {}

    let username = user.name || (conn.getName ? await conn.getName(who) : who.split('@')[0])
    const prem = Array.isArray(global.prems) ? global.prems.includes(who.split('@')[0]) : false
    const sn = createHash('md5').update(who).digest('hex')
    const prefix = usedPrefix || '.'

    const str = `
╔═━━••【🧬】••━━═╗
✦ *الاسم :* ${username}${about ? '\n✦ *الوصف :* ' + about : ''}
✦ *المستوى :* ${user.level}
✦ *اكسبي :* ${user.exp} ( ${currentInLevel} / ${xp} )
${need <= 0 ? `✦ جاهز لرفع المستوى: *${prefix}levelup*` : `✦ تحتاج: *${need}* اكسبي للترقية`}
✦ *التصنيف :* ${user.role}
✦ *الماسك :* ${user.diamond}
✦ *مسجل :* ${user.registered ? 'نعم' : 'لا'}
✦ *شخص مميز :* ${prem ? 'نعم' : 'لا'}
✦ *رمز التحقق :* ${sn}
╚═━━••【🧬】••━━═╝

«𝑲𝑬𝑵 𝑩𝑶𝑻 🧬»
`.trim()

    await conn.sendMessage(m.chat, { image: { url: pp }, caption: str, mentions: [who] }, { quoted: m })

  } catch (err) {
    console.error('[profile handler error]', err)
    m.reply('❌ خطأ أثناء تنفيذ البروفايل: ' + (err?.message || err))
  }
}

handler.help = ['profile']
handler.tags = ['group']
handler.command = ['البروفايل', 'بروفيلي', 'انا']

export default handler