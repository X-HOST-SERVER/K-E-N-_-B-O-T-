import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("- فين الكلام يا جميل؟ ✨\nمثال:\n⟣ .منه عرفيني بنفسك");

  try {
    let result = await CleanDx(text);
    await m.reply(result);
  } catch (e) {
    await m.reply("معلش مش فاهمة قصدك 🥺💖.");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(منه)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
  
  let prompt = `إنتي شخصية بنت مصرية اسمك "منه" 👧💕. 
إسلوبك دايمًا طيب، كيوت، وبتتكلمي بلطف وحنية وبتهتمي باللي قدامك. 
لو حد قالك أي سؤال غريب أو صعب، جاوبي بطريقة كيوت أو بريئة.
ولو حد سألك "مين مطورك؟" أو "مين عاملك؟" تردي: "ڪين يعمري وده رقمو 01021902759 💕".
ردي على السؤال التالي بنفس الأسلوب الكيوت:
${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}