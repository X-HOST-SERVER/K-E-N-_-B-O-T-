import axios from "axios";

const الحد_الأقصى_MB = 10;

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text || !text.includes('tiktok')) {
    return conn.reply(m.chat, '❤️ ╰─⊱ *أدخل رابط TikTok صحيح* ⊱─╮', m);
  }

  try {
    await m.react('⏳');

    const رابط_الفيديو = await احصل_فيديو_TikTok_HD(text);

    if (!رابط_الفيديو) throw new Error('تعذر الحصول على الفيديو.');

    const head = await axios.head(رابط_الفيديو);
    const الحجم_الفعلي = head.headers['content-length'];
    const الحجم_MB = parseInt(الحجم_الفعلي) / (1024 * 1024);

    if (الحجم_MB > الحد_الأقصى_MB) {
      return conn.reply(
        m.chat,
        `❌ حجم الفيديو *${الحجم_MB.toFixed(2)} MB* وتجاوز الحد المسموح (${الحد_الأقصى_MB} MB).`,
        m
      );
    }

    await conn.sendMessage(m.chat, {
      video: { url: رابط_الفيديو },
      caption: `
╔═━━••【🧬】••━━═╗
✦ [ TikTok بدون علامة مائية - HD ] ✅ ✦
╚═━━••【📮】••━━═╝`
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '⚠️ *حدث خطأ أثناء معالجة الفيديو 😢*', m);
  }
};

handler.help = ['تيك <رابط>'];
handler.tags = ['التحميلات'];
handler.command = ['تيك', 'tiktok', 'th'];

export default handler;

// ─────────────────────────────────────

async function احصل_فيديو_TikTok_HD(url) {
  try {
    const { data } = await axios.get(`https://www.tikwm.com/api/`, {
      params: { url },
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const النتيجة = data?.data;
    if (!النتيجة) return null;

    return النتيجة.hdplay || النتيجة.play_2 || النتيجة.play;
  } catch (e) {
    console.error('خطأ في احصل_فيديو_TikTok_HD:', e);
    return null;
  }
}