import Jimp from 'jimp';

const colorOptions = [
  { name: 'أحمر', color: '#FF0000' },
  { name: 'أخضر', color: '#00FF00' },
  { name: 'أزرق', color: '#0000FF' },
  { name: 'أصفر', color: '#FFFF00' },
  { name: 'برتقالي', color: '#FFA500' },
  { name: 'بنفسجي', color: '#800080' },
  { name: 'رمادي', color: '#808080' },
];

const operations = [
  { name: 'تغيير الحجم', operation: (image) => image.resize(800, Jimp.AUTO) },
  { name: 'زيادة الحدة', operation: (image) => image.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ])
  },
  { name: 'تحسين السطوع', operation: (image) => image.brightness(0.1) },
  { name: 'تحسين التباين', operation: (image) => image.contrast(0.3) },
  { name: 'تحويل إلى أبيض وأسود', operation: (image) => image.grayscale() },
  { name: 'تنعيم الصورة', operation: (image) => image.blur(5) },
  { name: 'تدوير الصورة', operation: (image) => image.rotate(90) },
  { name: 'تغيير الألوان', operation: null },
  { name: 'تغيير الشفافية', operation: (image) => image.opacity(0.8) },
  { name: 'إضافة نص', operation: null },
  { name: 'قص الصورة', operation: null },
  { name: 'وضع إطار مشوش', operation: null },
  { name: 'تحويل إلى بورتريه', operation: null },
  { name: 'تحويل الصورة إلى HD', operation: (image) => image.resize(Jimp.AUTO, 1080) },
  { name: 'ضبابية', operation: (image) => image.blur(10) },
  { name: 'كرتوني', operation: (image) => image.convolute([
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1],
    ])
  },
  { name: 'ظل', operation: (image) => {
      const shadow = image.clone().opacity(0.5).blur(5);
      return image.composite(shadow, 10, 10);
    }
  },
  { name: 'زيتي', operation: (image) => image.color([{ apply: 'mix', params: ['#8B4513', 100] }]) },
  { name: 'HDR', operation: (image) => {
      return image.convolute([
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0],
        ]).contrast(0.3).brightness(0.1);
    }
  },
  { name: 'فيلم', operation: (image) => {
      return image.color([{ apply: 'mix', params: ['#000000', 50] }]);
    }
  },
  { name: 'تشويش', operation: (image) => image.blur(3) },
  { name: 'تعتيم', operation: (image) => image.opacity(0.5) },
];

const handler = async (m, { conn, text }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";

    if (!mime.startsWith("image")) 
      return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ يرجى تحديد صورة ✦
╚═━━••【📮】••━━═╝
`, m);

    let img = await q.download?.();
    if (!img) 
      return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ ⚠️ لم يتمكن البوت من تحميل الصورة ✦
╚═━━••【📮】••━━═╝
`, m);

    if (!text) {
      let operationsList = operations.map((op, index) => `${index + 1}. ${op.name}`).join('\n');
      return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ يرجى اختيار رقم الوظيفة: ✦

${operationsList}
╚═━━••【📮】••━━═╝
`, m);
    }

    const inputArray = text.split(' ');
    const operationNumber = parseInt(inputArray[0]) - 1;
    const secondInput = inputArray.slice(1).join(' ');

    if (isNaN(operationNumber) || operationNumber < 0 || operationNumber >= operations.length) {
      return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ يرجى اختيار رقم وظيفة صحيح من القائمة ✦
╚═━━••【📮】••━━═╝
`, m);
    }

    conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ ♻️ جاري معالجة الصورة باستخدام الوظيفة... ✦
╚═━━••【📮】••━━═╝
`, m);

    const image = await Jimp.read(img);

    if (operations[operationNumber].name === 'تحويل إلى بورتريه') {
      const portraitWidth = image.bitmap.height * (9 / 16);
      await image.resize(portraitWidth, image.bitmap.height);
      await image.crop(0, 0, portraitWidth, image.bitmap.height);
    }

    if (operations[operationNumber].name === 'تغيير الألوان') {
      if (secondInput) {
        const colorIndex = parseInt(secondInput) - 1;
        if (colorIndex < 0 || colorIndex >= colorOptions.length) {
          return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ يرجى اختيار رقم لون صحيح ✦
╚═━━••【📮】••━━═╝
`, m);
        }
        const selectedColor = colorOptions[colorIndex].color;
        image.color([{ apply: 'mix', params: [selectedColor, 100] }]);
      } else {
        const colorList = colorOptions.map((col, index) => `${index + 1}. ${col.name}`).join('\n');
        return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ اختر اللون من القائمة: ✦

${colorList}
╚═━━••【📮】••━━═╝
`, m);
      }
    }

    if (operations[operationNumber].name === 'إضافة نص') {
      if (!secondInput) {
        return conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ يرجى إدخال النص المطلوب إضافته بعد رقم الوظيفة ✦
╚═━━••【📮】••━━═╝
`, m);
      }
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      const textWidth = Jimp.measureText(font, secondInput);
      const textHeight = Jimp.measureTextHeight(font, secondInput);

      image.print(font, (image.bitmap.width / 2) - (textWidth / 2), image.bitmap.height - textHeight - 10, secondInput);
    }

    if (operations[operationNumber].name === 'وضع إطار مشوش') {
      const blurredImage = image.clone().blur(10);
      const blurredWidth = image.bitmap.width * 2;
      const blurredHeight = image.bitmap.height * 2;
      blurredImage.resize(blurredWidth, blurredHeight);
      blurredImage.composite(image, (blurredWidth - image.bitmap.width) / 2, (blurredHeight - image.bitmap.height) / 2);
      await blurredImage.getBufferAsync(Jimp.MIME_JPEG);
    }

    if (operations[operationNumber].name === 'قص الصورة') {
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      const cropWidth = height / 2;
      const cropHeight = height;
      const x = (width / 2) - (cropWidth / 2);
      const y = (height / 2) - (cropHeight / 2);
      image.crop(x, y, cropWidth, cropHeight);
    }

    const operationFunction = operations[operationNumber].operation;
    if (operationFunction && typeof operationFunction === 'function') {
      await operationFunction(image);
    }

    const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    await conn.sendFile(m.chat, processedImageBuffer, 'enhanced_image.jpg', `
╔═━━••【🧬】••━━═╗
✦ ✅ تم تطبيق وظيفة "${operations[operationNumber].name}" بنجاح! ✦
╚═━━••【📮】••━━═╝
`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `
╔═━━••【🧬】••━━═╗
✦ ⚠️ حدث خطأ أثناء معالجة الصورة: ${error.message} ✦
╚═━━••【📮】••━━═╝
`, m);
  }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.command = ["تحسين"];
export default handler;