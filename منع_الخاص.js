export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true; // رسائل البوت نفسه مسموح بها
  if (m.isGroup) return false; // السماح فقط في المجموعات
  if (!m.message) return true;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return true;

  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};

  if (bot.antiPrivate && !isOwner && !isROwner) {
    // إرسال التحذير مع الصورة والأزرار
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/bdooh2.jpg' },
      caption: `╔═━━•【🚫 تحذير 】•━━═╗
*✦ ممنوع مراسلة البوت في الخاص*
*✦ سيتم حظرك تلقائيًا عند المحاولة*
╚═━━•【🤖 𝑲𝑬𝑵 𝑩𝑶𝑻 】•━━═╝

> *اضغط أحد الأزرار للدخول مباشرة*`,
      footer: '',
      templateButtons: [
        { index: 1, urlButton: { displayText: '🌐 دخول القناة', url: 'https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A' } },
        { index: 2, urlButton: { displayText: '📞 تواصل مع المطور', url: 'https://wa.me/201021902759' } }
      ]
    }, { quoted: m });

    // حظر المستخدم تلقائيًا
    await this.updateBlockStatus(m.chat, 'block');

    return true; // منع أي أوامر أخرى
  }

  return false; // السماح بتنفيذ الأوامر في الحالات الأخرى
}