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
*⌝🎊┊قــســم التسليه┊🎊⌞* 
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
┤┌ ─๋︩︪─✦للتسليه☇─˚᳝᳝𖥻
> │┊ ۬.͜ـ🎊˖ ⟨صفع☇ 

> │┊ ۬.͜ـ🎊˖ ⟨هل☇

> │┊ ۬.͜ـ🎊˖ ⟨زنجي☇

> │┊ ۬.͜ـ🎊˖ ⟨جميل☇

> │┊ ۬.͜ـ🎊˖ ⟨كومنت☇

> │┊ ۬.͜ـ🎊˖ ⟨تويته☇

> │┊ ۬.͜ـ🎊˖ ⟨شخصيه☇> 

> │┊ ۬.͜ـ🎊˖ ⟨حقيقه☇

> │┊ ۬.͜ـ🎊˖ ⟨انا☇

> │┊ ۬.͜ـ🎊˖ ⟨حكمه☇

> │┊ ۬.͜ـ🎊˖ ⟨بوست☇

> │┊ ۬.͜ـ🎊˖ ⟨ميمز☇

> │┊ ۬.͜ـ🎊˖ ⟨غزل☇

> │┊ ۬.͜ـ🎊˖ ⟨صراحه☇

> │┊ ۬.͜ـ🎊˖ ⟨رابطي☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ  `;

  const emojiReaction = '🎊';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/z1pjju.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق7)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;