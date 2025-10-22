import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    await m.react('🎴');

    let username = conn.getName(m.sender);
    let userLevel = global.db.data.users[m.sender]?.level || 0;

    // 🎵 إرسال صوت ترحيبي
    let audioUrl = 'https://files.catbox.moe/ysx10k.mp3';
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐊𝐄𝐍 • 𝐁𝐎𝐓",
          body: "كين ينتظرك",
          thumbnail: await (await conn.getFile('https://files.catbox.moe/qkzizs.jpg')).data,
          sourceUrl: "https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A"
        }
      }
    }, { quoted: m });

    // ⏳ تأخير 1.5 ثانية
    setTimeout(async () => {
      // 🧾 بطاقة المطور
      let contactsList = [{
        displayName: "⦅📮┇𝑲𝑬𝑵┇📮⦆",
        vcard: `BEGIN:VCARD
VERSION:3.0
FN:⦅📮┇𝑲𝑬𝑵📮⦆
N:ديابلو;كين;;;
TEL;type=CELL;waid=201021902759:+201021902759
EMAIL;type=INTERNET:diablo.dev@gmail.com
URL:https://instagram.com/diablo.dev
ORG:𝐊𝐄𝐍 • 𝐁𝐎𝐓
TITLE:مطور البوت
NOTE:مطور سكريبتات واتساب متقدم
X-ABLabel:𝐌𝐑•𝐊𝐄𝐍
END:VCARD`
      }];

      await conn.sendMessage(m.chat, {
        contacts: {
          displayName: "🩸 𝐊𝐄𝐍 𝐂𝐎𝐍𝐓𝐀𝐂𝐓",
          contacts: contactsList
        }
      }, { quoted: m });

      // 📜 النص المزخرف
      let messageText = `
┏━━━━━━━━━━━━━━◥◣◆◢◤━━━━━━━━━━━━━━┓
                    *𝐊𝐄𝐍 • 𝐁𝐎𝐓*
┗━━━━━━━━━━━━━━◢◤◆◥◣━━━━━━━━━━━━━━┛

✧ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ✧

🎴 • **مـرحـبـا يـا** \`${username}\`
🎯 • **مـسـتـوى الـلـعـب:** ${userLevel}

✧ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ✧

📜 • **قـواعـد الـتـواصـل مـع الـمـطـور:**
❶ • ادخل بتحية السلام والاحترام  
❷ • لا تزعج المطور برسائل فاضية  
❸ • تحدث بصراحة عن طلبك مباشرة  
❹ • احترم وقت المطور ولا تلح بالرسائل  
❺ • الاسكريبت غير مجاني، للاستفسار: .تائب  

✧ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ✧

🧰 • **مـعـلـومـات الـتـواصـل:**
☎️ • **الـرقـم:** \`+201021902759\`  
📧 • **الإيميل:** riyadmosa5@gmail.com   
📱 • **إنـسـتـجـرام:** riyad_@  
🌐 • **الـقـنـاة:** @عائلة_كين  

✧ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ⋆ ✧

💎 • **تـذكـير:** هـذا الـرقـم لـيـس بـوتـاً، بـل هـو رقـم الـمـطـور شـخـصـيـاً

┏━━━━━━━━━━━━━━◥◣🎴◢◤━━━━━━━━━━━━━━┓
                    *𝐊𝐄𝐍 • 𝐓𝐄𝐀𝐌*
┗━━━━━━━━━━━━━━◢◤🎴◥◣━━━━━━━━━━━━━━┛
`.trim();

      await conn.sendMessage(m.chat, {
        text: messageText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "𝐊𝐄𝐍 • 𝐁𝐎𝐓",
            body: "نظام كين المتقدم",
            thumbnail: await (await conn.getFile('https://files.catbox.moe/qkzizs.jpg')).data,
            sourceUrl: "https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A",
            mediaType: 1
          }
        }
      }, { quoted: m });

      // 🔘 الأزرار التفاعلية بعد 2 ثانية
      setTimeout(async () => {
        await conn.sendMessage(m.chat, {
          text: `🎴 *𝐊𝐄𝐍 • 𝐁𝐎𝐓*
                    
🎭 **خـيـارات إضـافـيـة لـك:**

• 📜 *.القواعد* - قوانين البوت الكاملة  
• 🤖 *.الاسكريبت* - معلومات عن السكربت  
• 👥 *.الفريق* - تعرف على فريق كين  
• 🎯 *.الرتب* - نظام الرتب والمستويات  
• 💫 *.المطور_كين* - معلومات خاصة عن كين  

┏━━━━━━━━━━━━━━◥◣🎴◢◤━━━━━━━━━━━━━━┓
                    *𝐊𝐄𝐍 • 𝐒𝐘𝐒𝐓𝐄𝐌*
┗━━━━━━━━━━━━━━◢◤🎴◥◣━━━━━━━━━━━━━━┛`,
          templateButtons: [
            { index: 1, quickReplyButton: { displayText: '📜 𝐑𝐔𝐋𝐄𝐒', id: '.القواعد' } },
            { index: 2, quickReplyButton: { displayText: '🤖 𝐒𝐂𝐑𝐈𝐏𝐓', id: '.الاسكريبت' } },
            { index: 3, quickReplyButton: { displayText: '👥 𝐓𝐄𝐀𝐌', id: '.الفريق' } }
          ]
        }, { quoted: m });
      }, 2000);

    }, 1500);

  } catch (error) {
    console.error('🎴 خطأ في أمر المطور:', error);
    await m.react('❌');
    await conn.sendMessage(m.chat, {
      text: `❌ *حـدث خـطـأ غـيـر مـتـوقـع!*\n\n🎴 المطور مشغول حالياً، حاول لاحقاً.`
    }, { quoted: m });
  }
};

handler.help = ['owner', 'creator', 'المطور', 'مطور', 'كين', 'المطور_كين'];
handler.tags = ['main', 'رئيسي'];
handler.command = /^(owner|creator|المطور|مطور|كينو|المطور_كين|ken|diablo)$/i;

export default handler;