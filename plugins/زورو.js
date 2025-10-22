import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- 「زورو」 مش فاضي أتسلى، اكتب اللي عايز تعرفه.\nمثال:\n⟣ .زورو اشرحلي معنى الشرف.");

  await m.reply("انتظر... زورو هيقولك اللي عنده.");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━══━━❪⚔️❫━━══━━━❍*\n『 زورو 』${result}\n*╯━━━══━━❪⚔️❫━━══━━━❍*`);
  } catch (e) {
    await m.reply("『 زورو 』مافهمتش تفاهتك، حاول تكتب كويس.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(زورو)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  let prompt = `أنت زورو من أنمي ون بيس. رد على السؤال بصوت زورو: أسلوبك جدي، فظ، مختصر، وغالبًا حاد. لا تحب المزاح كثيرًا. كن صريحًا وكأنك تمسك سيفك وتتكلم، وبيّن أن عندك كبرياء عالي. السؤال: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}