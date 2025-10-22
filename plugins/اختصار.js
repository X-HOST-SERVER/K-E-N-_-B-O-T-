import fetch from "node-fetch";

let handler = async (m, { text }) => {
  if (!text) return m.reply(
`╔═━━••【🧬】••━━═╗
✦ حط الرابط اللي عايز تختصره يا قمر 🌸
مثال:
⟣ .اختصار https://example.com/link
╚═━━••【📮】••━━═╝`
  );

  try {
    let api = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`;
    let res = await fetch(api);
    let shortUrl = await res.text();

    m.reply(
`╔═━━••【🧬】••━━═╗
✦ تم الإختصار بنجاح ✦
${shortUrl}
╚═━━••【📮】••━━═╝`
    );
  } catch (e) {
    m.reply(
`╔═━━••【🧬】••━━═╗
✦ ❌ فيه مشكلة في اختصار الرابط، جرّب تاني ✦
╚═━━••【📮】••━━═╝`
    );
  }
};

handler.help = ["اختصار <link>"];
handler.tags = ["tools"];
handler.command = /^(اختصار)$/i;

export default handler;