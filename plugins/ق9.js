let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊${taguser}⌉
── • ◈ • ──
*⌝🖌┊قــســم الزخارف┊🖌⌞* 
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
┤┌ ─๋︩︪─✦الزخارف☇─˚᳝᳝𖥻
> │┊ ۬.͜ـ🖌˖ ⟨زخرفه1☇ 

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه2☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه3☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه4☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه5☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه6☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه7☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه8☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه9☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه10☇

> │┊ ۬.͜ـ🖌˖ ⟨زخرفه11☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─⊰ـ  `;

  const emojiReaction = '🖌️';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/0iusrj.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق9)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;