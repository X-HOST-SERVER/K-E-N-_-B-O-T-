let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender) || 'مستخدم';
  let taguser = '@' + m.sender.split("@")[0];

  let currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null;
  let groupName = groupMetadata ? groupMetadata.subject : 'غير معروف';
  let groupMembers = groupMetadata ? groupMetadata.participants.length : 'غير معروف';

  let message = `
*┃ 🍥┊❝ مـــرحبــــاً بـــكـ/ﻲ يـا ❪${taguser}❫ في قسم التحميل┊🍥┃*  
   *┃ 🍭┊❝ 𝑀𝐼𝐾𝑈 𝔹𝕆𝕋 ❞┊🍭┃*  
*┃ 🍡┊❝ قسم الصور ❞┊🍡┃*  
*┃ 🧬┊❝ القسـم يـقدم لك أوامر تخص الصور ❞┊🧬┃*
*╰───⊰ 🍡❀⊱───╮*  
*✦ ━━━━━ ❀🍷❀ ━━━━━ ✦*  
🍡 *القسم يقدم لك اوامر  صور بي جميع انوعها!* 🍡  
*✦ ━━━━━ ❀🍷❀ ━━━━━ ✦*  
*╭──⊰ 📮 قائمة صور 📮 ⊱──╮*  
🍡 ⩺ ⌟كـورومـي⌜ 
🍡 ⩺ ⌟كـيـوت⌜   
🍡 ⩺ ⌟مـيـكـاسـا⌜  
🍡 ⩺ ⌟كـابـلـز⌜  
🍡 ⩺ ⌟هـيـنـاتـا⌜  
🍡 ⩺ ⌟بـيـن⌜  
🍡 ⩺ ⌟صــوره⌜    
🍡 ⩺ ⌟خـلـفـيـات⌜ 
🍡 ⩺ ⌟كـانـيـكـي⌜    
🍡 ⩺ ⌟صـوره⌜    
🍡 ⩺ ⌟تـصـفـح⌜    
*╰──⊰ 📮 ⊱──╯*
*╭━─━─━─❀🍷❀─━─━─━╮*  
*┃ 📮┊ البوت: 𝑀𝐼𝐾𝑈 𝔹𝕆𝕋 ┊📮┃*  
*┃ 🍭┊ توقيع: 𝑅𝐴𝐷𝐼𝑂 𝐷𝐸𝑀𝑂𝑁 ┊🍭┃*  
*╰━─━─━─❀🍷❀─━─━─━╯*`;

  const emojiReaction = '⬇️';

  try {
    await conn.sendMessage(m.chat, { react: { text: emojiReaction, key: m.key } });4

    await conn.sendMessage(m.chat, { 
      image: { url: 'https://files.catbox.moe/z6cva4.jpg' },
      caption: message,
      mentions: [m.sender]
    });
  } catch (error) {
    console.error("Error sending message:", error);
    await conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء إرسال الصورة.' });
  }
};

handler.command = /^(ق13)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;