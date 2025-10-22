export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0; // تجاهل رسائل البوت نفسه
  if (m.isGroup) return !1; // لا تطبق على المجموعات
  if (!m.message) return !0; // تجاهل إن لم تكن هناك رسالة

  // استثناء بعض الكلمات من الفحص
  if (
    m.text.includes('PIEDRA') ||
    m.text.includes('PAPEL') ||
    m.text.includes('TIJERA') ||
    m.text.includes('serbot') ||
    m.text.includes('jadibot')
  ) return !0;

  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};

  // استثناء قناة النشرة
  if (m.chat === '120363421205065989@newsletter') return !0;

  // إذا تم تفعيل ميزة منع الخاص من قبل المطور
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
      `╓───═⌬〔📵〕⌬═───╖
❖ 𓆩 مرحباً @${m.sender.split`@`[0]} 𓆪  
🚫 لقد قام المطور *𝐊𝐄𝐍* بتعطيل الأوامر في الخاص!

🎯 إذا كنت ترغب باستخدام أوامر *𝐊𝐄𝐍 • 𝐁𝐎𝐓*، انضم إلى القناه الرسمية من الرابط التالي:

${gp1}

───────⌬⌬⌬⌬⌬⌬⌬⌬⌬───────

💡 هل ترغب بإنشاء بوت واتساب خاص بك مثله؟
💵 *السعر: 250 جنيه مصري فقط!*
📞 تواصل مع المطور عبر:
wa.me/201021902759

╙───═⌬〔❗〕⌬═───╜`,
      false,
      { mentions: [m.sender] }
    );
    await this.updateBlockStatus(m.chat, 'block'); // حظر المستخدم
  }

  return !1; // لا تفعل شيئًا آخر
}