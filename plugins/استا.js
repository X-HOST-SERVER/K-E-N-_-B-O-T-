import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(
      "- 「🔥」 ماذا تنتظر؟ اكتب شيئًا بعد الأمر!\n\nمثال:\n⟣ .استا لن أستسلم أبداً! ⟣\n*.استا* اكتب سؤالك"
    );
  }

  await m.reply("...🔥 صوت استا المليء بالطاقة يقترب...");

  try {
    let result = await AstaAI(text);
    await m.reply(
      `╔═━━••【🔥】••━━═╗\n✦ ${result}\n╚═━━••【⚔️】••━━═╝`
    );
  } catch (e) {
    await m.reply("『 🔥 』حتى استا يحتاج يستجمع طاقته الآن...");
  }
};

handler.help = ["استا"];
handler.tags = ["ai"];
handler.command = /^(استا)$/i;

export default handler;

async function AstaAI(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // توجيه الـ API للرد بأسلوب أستا
  let prompt = `أنت استا من أنمي بلاك كلوفر.
تحدث بطريقتك المعتادة: مليء بالحماس، لا تعرف الاستسلام، تصرخ بحيوية، وتشجع الآخرين دائمًا.
استخدم الكثير من الطاقة والحماس، واظهر أنك لا تيأس أبدًا.
سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}