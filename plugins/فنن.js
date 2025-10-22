import axios from "axios";
import uploadImage from "../lib/uploadImage.js";
import path from "path";

const KEYYY = "XbS7PoQmAv0TKrnL52tTnsRYJdO1v0rNcBPEey4D15FF2vfvMrIrB8LPagog";
const UUID = `gienetic_${Math.random().toString(36).substring(2, 10)}`;

const headers = {
  "user-agent": "Dart/3.8 (dart:io)",
  "content-type": "application/json; charset=utf-8",
  accept: "application/json",
  "accept-encoding": "gzip",
};

async function translateToEnglish(text) {
  try {
    const url = "https://translate.googleapis.com/translate_a/single";
    const params = { client: "gtx", sl: "auto", tl: "en", dt: "t", q: text };
    const response = await axios.get(url, { params, headers });
    return response.data?.[0]?.[0]?.[0] || text;
  } catch {
    return text;
  }
}

function detectMimeFromBuffer(buf) {
  if (!buf || buf.length < 12) return "application/octet-stream";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (buf.slice(0, 4).toString() === "GIF8") return "image/gif";
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return "image/webp";
  if (buf.slice(4, 8).toString() === "ftyp" || buf.slice(0, 12).includes(Buffer.from("ftyp"))) return "video/mp4";
  return "application/octet-stream";
}

function extFromMime(mime) {
  if (!mime) return "bin";
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("mp4")) return "mp4";
  return "bin";
}

async function fetchUrlToBuffer(url) {
  const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 60000 });
  const buffer = Buffer.from(resp.data);
  const mime = (resp.headers && resp.headers["content-type"]) || detectMimeFromBuffer(buffer);
  const ext = extFromMime(mime) || path.extname(new URL(url).pathname).replace(".", "") || "bin";
  return { buffer, mime, ext };
}

function base64ToBuffer(str) {
  const dataUriMatch = str.match(/^data:(.+);base64,(.*)$/);
  if (dataUriMatch) {
    const mime = dataUriMatch[1];
    const b64 = dataUriMatch[2];
    const buffer = Buffer.from(b64, "base64");
    return { buffer, mime, ext: extFromMime(mime) };
  }
  const cleaned = str.replace(/\s+/g, "");
  try {
    const buffer = Buffer.from(cleaned, "base64");
    const mime = detectMimeFromBuffer(buffer);
    return { buffer, mime, ext: extFromMime(mime) };
  } catch {
    const buffer = Buffer.from(String(str), "utf8");
    return { buffer, mime: "text/plain", ext: "txt" };
  }
}

async function normalizeOutputToBuffer(out, defaultMime = null) {
  if (Array.isArray(out) && out.length > 0) out = out[0];
  if (typeof out === "object" && out !== null) {
    if (out.url) out = out.url;
    else if (out.output && Array.isArray(out.output) && out.output.length) out = out.output[0];
    else if (out.output && typeof out.output === "string") out = out.output;
    else if (out.base64) out = out.base64;
    else if (out.image_base64) out = out.image_base64;
    else if (out.data) out = out.data;
    else out = JSON.stringify(out);
  }
  if (typeof out === "string") {
    out = out.trim();
    if (/^https?:\/\//i.test(out)) {
      try {
        return await fetchUrlToBuffer(out);
      } catch {
        return { buffer: Buffer.from(out, "utf8"), mime: defaultMime || "text/plain", ext: "txt" };
      }
    }
    if (/^data:.*;base64,/.test(out) || /^[A-Za-z0-9+/=\s]+$/.test(out)) {
      return base64ToBuffer(out);
    }
    return { buffer: Buffer.from(out, "utf8"), mime: defaultMime || "text/plain", ext: "txt" };
  }
  if (Buffer.isBuffer(out)) {
    const mime = detectMimeFromBuffer(out);
    return { buffer: out, mime, ext: extFromMime(mime) };
  }
  return { buffer: Buffer.from(String(out)), mime: defaultMime || "application/octet-stream", ext: "bin" };
}

async function fetchImage(jobId) {
  const response = await axios.post(
    `https://modelslab.com/api/v6/images/fetch/${jobId}`,
    { key: KEYYY },
    { headers }
  );
  if (response.data?.status === "processing") {
    await new Promise((r) => setTimeout(r, 5000));
    return fetchImage(jobId);
  }
  return response.data.output || response.data;
}

