const handler = async (m, { conn, args }) => {
    if (args.length < 2) throw `❌ *يرجى تحديد اللغة ثم النص.*\n\n📌 *مثال:* \n> .تنفيذ_الترجمة en مرحبا`;

    const lang = args[0].toLowerCase();
    const text = args.slice(1).join(' ');

    const url = `https://api.popcat.xyz/translate?to=${lang}&text=${encodeURIComponent(text)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.translated) throw "❌ *فشل في الترجمة!* تأكد من إدخال لغة مدعومة.";

        await conn.sendMessage(m.chat, { text: `🌍 *الترجمة (${lang}):*\n\n📖 ${data.translated}` }, { quoted: m });
    } catch (error) {
        throw `❌ *حدث خطأ أثناء الترجمة!*\n\n> التفاصيل: ${error.message}`;
    }
};

handler.command = /^تنفيذ_الترجمة$/i;
export default handler;