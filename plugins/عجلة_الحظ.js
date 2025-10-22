const handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (!user) {
        return conn.sendMessage(m.chat, { text: "❌ *يجب عليك التسجيل أولاً لاستخدام هذه الميزة! استخدم الأمر `.تسجيل`.*" }, { quoted: m });
    }

    let isOwner = global.owner.some(([owner]) => owner + "@s.whatsapp.net" === m.sender);
    
    if (!user.lastSpin) user.lastSpin = 0;
    let currentTime = new Date().getTime();
    let oneDay = 24 * 60 * 60 * 1000;

    if (!isOwner && currentTime - user.lastSpin < oneDay) {
        return conn.sendMessage(m.chat, { text: "⏳ *لقد استخدمت عجلة الحظ اليوم! حاول مرة أخرى غدًا.*" }, { quoted: m });
    }

    let rewards = [
        { type: "xp", amount: 100, message: "🎉 *مبروك!* ربحت 100 XP! 🎊" },
        { type: "xp", amount: 500, message: "🔥 *حظ رائع!* ربحت 500 XP! 🚀" },
        { type: "xp", amount: -200, message: "💀 *سيء الحظ!* خسرت 200 XP! 😢" },
        { type: "health", amount: 200, message: "💖 *طاقة متجددة!* استعدت 200 صحة! 🏥" },
        { type: "health", amount: -100, message: "☠️ *انتكاسة!* خسرت 100 صحة! 🩸" },
        { type: "jackpot", amount: 1000, message: "🎰 *جاكبوت!* ربحت 1000 XP دفعة واحدة! 💰" }
    ];

    let result = rewards[Math.floor(Math.random() * rewards.length)];

    if (result.type === "xp") {
        user.exp = (user.exp || 0) + result.amount;
    } else if (result.type === "health") {
        user.health = Math.min(1000, (user.health || 1000) + result.amount);
    } else if (result.type === "jackpot") {
        user.exp = (user.exp || 0) + result.amount;
    }

    user.lastSpin = currentTime;

    await conn.sendMessage(m.chat, { text: result.message }, { quoted: m });
};

handler.help = ['عجلة_الحظ'];
handler.tags = ['xp'];
handler.command = /^(عجلة_الحظ|دوامة)$/i;

export default handler;