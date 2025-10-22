function clockString(ms) {
    if (isNaN(ms)) return '00:00';
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    return [h, m, s]
        .map((v, i) => v > 0 || i > 0 ? v.toString().padStart(2, '0') : null)
        .filter(v => v !== null)
        .join(':');
}

function getUserRank(level = 0) {
    const ranks = [
        { min: 81, rank: 'مشير 👑' },
        { min: 71, rank: 'فريق أول 🐺' },
        { min: 61, rank: 'لواء 🦅' },
        { min: 51, rank: 'عميد 🪖' },
        { min: 41, rank: 'عقيد ⚔️' },
        { min: 31, rank: 'رائد 🛰' },
        { min: 21, rank: 'نقيب 🪶' },
        { min: 16, rank: 'ملازم 🧑‍✈️' },
        { min: 11, rank: 'رقيب 🛡' },
        { min: 6,  rank: 'عريف 🎖' },
        { min: 3,  rank: 'جندي 🪖' },
        { min: 0,  rank: 'مواطن 🧍‍♂️' }
    ];
    return ranks.find(r => level >= r.min)?.rank || 'مواطن 🧍‍♂️';
}

import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn }) => {
    try {
        let uptime = clockString(process.uptime() * 1000);

        // بيانات المستخدم
        let user = (global.db?.data?.users?.[m.sender]) || {};
        let name;
        try { name = await conn.getName(m.sender); } 
        catch { name = "مستخدم مجهول"; }

        let level = user.level || 0;
        let role = getUserRank(level);

        // بيانات عامة
        let totalUsers = Object.keys(global.db?.data?.users || {}).length;
        let now = new Date();
        let week = now.toLocaleDateString('ar-TN', { weekday: 'long' });
        let time = now.toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

        await conn.sendMessage(m.chat, { react: { text: '📕', key: m.key } });

        // صورة البوت
        const Elsony = 'https://files.catbox.moe/qkzizs.jpg';
        const media = await prepareWAMessageMedia({ image: { url: Elsony } }, { upload: conn.waUploadToServer });

        // القوائم
        const sections = [
            { emoji: '🎮', title: 'قـسـم الألعـاب', id: '.ق1' },
            { emoji: '🛡', title: 'قـسـم المشرفين', id: '.ق2' },
            { emoji: '🛠', title: 'قـسـم الأدوات', id: '.ق3' },
            { emoji: '⬇️', title: 'قـسـم التحميل', id: '.ق4' },
            { emoji: '🏦', title: 'قـسـم البنـك', id: '.ق5' },
            { emoji: '🤖', title: 'قـسـم الذكاء الاصطناعي', id: '.ق6' },
            { emoji: '🎭', title: 'قـسـم التسلية', id: '.ق7' },
            { emoji: '🕋', title: 'قـسـم الدين', id: '.ق8' },
            { emoji: '🖌️', title: 'قـسـم الزخارف', id: '.ق9' },
            { emoji: '⚔️', title: 'قـسـم النقابات', id: '.ق10' },
            { emoji: '🖼️', title: 'قـسـم الصور', id: '.ق11' },
            { emoji: '😎', title: 'قـسـم الوجوهات', id: '.ق12' },
            { emoji: '📜', title: 'القوانين', id: '.القواعد' }
        ].map(s => ({
            title: `❪┊${s.emoji} ${s.title} ┊❫ • 𝐊𝐄𝐍 • 𝐁𝐎𝐓`,
            rows: [{ header: s.emoji, title: `「${s.title}」`, id: s.id }]
        }));

        // الرسالة التفاعلية
        let message = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: { hasMediaAttachment: true, ...media },
                        body: {
                            text: `
━ ╼╃ ⌬〔﷽〕⌬ ╄╾ ━
> 〔  الأوامــر┊ ˼‏ 🧬˹ ↶〕
            *𝐊𝐄𝐍 بــ🤖ــوت*
*⋅ ───━ •﹝📌﹞• ━─── ⋅*
╗───¤﹝معلومات المستخدم ↶ 🧰﹞
> •🪪┊الاسم: *${name}*
> •🆙┊مستواك: *${level}*
> •🧰┊الرتبة: *${role}*
╗───¤﹝معلومات البوت ↶ 🤖﹞
> •🎴┊اسم البوت: *𝐊𝐄𝐍 • 𝐁𝐎𝐓*
> •🔢┊عدد المستخدمين: *${totalUsers}*
> •👨🏻‍💻┊المطور: *𝐊𝐄𝐍*
> •🀄┊الرقم: wa.me/201021902759
╗───¤﹝معلومات عامه ↶ 📮﹞
> •🌥️┊اليوم: *${week}*
> •📆┊التاريخ: *${time}*
> •⏱️┊مدة التشغيل: *${uptime}*

*⋅ ───━ •﹝📌﹞• ━─── ⋅*
⌠𝐊𝐄𝐍 • • •⌡
                            `,
                            subtitle: "𝐊𝐄𝐍 • 𝐁𝐎𝐓"
                        },
                        contextInfo: { mentionedJid: [m.sender], isForwarded: false },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({ 
                                        title: '⌈┊قـسـم الأوامـر┊⌋', 
                                        sections 
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: '{"display_text":"⌈┊قنـاة المـطـور┊⌋","url":"https://whatsapp.com/channel/0029VbB5lRa77qVL1zoGaH2A"}'
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: '{"display_text":"⌈┊الـمـطـور┊⌋","id":".المطور"}'
                                }
                            ]
                        }
                    }
                }
            }
        };

        await conn.relayMessage(m.chat, message, {});
    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' }, { quoted: m });
    }
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['menu', 'مهام', 'اوامر', 'الاوامر', 'قائمة', 'القائمة'];

export default handler;