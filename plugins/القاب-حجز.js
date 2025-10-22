import { createHash } from 'crypto';

const handler = async function(m, { conn, text, usedPrefix, command }) {
  const groupId = m.chat;
  let users = global.db.data.users;

  // تأكد من وجود بيانات المستخدم
  if (!users[m.sender]) users[m.sender] = {};
  if (!users[m.sender].groups) users[m.sender].groups = {};

  const user = users[m.sender];

  try {
    if (command === 'حجز_لقب') {
      if (!text) throw `֎╎اكتب اللقب الذي تريد حجزه مثل:\n\n${usedPrefix + command} اللقب`;

      // التأكد مما إذا كان لديه لقب محجوز مسبقًا
      if (user.groups[groupId]?.name) {
        throw `֎╎ لديك لقب محجوز بالفعل: *${user.groups[groupId].name}*.\nإذا كنت تريد تغييره، استخدم: *${usedPrefix}الغاء_حجز* أولًا.`;
      }

      // التأكد مما إذا كان اللقب محجوزًا بالفعل من شخص آخر
      for (let key in users) {
        if (users[key].groups?.[groupId]?.name?.toLowerCase() === text.toLowerCase()) {
          throw `֎╎ هذا اللقب محجوز بالفعل من قبل شخص آخر.`;
        }
      }

      // تسجيل اللقب للمستخدم
      user.groups[groupId] = { name: text, regTime: Date.now(), registered: true };
      users[m.sender] = user;

      await conn.reply(m.chat, `֎╎ تم حجز اللقب: *${text}*`, m);

    } else if (command === 'الالقاب_المحجوزه') {
      let reservedNames = [];

      for (let key in users) {
        const u = users[key];
        if (u.groups?.[groupId]?.name) {
          reservedNames.push(`- *${u.groups[groupId].name}* (@${key.split('@')[0]}) • محجوز منذ ${formatDate(u.groups[groupId].regTime)}`);
        }
      }

      if (reservedNames.length === 0) {
        throw '֎╎ لا توجد ألقاب محجوزة في هذه المجموعة.';
      }

      await conn.reply(m.chat, `֎╎ الألقاب المحجوزة في هذه المجموعة:\n\n${reservedNames.join('\n')}`, m);

    } else if (command === 'الغاء_حجز') {
      // التأكد مما إذا كان لديه لقب محجوز
      if (!user.groups?.[groupId]?.name) {
        throw `֎╎ ليس لديك أي لقب محجوز لإلغائه.`;
      }

      const oldName = user.groups[groupId].name;
      delete user.groups[groupId];
      users[m.sender] = user;

      await conn.reply(m.chat, `֎╎ تم إلغاء حجز اللقب: *${oldName}*`, m);
    }

  } catch (err) {
    await conn.reply(m.chat, `❌ خطأ: ${err}`, m);
  }
};

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString('ar-EG')} - ${date.toLocaleTimeString('ar-EG')}`;
}

handler.group = true;
handler.botAdmin = true;
handler.command = /^(حجز_لقب|الالقاب_المحجوزه|الغاء_حجز)$/i;

export default handler;