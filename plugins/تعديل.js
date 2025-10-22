import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import uploadImage from "../lib/uploadImage.js"; // دالة رفع الصورة

class EasemateClient {
  constructor(deviceUUId = `${Date.now()}`) {
    this.deviceUUId = deviceUUId;
    this.appKey = "TB";
    this.productCode = "888";
    this.baseURL = "https://api.easemate.ai";
  }

  sortParams(obj) {
    return Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        const val = obj[key];
        if (Array.isArray(val)) {
          res[key] = val.map((i) =>
            typeof i === "object" && i !== null ? this.sortParams(i) : i
          );
        } else if (typeof val === "object" && val !== null) {
          res[key] = this.sortParams(val);
        } else {
          res[key] = val;
        }
        return res;
      }, {});
  }

  serializeQuery(obj, prefix = "") {
    const pairs = [];
    const build = (k, v) => {
      if (v === null || v === undefined) return;
      if (typeof v === "object" && !Array.isArray(v)) {
        for (const sub in v) build(`${k}[${sub}]`, v[sub]);
      } else if (Array.isArray(v)) {
        v.forEach((item, idx) => build(`${k}[${idx}]`, item));
      } else {
        pairs.push(`${k}=${v}`);
      }
    };
    for (const k in obj) build(prefix ? `${prefix}[${k}]` : k, obj[k]);
    return pairs.join("&");
  }

  getSigns(paramsObj, prefix) {
    const ts = Math.round(Date.now() / 1000);
    let baseStr;
    if (paramsObj && Object.keys(paramsObj).length) {
      const sorted = this.sortParams(paramsObj);
      sorted.appKey = this.appKey;
      sorted.timestamp = ts;
      const serialized = this.serializeQuery(sorted);
      baseStr = `${prefix}${serialized}${prefix}`;
    } else {
      baseStr = `${prefix}&appKey=${this.appKey}&timestamp=${ts}${prefix}`;
    }
    return {
      sign: crypto.createHash("md5").update(baseStr).digest("hex"),
      timestamp: `${ts}`,
    };
  }

  getHeaders(signObj) {
    return {
      accept: "application/json",
      "content-type": "application/json;charset=UTF-8",
      "client-type": "web",
      "client-name": "chatpdf",
      "product-code": this.productCode,
      "device-uuid": this.deviceUUId,
      "device-identifier": this.deviceUUId,
      "device-platform": "Android,Chrome",
      "device-type": "web",
      site: "www.easemate.ai",
      sign: signObj.sign,
      timestamp: signObj.timestamp,
    };
  }

  async uploadImageEasemate(filePath) {
    const data = {
      key: `pro/${this.deviceUUId}/${this.deviceUUId}.png`,
      value: this.deviceUUId.toString(),
    };
    const Sign = this.getSigns(data, this.deviceUUId);
    const res = await axios.post(
      `${this.baseURL}/api2/task/query_upload_url`,
      data,
      { headers: this.getHeaders(Sign) }
    );
    await axios.put(res.data.data.upload_url, fs.readFileSync(filePath));
    return { ...res.data.data, key: data.key };
  }

  async createImageTask(uploadInfo, prompt) {
    const data2 = {
      model_id: 10041,
      operation_info: { id: 419, operation: "IMAGE_GENERATION" },
      object_info: [
        {
          img_info: {
            s3_name: uploadInfo.key,
            s3_url: uploadInfo.download_url,
            size: fs.readFileSync(uploadInfo.localPath).length,
            origin_name: "input.png",
          },
        },
      ],
      parameters: JSON.stringify({
        prompt,
        file_type: "jpeg",
        aspectRatio: "3:2",
      }),
    };
    const Sign = this.getSigns(data2, this.deviceUUId);
    const res = await axios.post(
      `${this.baseURL}/api2/async/create_generate_image`,
      data2,
      { headers: this.getHeaders(Sign) }
    );
    return res.data.data;
  }

  async pollTask(taskId, task_type, interval = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        const data3 = { taskId, task_type };
        const Sign = this.getSigns(data3, this.deviceUUId);
        const res = await axios.post(
          `${this.baseURL}/api2/async/query_generate_image`,
          data3,
          { headers: this.getHeaders(Sign) }
        );
        const status = res.data.data?.status;
        if (!status) return;
        if (status === "FAILED") {
          clearInterval(timer);
          reject(res.data.data.msg);
        } else if (status !== "RUNNING") {
          clearInterval(timer);
          resolve(res.data.data);
        }
      }, interval);
    });
  }
}

const client = new EasemateClient();

// ===== Handler =====
const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";

    if (!/image/.test(mime)) {
      return m.reply(`⚠️ يجب أن ترد على صورة.\n📌 مثال:\n${usedPrefix}${command} اجعلها أنمي`);
    }
    if (!text) return m.reply(`⚠️ أرسل وصف بجانب الصورة.`);

    // تحميل الصورة المرسلة
    const buffer = await q.download();
    const filePath = path.join("./tmp", `${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);

    // رفع الصورة إلى Easemate
    const uploadInfo = await client.uploadImageEasemate(filePath);
    uploadInfo.localPath = filePath;

    // رسالة انتظار
    const wait = await conn.sendMessage(m.chat, { text: "⏳ جارٍ تعديل الصورة ..." }, { quoted: m });

    // إنشاء مهمة تعديل
    const task = await client.createImageTask(uploadInfo, text.trim());

    // انتظار النتيجة
    const result = await client.pollTask(task.taskId, task.task_type);

    await conn.sendMessage(m.chat, { delete: wait.key });

    // إرسال الصورة المعدلة
    await conn.sendFile(m.chat, result.url, "result.jpg", `✅ *تم تعديل الصورة*\n📌 الوصف: ${text}`, m);

    fs.unlinkSync(filePath);
  } catch (e) {
    console.error(e);
    m.reply("❌ حدث خطأ أثناء تعديل الصورة: " + e.message);
  }
};

handler.help = ["تعديل"];
handler.tags = ["ai"];
handler.command = /^(تعديل)$/i;

export default handler;