import { createHash } from 'crypto' 
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false, isUser = false
  let isEnable = chat[type] || false

  if (args[0] === 'تشغيل' || args[0] === 'تفعيل') {
    isEnable = true;
} else if (args[0] === 'ايقاف' || args[0] === 'تعطيل') {
    isEnable = false
} else {
    const estado = isEnable ? '✓ مُفعل' : '✗ مُعطل'
    return conn.reply(m.chat, `╭━〔 ⚙️ الإعدادات 〕━╮
┃ 📜 هذا الأمر: *${command}*
┃ 🛡️ يمكن فقط للإدمنز التحكم به.
┃
┃ 🔧 للتفعيل:
┃ ┗ ❯ *${usedPrefix}${command} تشغيل*
┃ 📴 للتعطيل:
┃ ┗ ❯ *${usedPrefix}${command} ايقاف*
┃
┃ 👾 الحالة الحالية: *${estado}*
╰━━━━━━━━━━━━━━━━━━━━━━╯`, m, rcanal);
  }

  switch (type) {
    case 'الترحيب':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break  
      
    case 'منع_الخاص':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'منع_العرب':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiarabe = isEnable
      break

    case 'تقييد':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break

    case 'منع_البوتات':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break

    case 'قبول_تلقائي':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoAceptar = isEnable
      break

    case 'رفض_تلقائي':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoRechazar = isEnable
      break

    case 'رد_تلقائي':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoresponder = isEnable
      break

    case 'منع_البوتات2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot2 = isEnable
      break

    case 'وضع_ادمن':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modoadmin = isEnable;
      break;

    case 'الردود':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.reaction = isEnable
      break
      
    case 'وضع_اباحي':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break
      
    case 'منع_الروابط2':
     if (!m.isGroup) {
       if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
       }
     } else if (!isAdmin) {
       global.dfail('admin', m, conn)
       throw false
     }
     chat.antiLink2 = isEnable
     break
      
    case 'وضع_بوت_فرعي':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.jadibotmd = isEnable
      break

    case 'كشف':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
      
    case 'منع_اخفاء':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiver = isEnable
      break
      
    case 'الاصوات':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.audios = isEnable
      break   

    case 'منع_الروابط':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

    case 'منع_الارقام_الوهمية':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antifake = isEnable
      break
  }
  
  chat[type] = isEnable;
  
  conn.reply(m.chat, `╭━〔 ✦ وظيفة النظام ✦ 〕━╮
┃ 🧩 الوظيفة: *${type}*
┃ ⚙️ الحالة: *${isEnable ? '✅ مُفعل' : '❌ مُعطل'}*
┃ 🌍 التطبيق: ${isAll ? '🌐 *لجميع البوت*' : isUser ? '👤 *لمستخدم محدد*' : '💬 *لهذه الدردشة*'}
╰━━━━━━━━━━━━━━━━━━━━━━━╯`, m, rcanal);
};

handler.help = ['الترحيب','منع_الخاص','تقييد','منع_البوتات','قبول_تلقائي','رفض_تلقائي','رد_تلقائي','منع_البوتات2','وضع_ادمن','الردود','وضع_اباحي','وضع_بوت_فرعي','كشف','منع_اخفاء','الاصوات','منع_الروابط','منع_الروابط2','منع_العرب','منع_الارقام_الوهمية']
handler.tags = ['الإعدادات'];
handler.command = ['الترحيب','منع_الخاص','تقييد','منع_البوتات','قبول_تلقائي','رفض_تلقائي','رد_تلقائي','منع_البوتات2','وضع_ادمن','الردود','وضع_اباحي','وضع_بوت_فرعي','كشف','منع_اخفاء','الاصوات','منع_الروابط','منع_الروابط2','منع_العرب','منع_الارقام_الوهمية']

export default handler