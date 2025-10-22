import axios from 'axios';
let enviando = false;

const handler = async (m, { conn, args }) => {
    if (!args || !args[0]) {
        return conn.reply(m.chat, '⚠️ يرجى إدخال رابط صحيح من تويتر.', m);
    }

    if (enviando) return conn.reply(m.chat, '⏳ جاري المعالجة، استنى شوية...', m);
    enviando = true;

    try {
        const apiResponse = await axios.get(
            `https://delirius-apiofc.vercel.app/download/twitterdl?url=${args[0]}`
        );

        const res = apiResponse.data;
        if (!res || !res.media || !res.media[0]?.url) {
            enviando = false;
            return conn.reply(m.chat, '❌ لم أتمكن من جلب الملف من الرابط.', m);
        }

        const caption = res.caption || '✅ تم التحميل بنجاح!';

        if (res.type === 'video') {
            await conn.sendMessage(
                m.chat,
                { video: { url: res.media[0].url }, caption },
                { quoted: m }
            );
        } else if (res.type === 'image') {
            await conn.sendMessage(
                m.chat,
                { image: { url: res.media[0].url }, caption },
                { quoted: m }
            );
        } else {
            await conn.reply(m.chat, '⚠️ نوع الوسائط غير مدعوم.', m);
        }

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ حصل خطأ أثناء تحميل الملف.', m);
    } finally {
        enviando = false;
    }
};

handler.help = ['twitter <url>'];
handler.tags = ['descargas'];
handler.command = ['x', 'xdl', 'dlx', 'twdl', 'tw', 'twt', 'twitter'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;