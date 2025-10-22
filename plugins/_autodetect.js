import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { readdirSync, unlinkSync, existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }

  let chat = global.db.data.chats[m.chat]
  let usuario = `@${m.sender.split('@')[0]}`
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

  let nombre = `
╭─⃟⃝💠 تـغـيـيـر الاســـم ─╮
┃ 👤 المستخدم: *${usuario}*
┃ ✨ قام بتغيير اسم المجموعة.
┃ 🆕 الاسم الجديد:
┃ ❝ *${m.messageStubParameters[0]}* ❞
╰───⃟⃝🌟━━━━━━━━━━━━━╯`.trim()

  let foto = `
╭─⃟📸 تـحـديـث الـصـورة ─╮
┃ 🧑 المستخدم: *${usuario}*
┃ 🔄 قام بتغيير صورة المجموعة.
╰───⃟🎨━━━━━━━━━━━━━━╯`.trim()

  let edit = `
╭─⃟⚙️ إعـدادات الـمـجـمـوعـة ─╮
┃ 👤 المستخدم: *${usuario}*
┃ 🔁 غيّر إعدادات المجموعة.
${m.messageStubParameters[0] == 'on' ?
'┃ 🔒 الوضع الحالي: *فقط المشرفين* يمكنهم التعديل.' :
'┃ 🔓 الوضع الحالي: *جميع الأعضاء* يمكنهم التعديل.'}
╰────⚙️━━━━━━━━━━━━━━╯`.trim()

  let newlink = `
╭─⃟🔗 تـم إنشاء رابط جـديـد ─╮
┃ 👤 أنشأه: *${usuario}*
┃ 🌍 تم إنشاء رابط دعوة جديد.
╰────🔗━━━━━━━━━━━━━━╯`.trim()

  let status = `
╭─⃟🛡️ تـغـيـيـر الـوضـع ─╮
┃ 👤 التغيير بواسطة: *${usuario}*
${m.messageStubParameters[0] == 'on' ?
'┃ 🔒 المجموعة *مقفلة* — فقط المشرفون يمكنهم إرسال الرسائل.' :
'┃ 🔓 المجموعة *مفتوحة* — يمكن للجميع إرسال الرسائل.'}
╰────🛡️━━━━━━━━━━━━━━╯`.trim()

  let admingp = `
╭─⃟👑 تـرقيـة مـشـرف ─╮
┃ 🔰 *@${m.messageStubParameters[0].split('@')[0]}*
┃ حصل على صلاحيات المشرف.
┃ 📌 تمت الترقية بواسطة: *${usuario}*
╰──────👑━━━━━━━━━━━━╯`.trim()

  let noadmingp = `
╭─⃟📮 إزالـة مـشـرف ─╮
┃ 🔻 *@${m.messageStubParameters[0].split('@')[0]}*
┃ تم إزالة صلاحياته كمشرف.
┃ 🗑️ تمت الإزالة بواسطة: *${usuario}*
╰──────📮━━━━━━━━━━━━╯`.trim()

  if (chat.detect && m.messageStubType == 2) {
    const uniqid = (m.isGroup ? m.chat : m.sender)
    const sessionPath = './Sessions/'
    for (const file of await fs.readdir(sessionPath)) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file))
        console.log(`${chalk.yellow.bold('[ ملف تم حذفه ]')} ${chalk.greenBright(`${file}`)}\n` +
          `${chalk.blue('(مفتاح جلسة)')} ${chalk.redBright('يسبب ظهور undefined في المحادثة')}`)
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 23) {
    await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, { text: admingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
  } else {
    if (m.messageStubType == 2) return
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType],
    })
  }
}

export default handler