async function fetchVideo(jobId) {
  const response = await axios.post(
    `https://modelslab.com/api/v6/video/fetch/${jobId}`,
    { key: KEYYY },
    { headers }
  );
  if (response.data?.status === "processing") {
    await new Promise((r) => setTimeout(r, 5000));
    return fetchVideo(jobId);
  }
  return response.data.output || response.data;
}

async function img2img(init_image, prompt) {
  const translatedPrompt = await translateToEnglish(prompt);
  const payload = {
    key: KEYYY,
    init_image,
    prompt: translatedPrompt,
    model_id: "flux-kontext-dev",
    num_inference_steps: "28",
    strength: "0.5",
    scheduler: "DPMSolverMultistepScheduler",
    guidance: "2.5",
    base64: false,
  };
  const response = await axios.post("https://modelslab.com/api/v6/images/img2img", payload, { headers });
  return response.data.id ? fetchImage(response.data.id) : response.data;
}

async function text2img(prompt) {
  const translatedPrompt = await translateToEnglish(prompt);
  const url = `https://noisy-firefly-a3ec.akshaynceo6876.workers.dev/chat/dalle?user_id=${UUID}&message=${encodeURIComponent(translatedPrompt)}`;
  const response = await axios.post(url, null, { headers });
  return response.data?.output?.length ? response.data.output : response.data;
}

async function img2video(init_image, prompt, options = {}) {
  const translatedPrompt = await translateToEnglish(prompt);
  const payload = {
    key: KEYYY,
    init_image,
    prompt: translatedPrompt,
    base64: false,
    resolution: options.resolution || "480",
    output_type: "mp4",
    model_id: options.model_id || "wan2.2",
    fps: options.fps || "16",
    num_frames: options.num_frames || "82",
  };
  const response = await axios.post("https://modelslab.com/api/v6/video/img2video_ultra", payload, { headers });
  return response.data.id ? fetchVideo(response.data.id) : response.data;
}

async function text2video(prompt, options = {}) {
  const translatedPrompt = await translateToEnglish(prompt);
  const payload = {
    key: KEYYY,
    prompt: translatedPrompt,
    resolution: options.resolution || "480",
    fps: options.fps || "16",
    num_frames: options.num_frames || "82",
    output_type: "mp4",
    model_id: options.model_id || "wan2.2",
  };
  const response = await axios.post("https://modelslab.com/api/v6/video/text2video_ultra", payload, { headers });
  return response.data.id ? fetchVideo(response.data.id) : response.data;
}

