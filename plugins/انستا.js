// instagram-downloader-handler.js
import axios from "axios";
import FormData from "form-data";
import * as cheerio from "cheerio";
import fs from "fs";
import os from "os";
import path from "path";

class InstagramDownloader {
  static async getCookieAndToken() {
    try {
      const response = await axios.get("https://kol.id/download-video/instagram", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Referer": "https://kol.id/",
        },
        timeout: 15000
      });

      const cookies = (response.headers["set-cookie"] || [])
        .map(c => c.split(";")[0])
        .join("; ");

      const $ = cheerio.load(response.data);
      let token = $("input[name='_token']").val() || $("meta[name='csrf-token']").attr("content") || "";

      // محاولة استخراج من سكربت لو لم نجد التوكن
      if (!token) {
        const scriptMatch = response.data.match(/_token\s*[:=]\s*['"]([^'"]+)['"]/i);
        if (scriptMatch) token = scriptMatch[1];
      }

      return { cookies, token };
    } catch (error) {
      throw new Error(`فشل في جلب الكوكيز/التوكن: ${error.message}`);
    }
  }

  static async download(instaUrl) {
    try {
      const { cookies, token } = await this.getCookieAndToken();

      const form = new FormData();
      form.append("url", instaUrl);
      // بعض النسخ لا تحتاج token، لكن نرسله لو موجود
      if (token) form.append("_token", token);

      const headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookies,
        ...form.getHeaders()
      };

      const resp = await axios.post(
        "https://kol.id/download-video/instagram",
        form,
        { headers, timeout: 20000 }
      );

      // resp.data قد يحتوي html داخل data.html او مباشرة كـ string
      const html = (resp.data && (resp.data.html || resp.data.data || resp.data)) || "";

      return this.parseResponse(String(html), instaUrl);
    } catch (error) {
      throw new Error(`فشل في تنزيل المحتوى: ${error.message}`);
    }
  }

  static parseResponse(html, referer = "") {
    const $ = cheerio.load(html);
    const title =
      $("#title-content-here h2").text().trim() ||
      $("h2").first().text().trim() ||
      $("title").text().trim() ||
      "Instagram";

    // محاولات متعددة لاستخراج رابط الفيديو
    let videoUrl =
      $('a.btn-instagram.btn-primary').attr("href") ||
      $('a.btn-primary[href*=".mp4"]').attr("href") ||
      $('a[href*="download"]').attr("href") ||
      $('video source').attr("src") ||
      $('video').attr("src") ||
      $('meta[property="og:video"]').attr("content") ||
      $('meta[name="twitter:player:stream"]').attr("content") ||
      "";

    // استخراج صور (حالة carousel)
    const imageUrls = [];
    $("a[href]").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.match(/\.(jpg|jpeg|png)(\?.*)?$/i)) imageUrls.push(href);
    });
    $("img[src]").each((i, el) => {
      const src = $(el).attr("src");
      if (src && src.match(/\.(jpg|jpeg|png)(\?.*)?$/i)) imageUrls.push(src);
    });

    // كـ fallback استخدم regex للبحث عن روابط mp4/jpg/png داخل الـ html
    if (!videoUrl) {
      const urlMatches = html.match(/https?:\/\/[^'"\s>]+?\.(mp4|jpg|jpeg|png)(\?[^'"\s>]*)?/gi) || [];
      for (const u of urlMatches) {
        if (u.match(/\.mp4/)) {
          videoUrl = u;
          break;
        } else if (u.match(/\.(jpg|jpeg|png)/) && !imageUrls.includes(u)) {
          imageUrls.push(u);
        }
      }
    }

    // إزالة التكرارات
    const uniqueImages = Array.from(new Set(imageUrls));

    if (videoUrl) {
      return {
        title,
        media: { type: "video", url: videoUrl }
      };
    } else if (uniqueImages.length) {
      return {
        title,
        media: { type: "image", urls: uniqueImages }
      };
    } else {
      return {
        title,
        media: { type: "unknown", urls: [] }
      };
    }
  }
}

// ====== handler for your bot ======
let handler = async (m, { conn, args }) => {
  const decorate = (text) => `╔═━━••【🧬】••━━═╗
✦ ${text} ✦
✦ بواسطة 𝑲𝑬𝑵 𝑩𝑶𝑻 ✦
╚═━━••【📮】••━━═╝`;

  if (!args[0]) {
    return conn.sendMessage(m.chat, { text: decorate("🚫 الرجاء إدخال رابط Instagram لتنزيل المحتوى") }, { quoted: m });
  }

  const url = args[0].trim();

  // رسالة تحميل أولية
  await conn.sendMessage(m.chat, { text: decorate("⏳ جاري البحث واستخراج الملف — الرجاء الانتظار...") }, { quoted: m });

  try {
    const result = await InstagramDownloader.download(url);

    if (result.media.type === "video") {
      // نحاول إرسال الرابط مباشرة أولاً (أخف)
      try {
        await conn.sendMessage(m.chat, {
          video: { url: result.media.url },
          mimetype: "video/mp4",
          caption: decorate(result.title || "تم التحميل بنجاح")
        }, { quoted: m });
      } catch (e) {
        // لو فشل إرسال الرابط (host يمنع الـ hotlink أو يحتاج headers)، نحمل الملف ونرسله كـ buffer
        const res = await axios.get(result.media.url, {
          responseType: "arraybuffer",
          headers: { "User-Agent": "Mozilla/5.0", "Referer": url },
          timeout: 60000
        });
        const buffer = Buffer.from(res.data, "binary");
        await conn.sendMessage(m.chat, {
          video: buffer,
          mimetype: "video/mp4",
          fileName: "instagram_video.mp4",
          caption: decorate(result.title || "تم التحميل بنجاح")
        }, { quoted: m });
      }
    } else if (result.media.type === "image") {
      for (let img of result.media.urls) {
        try {
          await conn.sendMessage(m.chat, {
            image: { url: img },
            caption: decorate(result.title || "تم التحميل بنجاح")
          }, { quoted: m });
        } catch (e) {
          // fallback to buffer
          try {
            const res = await axios.get(img, { responseType: "arraybuffer", headers: { "User-Agent": "Mozilla/5.0", "Referer": url }, timeout: 20000 });
            const buffer = Buffer.from(res.data, "binary");
            await conn.sendMessage(m.chat, {
              image: buffer,
              fileName: "image.jpg",
              caption: decorate(result.title || "تم التحميل بنجاح")
            }, { quoted: m });
          } catch (errImg) {
            // skip problematic image
            console.error("image send failed", errImg);
          }
        }
      }
    } else {
      await conn.sendMessage(m.chat, { text: decorate("❌ لم يتم العثور على أي محتوى قابل للتنزيل.") }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: decorate(`⚠️ خطأ: ${error.message || error}`) }, { quoted: m });
  }
};

handler.help = handler.command = ["انستا", "instagram", "instadl"];
handler.tags = ["downloader"];
export default handler;