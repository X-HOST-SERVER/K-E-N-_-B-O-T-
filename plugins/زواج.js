// marry.js
// هاندلر أمر "زواج"

const handler = async (m, { conn, text }) => {
  try {
    // صور عشوائية
    const images = [
      "https://files.catbox.moe/91tdch.jpg",
      "https://files.catbox.moe/bummq6.jpg",
      "https://files.catbox.moe/m9km37.jpg",
      "https://files.catbox.moe/1t3o0y.jpg"
    ];

    // عبارات مصرية
    const phrases = [
      "يا رب تتمم على خير وميحصلش اللي احنا خايفينه 😂",
      "يا سلام يا عريس! خلّيها حياة سعيدة ومليانة فكّه 🇪🇬",
      "مبروك مقدماً — الف مبروك واوعى تنسى العفريت الصغير 🤵💍",
      "يا رب دايماً في حب وضحك وصحة — ألف مبروك مقدماً!",
      "النهاردة بداية قصة جديدة، وربنا يتمم بالخير 👰🤵"
    ];

    // اختيار عشوائي
    const pickedImage = images[Math.floor(Math.random() * images.length)];
    const pickedPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // تحديد العروسة (من المنشن أو النص)
    let brideJid = null;
    if (m.mentionedJid && m.mentionedJid.length) {
      brideJid = m.mentionedJid[0];
    } else if (text && text.trim()) {
      let candidate = text.trim().split(/\s+/)[0];
      candidate = candidate.replace(/^\+/, "").replace(/\D/g, "");
      if (candidate.length >= 8) {
        brideJid = candidate + "@s.whatsapp.net";
      }
    }

    if (!brideJid) {
      return conn.sendMessage(m.chat, {
        text:" 💍💗اكتب الأمر مع منشن العروسه .\nمثال:\nزواج @user\nأو\nزواج 20123XXXXXXXX",
      }, { quoted: m });
    }

    // العريس هو اللي كتب الأمر
    const groom = "@" + m.sender.split("@")[0];
    const bride = "@" + brideJid.split("@")[0];

    // الرسالة
    const caption =
` 💗💍 *زواج رسمي* 💍💗

*المأذون ڪين👳🏻‍♂️📋*

*بارك الله لكما وجمعكما في حفره واحده*👳🏻‍♂️✨

*العريس🤵🏻‍♂️*:*${groom}*
*العروسة👰🏻‍♀️*:*${bride}*

*♡_♡احلى فرحه النهارده اشوف ضرب نار بق 🐧💗:* 
*${pickedPhrase}*

*اوعى تنسى الفرح يلا وربنا اعورك🐧😂*`;

    // الإرسال
    await conn.sendMessage(m.chat, {
      image: { url: pickedImage },
      caption,
      mentions: [m.sender, brideJid]
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: "حصل خطأ أثناء تنفيذ الأمر." }, { quoted: m });
  }
};

handler.command = /^(زواج|marry)$/i;
handler.group = true;
export default handler;