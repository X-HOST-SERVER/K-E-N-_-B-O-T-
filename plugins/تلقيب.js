import { createHash } from 'crypto';

const mentionRegex = /(?:@([^\s]+))\s*(.*)/i;

const handler = async function(m, { conn, text, usedPrefix, command }) {
  try {
    let mentionedJid;
    let name;
    const groupId = m.chat;

    // التحقق من الرد على رسالة
    if (m.quoted && m.quoted.sender) {
      mentionedJid = m.quoted.sender;
      name = text ? text.trim() : null;
    } 
    // التحقق من وجود منشن في النص
    else if (text && mentionRegex.test(text)) {
      const match = text.match(mentionRegex);
      mentionedJid = match[1] + '@s.whatsapp.net';
      name = match[2].trim();
    } 
    // إذا لم يكن هناك منشن أو رد
    else {
      throw `֎╎الاستخـدام الصحيـح.☁️\n\n${usedPrefix + command} @منشـن العضـو لقـب أو الرد على رسالة العضو مع كتابة لقب.`;
    }

    if (!mentionedJid) throw '֎╎يجـب توجيـه منشـن للعضـو الـذي تـريد تسجيلـه أو الرد على رسالته.';
    if (!name) throw '֎╎أدخـل لقـب بشكـل صحيح.';

    // جلب بيانات المستخدم من قاعدة البيانات أو إنشاء جديدة
    let user = global.db.data.users[mentionedJid] || {};
    if (!user.groups) user.groups = {};

    // التحقق من أن العضو لم يُسجَّل بالفعل في هذه المجموعة
    if (user.groups[groupId] && user.groups[groupId].name) {
      throw '֎╎هـاذا العضـو مسجـل بالفعل.';
    }

    // التحقق من عدم تكرار اللقب في نفس المجموعة
    for (let key in global.db.data.users) {
      const u = global.db.data.users[key];
      if (u.groups && u.groups[groupId] && u.groups[groupId].name &&
          u.groups[groupId].name.toLowerCase() === name.toLowerCase()) {
        throw '֎╎هـاذا لقـب تم استخدامه بالفعل في هـذه المجموعة.';
      }
    }

    // تسجيل اللقب في قاعدة البيانات
    user.groups[groupId] = { name, regTime: Date.now(), registered: true };
    global.db.data.users[mentionedJid] = user;

    // إنشاء رقم تسلسلي فريد (اختياري)
    const sn = createHash('md5').update(mentionedJid + Date.now()).digest('hex');

    const caption = `֎╎تـم تسجيـل لقـب العضو : \`${name}\``;
    await conn.reply(m.chat, caption, m);
    
  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

// إعدادات الهاندلر
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.command = /^(تلقيب|register)$/i;

export default handler;