let handler = async (m, { conn }) => {
  let taguser = '@' + m.sender.split("@")[0];

  let message = `
╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊${taguser}⌉
── • ◈ • ──
*⌝⛄┊قــســم المشرفين┊⌞* 
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹🧬›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
┤┌ ─๋︩︪─✦ *أوامــر المشرفين* ☇─˚᳝᳝𖥻

> │┊ 🛡️ *منشن*  

> │┊ 🛡️ *جروب*  

> │┊ 🛡️ *طرد*  

> │┊ 🛡️ *انذار*  

> │┊ 🛡️ *انذارات*  

> │┊ 🛡️ *لينك*  

> │┊ 🛡️ *اعفاء*  

> │┊ 🛡️ *ترقيه*  

> │┊ 🛡️ *المتصلين*  

> │┊ 🛡️ *تجديد*  

> │┊ 🛡️ *مخفي*  

┤└─ׅ─ׅ┈ ─๋︩︪<🧬> ──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ  
`;

  const emojiReaction ='🛡️';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/vztks8.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق2)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;