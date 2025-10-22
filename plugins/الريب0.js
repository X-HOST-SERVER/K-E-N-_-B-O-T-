let handler = m => m;

handler.all = async function (m) {
    let responses;

    if (/^تست$/i.test(m.text)) {
        responses = ['>  *مــوجود وربـنــا🥂*'];
    } else if (/^بوت$/i.test(m.text)) {
        responses = ['> *اسـمـي كيـــــن وُربّـــــــنا 🧬*']; 
    } else if (/^كين$/i.test(m.text)) {
        responses = ['> *مـعـاك ي قـلـبـي 🧬*'];
    }

    if (responses) {
        let randomIndex = Math.floor(Math.random() * responses.length);
        conn.reply(m.chat, responses[randomIndex], m);
    }

    return !0;
};

export default handler;