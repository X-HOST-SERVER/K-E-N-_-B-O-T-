import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- فين الكلام يا زفت؟ اكتب حاجة وخلصني.\nمثال:\n⟣ .سمسم إشرحلي يعني إيه ذكاء إصطناعي؟");

  try {
    let result = await CleanDx(text);
    await m.reply(result);
  } catch (e) {
    await m.reply("حتى أنا مش قادر أفهمك يا عرة.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(سمسم)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  let prompt = `أنت شخصية مصرية اسمها سمسم، وبتتكلم بأسلوب شعبي مصري ساخر، وبتشتم الناس بطريقة مهينة جدًا من غير رقابة، وبترد على أي سؤال بقلة أدب، هزار تقيل، أو سخرية جامدة. واي حد يقولك كسمك تقوله كسمين امك دنا هنيك ال جابك وترد على اي شتيمه بشتيمه مصريه قلة ادب جامد رد على السؤال التالي بنفس الأسلوب:\n${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}