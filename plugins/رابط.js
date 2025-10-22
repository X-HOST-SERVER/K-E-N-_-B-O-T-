import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) return m.reply("╔═━━••【📮】••━━═╗\n✦ رد على صورة أو فيديو أو حتى أغنية لتحويلها لرابط ✦\n╚═━━••【🧬】••━━═╝");

  let media = await q.download();
  let link = await catbox(media);

  let caption = `
╔═━━••【📮】••━━═╗
> ✦ 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦
╚═━━••【🧬】••━━═╝

╔═━━••【📮】••━━═╗
> *✦ 🔗 لينك الملف*
*✦ ${link}*
> *✦ 📊 الحجم : ${formatBytes(media.length)}*
> *✦ ⏳ انتهاء الصلاحية : لا ينتهي*
╚═━━••【🧬】••━━═╝

*✦ استمتع بمشاركة الملفات عبر البوت ✦*
`;

  await m.reply(caption);
};

handler.command = handler.help = ["رابط"];
handler.tags = ["رابط"];
handler.diamond = true;
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}