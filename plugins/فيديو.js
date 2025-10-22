import yts from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🔍 اكتب اسم الفيديو أولاً.");

  await m.react("⏳");

  try {
    let search = await yts(text);
    let video = search.videos[0];

    if (!video) return m.reply("❌ لم يتم العثور على فيديو.");

    let url = `https://api.lolhuman.xyz/api/ytvideo?apikey=YOUR_API_KEY&url=${video.url}`;
    let res = await fetch(url);
    let json = await res.json();

    if (!json.status || !json.result?.link) {
      console.log(json);
      return m.reply("⚠️ فشل في جلب الرابط. تأكد من الـ API.");
    }

    let downloadUrl = json.result.link;
    if (typeof downloadUrl !== 'string') {
      return m.reply("🚫 رابط التنزيل غير صحيح.");
    }

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      caption: `🎬 *${video.title}*\n\n📥 *جودة:* ${json.result.quality}`,
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply("❌ حدث خطأ أثناء التحميل.");
  }
};

handler.command = ["فيديو", "يوت"];
handler.tags = ["downloader"];
handler.help = ["فيديو <اسم>"];

export default handler;