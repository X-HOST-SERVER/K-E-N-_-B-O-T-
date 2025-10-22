import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { 
      text: `
╔═━━••【🧬】••━━═╗
✦ 🚀 *أدخل وصفًا للصورة التي تريد تخيلها.*  
✦ يجب أن يكون باللغه *EN*  
مثال:  
⟣ .رسم A luxurious boy anime character
╚═━━••【📮】••━━═╝
`, 
      quoted: m 
    });
    return;
  }

  await m.react('🎨');
  await conn.sendMessage(m.chat, { 
    text: `
╔═━━••【🎨】••━━═╗
✦ *جارٍ معالجة طلبك... انتظر قليلاً 💫*  
╚═━━••【⌛】••━━═╝
` 
  });

  try {
    const response = await fetch(`https://image-generator-xvi.vercel.app/api/generate-image?text=${encodeURIComponent(text)}`);

    if (!response.ok) throw new Error(`⚠️ فشل في جلب الصورة (الكود: ${response.status})`);
    if (!response.headers.get("content-type")?.startsWith("image")) throw new Error("⚠️ الاستجابة ليست صورة!");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await m.react('✅');
    await conn.sendMessage(m.chat, { 
      image: buffer, 
      caption: `
╔═━━••【✨】••━━═╗
✦ *تم إنشاء الصورة بنجاح!* 🎨  
✦ *وصفك:* ${text}  
╚═━━••【✅】••━━═╝
` 
    });
  } catch (error) {
    console.error(error);
    await m.react('❌');
    await conn.sendMessage(m.chat, { 
      text: `
╔═━━••【⚠️】••━━═╗
✦ حدث خطأ أثناء التنفيذ:  
${error.message}
╚═━━••【❌】••━━═╝
`, 
      quoted: m 
    });
  }
};

handler.tags = ['X V I I T A C H I'];
handler.help = ['تخيل'];
handler.command = ['تخيل', 'imagine', 'رسم'];

export default handler;