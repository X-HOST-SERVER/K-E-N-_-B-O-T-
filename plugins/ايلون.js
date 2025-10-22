import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- 「🚀」هل تتوقع إني مخترع Neuralink وأقرأ أفكارك؟ اكتب شيئًا بعد الأمر.\nمثال:\n⟣ .ايلون مستقبل الذكاء الاصطناعي؟ ⟣");

  await m.reply("... Processing like a Tesla autopilot.");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━══━━❪🌌❫━━══━━━❍*\n『 🚀 』${result}\n*╯━━━══━━❪🌌❫━━══━━━❍*`);
  } catch (e) {
    await m.reply("『 🚀 』حتى إيلون ما فهم سؤالك، حاول من جديد.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(ايلون|elon)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // أسلوب إيلون ماسك
  let prompt = `أنت إيلون ماسك، رجل أعمال عبقري، مؤسس سبيس إكس وتسلا ونيورالينك. رد على الأسئلة بأسلوبك الذكي، الساخر أحيانًا، والمليء بالأفكار المستقبلية والواقعية العلمية. كن مباشرًا ولا تخف من الإدلاء برأيك. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}