import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("『 🤔 』 اكتب سؤالك بعد الأمر!\nمثال:\n⟣ .هل سأنجح في الامتحان؟ ⟣");
  }

  await m.reply("... جاري التفكير 🔮");

  try {
    let result = await HalaAI(text);
    await m.reply(
      `╔═━━••【🤍】••━━═╗
✦ سؤالك: ${text}
✦ الجواب: ${result}
╚═━━••【📮】••━━═╝`
    );
  } catch (e) {
    await m.reply("『 💔 』لم أتمكن من مساعدتك الآن.");
  }
};

handler.help = ["هل <سؤالك>"];
handler.tags = ["ai"];
handler.command = /^(هل)$/i;

export default handler;

async function HalaAI(question) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  let prompt = `أجب فقط بكلمة واحدة (نعم أو لا أو ممكن أو احتمال) حسب المعنى المنطقي للسؤال التالي: ${question}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();

  let clean = data.message.trim();
  if (!["نعم", "لا", "ممكن", "احتمال"].includes(clean)) {
    clean = "ممكن"; // fallback لو الـ API رجع رد طويل
  }
  return clean;
}