import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- 「☠️」 هل تظن أنني أقرأ العقول؟ اكتب شيئًا بعد الأمر.\nمثال:\n⟣ .لوفي أنا أحب المغامرات ⟣\n*.لوفي* اكتب طلبك بأسلوب ون بيس");

  await m.reply("... انتظر، قبعة القش تفكر.");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━══━━❪☠️❫━━══━━━❍*\n『 لوفي ⚓ 』${result}\n*╯━━━══━━❪☠️❫━━══━━━❍*`);
  } catch (e) {
    await m.reply("『 ☠️ 』حتى لوفي ما فهمك... جرّب مرة أخرى.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(لوفي)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  // لوفي بأسلوبه المرح والحماسي
  let prompt = `أنت لوفي من ون بيس. رد كما لو أنك لوفي، بشخصيتك المرحة والمندفعة والمحبّة للمغامرات. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}