async function sendBufferAsMedia(conn, jid, buffer, mime, ext, fileName, caption, quoted) {
  fileName = fileName || `ai_output.${ext || extFromMime(mime) || "bin"}`;
  if (/^image\//.test(mime)) {
    return conn.sendMessage(jid, { image: buffer, caption, mimetype: mime }, { quoted });
  } else if (/^video\//.test(mime)) {
    return conn.sendMessage(jid, { video: buffer, caption, mimetype: mime }, { quoted });
  } else {
    return conn.sendMessage(jid, { document: buffer, fileName, mimetype: mime, caption }, { quoted });
  }
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (command === "تعديل") {
      let prompt, url;
      const q = m.quoted || m;
      const mimeQuoted = (q.msg || q).mimetype || "";
      if (/image/.test(mimeQuoted)) {
        if (!text) throw `⚠️ يجب كتابة الوصف بجانب الصورة.\n📌 مثال:\n${usedPrefix}${command} اجعلها أنمي`;
        const buffer = q.download ? await q.download() : null;
        if (!buffer) throw "❌ لم أستطع جلب الصورة المقتبسة.";
        url = await uploadImage(buffer);
        prompt = text.trim();
      } else {
        if (!text) throw `🔹 مثال:\n${usedPrefix}${command} <رابط-صورة> | اجعلها كرتونية`;
        [url, prompt] = args.length >= 2 ? [args[0], args.slice(1).join(" ")] : text.split("|").map((s) => s.trim());
        if (!url || !prompt) throw `⚠️ يجب وضع صورة/رابط + وصف.\nمثال:\n${usedPrefix}${command} <رابط-صورة> | اجعلها أنمي`;
        if (!/^https?:\/\//i.test(url)) throw "❌ الرجاء وضع رابط يبدأ بـ http(s).";
      }
      const waitMsg = await conn.sendMessage(m.chat, { text: "⏳ جاري التعديل..." }, { quoted: m });
      const result = await img2img(url, prompt);
      try { await conn.sendMessage(m.chat, { delete: waitMsg.key }); } catch {}
      if (!result) throw "❌ لم يتم استلام نتيجة من الخادم.";
      const meta = await normalizeOutputToBuffer(result, "image/png");
      const filename = `edited.${meta.ext || "png"}`;
      await sendBufferAsMedia(conn, m.chat, meta.buffer, meta.mime, meta.ext, filename, `✅ تم تعديل الصورة\n📌 الوصف: ${prompt}`, m);
      return;
    }

    if (command === "فنن") {
      if (!text) throw `⚠️ مثال:\n${usedPrefix}${command} قطة فضائية`;
      const waitMsg = await conn.sendMessage(m.chat, { text: "⏳ جاري الإنشاء..." }, { quoted: m });
      const result = await text2img(text);
      try { await conn.sendMessage(m.chat, { delete: waitMsg.key }); } catch {}
      if (!result) throw "❌ لم يتم استلام نتيجة من الخادم.";
      const meta = await normalizeOutputToBuffer(result, "image/png");
      const filename = `imagine.${meta.ext || "png"}`;
      await sendBufferAsMedia(conn, m.chat, meta.buffer, meta.mime, meta.ext, filename, `✅ تم الإنشاء\n📌 الوصف: ${text}`, m);
      return;
    }

    if (command === "فيو") {
      const q = m.quoted || m;
      const mimeQuoted = (q.msg || q).mimetype || "";
      if (!/image/.test(mimeQuoted)) throw `⚠️ رد على صورة مع الوصف.\nمثال:\n${usedPrefix}${command} اجعلها كرتونية`;
      if (!text) throw "⚠️ اكتب وصف للفيديو بجانب الصورة.";
      const buffer = q.download ? await q.download() : null;
      if (!buffer) throw "❌ لم أستطع جلب الصورة المقتبسة.";
      const url = await uploadImage(buffer);
      const waitMsg = await conn.sendMessage(m.chat, { text: "⏳ جاري التحويل لفيديو..." }, { quoted: m });
      const result = await img2video(url, text);
      try { await conn.sendMessage(m.chat, { delete: waitMsg.key }); } catch {}
      if (!result) throw "❌ لم يتم استلام نتيجة من الخادم.";
      const meta = await normalizeOutputToBuffer(result, "video/mp4");
      const filename = `ai_video.${meta.ext || "mp4"}`;
      await sendBufferAsMedia(conn, m.chat, meta.buffer, meta.mime, meta.ext, filename, `✅ تم إنشاء الفيديو\n📌 الوصف: ${text}`, m);
      return;
    }

    if (command === "تحريك") {
      if (!text) throw `⚠️ مثال:\n${usedPrefix}${command} روبوت يمشي في الصحراء`;
      const waitMsg = await conn.sendMessage(m.chat, { text: "⏳ جاري إنشاء الفيديو..." }, { quoted: m });
      const result = await text2video(text);
      try { await conn.sendMessage(m.chat, { delete: waitMsg.key }); } catch {}
      if (!result) throw "❌ لم يتم استلام نتيجة من الخادم.";
      const meta = await normalizeOutputToBuffer(result, "video/mp4");
      const filename = `ai_anim.${meta.ext || "mp4"}`;
      await sendBufferAsMedia(conn, m.chat, meta.buffer, meta.mime, meta.ext, filename, `✅ تم إنشاء الفيديو\n📌 الوصف: ${text}`, m);
      return;
    }
  } catch (e) {
    console.error(e);
    throw `❌ خطأ: ${e?.message || String(e)}`;
  }
};

handler.help = ["تعديل", "فنن", "فيو", "تحريك"];
handler.tags = ["ai"];
handler.command = /^(تعديل|فنن|فيو|تحريك)$/i;

export default handler;