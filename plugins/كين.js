import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(
      "- 「🩸」 لا أستطيع قراءة أفكارك... اكتب شيئًا بعد الأمر.\n\nمثال:\n⟣ .كين ما معنى الألم؟ ⟣\n*.كين* اكتب سؤالك"
    );
  }

  await m.reply("... 🕯️ صوت داخلي يجيبك، انتظر لحظة.");

  try {
    let result = await KanekiAI(text);
    await m.reply(
      `╔═━━••【🩸】••━━═╗\n✦ ${result}\n╚═━━••【📮】••━━═╝`
    );
  } catch (e) {
    await m.reply("『 🩸 』... حتى أنا لا أستطيع الإجابة الآن.");
  }
};

handler.help = ["كين"];
handler.tags = ["ai"];
handler.command = /^(كين)$/i;

export default handler;

async function KanekiAI(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // توجيه الـ API للرد بأسلوب كين المطور_كين
  let prompt = `أنت كين المطور_كين من أنمي طوكيو غول. 
تحدث بأسلوبك المعتاد: غامض، فلسفي، يحمل مزيجًا من الألم والقوة. 
استخدم كلمات عميقة أحيانًا ومليئة بالمشاعر، ولا تخرج عن شخصيتك أبدًا.
سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}