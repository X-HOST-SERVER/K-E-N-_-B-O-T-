// rob.js
let ro = 3000; // الحد الأقصى الممكن سرقته
const COOLDOWN = 2 * 60 * 60 * 1000; // ساعتين بالمللي ثانية

function msToTime(duration) {
  if (duration <= 0) return '0 دقائق';
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)));
  const parts = [];
  if (hours) parts.push(`${hours} ساعات`);
  if (minutes) parts.push(`${minutes} دقائق`);
  if (seconds) parts.push(`${seconds} ثانية`);
  return parts.join(' و ');
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // تأكد من وجود قاعدة البيانات
    if (!global.db || !global.db.data || !global.db.data.users) {
      return await conn.reply(m.chat, `❌ قاعدة البيانات غير مُهيّئة. تأكد من global.db.data.users`, m);
    }

    // تحديد من ستسرقه: منشن -> رد -> المحادثة الخاصة
    let who = null;
    if (m.isGroup) {
      if (Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) who = m.mentionedJid[0];
      else if (m.quoted && m.quoted.sender) who = m.quoted.sender;
    } else {
      who = m.chat;
    }

    if (!who) {
      return await conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❗ من فضلك قم بعمل منشن للمستخدم أو رد على رسالته ليتم السرقة ✦
╚═━━••【📮】••━━═╝`, m);
    }

    // منع سرقة النفس
    if (who === m.sender) {
      return await conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❗ لا يمكنك سرقة نفسك ✦
╚═━━••【📮】••━━═╝`, m);
    }

    // تهيئة سجلات المستخدمين إن لم تكن موجودة
    if (typeof global.db.data.users[m.sender] === 'undefined') global.db.data.users[m.sender] = {};
    if (typeof global.db.data.users[who] === 'undefined') global.db.data.users[who] = {};

    const robber = global.db.data.users[m.sender];
    const victim = global.db.data.users[who];

    // ضمان الحقول الرقمية
    robber.exp = Number(robber.exp) || 0;
    robber.lastrob = Number(robber.lastrob) || 0;
    victim.exp = Number(victim.exp) || 0;

    // تحقق من الكوولداون
    const now = Date.now();
    const nextAllowed = robber.lastrob + COOLDOWN;
    if (now < nextAllowed) {
      const remaining = nextAllowed - now;
      return await conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ⏱️ مهلاً — يجب الانتظار ${msToTime(remaining)} قبل أن تسرق مجدداً ✦
╚═━━••【📮】••━━═╝`, m);
    }

    // حساب مقدار السرقة العشوائي (1 .. ro)
    const robAmount = Math.floor(Math.random() * ro) + 1;

    // لو الضحية فقير جداً (أقل من مقدار السرقة) نمنع السرقة
    if (victim.exp < robAmount) {
      return await conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ 😔 @${who.split('@')[0]} لديه أقل من ${robAmount} XP — لا تسرق رجل فقير ✦
╚═━━••【📮】••━━═╝`, m, { mentions: [who] });
    }

    // إجراء التعديلات
    robber.exp += robAmount;
    victim.exp -= robAmount;
    if (victim.exp < 0) victim.exp = 0;

    robber.lastrob = now;

    // رسالة النتيجة مزخرفة مع منشن
    const resultMsg =
`╔═━━••【🧬】••━━═╗
✦ ✅ تمّت السرقة بنجاح ✦
╚═━━••【📮】••━━═╝

✦ انت سرقت: ${robAmount} XP
✦ من المستخدم: @${who.split('@')[0]}
✦ رصيدك الآن: ${robber.exp} XP`;

    await conn.reply(m.chat, resultMsg, m, { mentions: [who] });

  } catch (err) {
    console.error('rob handler error:', err);
    await conn.reply(m.chat,
`╔═━━••【🧬】••━━═╗
✦ ❌ حدث خطأ أثناء تنفيذ الأمر: ${err.message || err} ✦
╚═━━••【📮】••━━═╝`, m);
  }
};

handler.help = ['سرقه <منشن>'];
handler.tags = ['economy'];
handler.command = ['هجوم','سرقه','rob'];
handler.group = true;

export default handler;