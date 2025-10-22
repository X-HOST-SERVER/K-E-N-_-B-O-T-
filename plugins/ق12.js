let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = await conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊${taguser}⌉
── • ◈ • ──
*⌝🎨┊قـائـمـة لـوجـو┊🎨⌞* 
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ🌆˖ ⟨ديدبول☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_مشوه الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_على_زجاج الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨توهج_متقدم الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_طباعي الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨تكسير_بكسل الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨توهج_نيون الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨علم_نيجيريا الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨علم_أمريكا الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_ممحو الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨بلاك_بنك الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_متوهج الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نص_تحت_الماء الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨صانع_شعار الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨رسوم_كرتونية الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ورق_مقطع الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ألوان_مائية الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨سحب الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨شعار_بلاك_بنك الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨تدرج_لوني الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨شاطئ الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ذهب الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نيون_ملون الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨رمل الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨مجرة الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نمط_1917 الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نيون_مجرة الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ملكي الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨هولوغرام الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨مجرة_شعار الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨أمونج_أس الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨مطر الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨غرافيتي الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ألوان_زاهية الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ميزان_موسيقي الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨ناروتو الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨أجنحة الاسم☇
> │┊ ۬.͜ـ🌆˖ ⟨نجوم الاسم☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹𝐊𝐄𝐍 • 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`;

  const emojiReaction ='🌠';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/gj0ghz.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق12)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;