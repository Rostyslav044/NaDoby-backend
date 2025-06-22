



// const express = require('express'); 
// const multer = require('multer');
// const path = require('path');
// const sharp = require('sharp');
// const { Storage } = require('@google-cloud/storage');

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
// });

// const storage = new Storage({
//   keyFilename: path.join(__dirname, '../credentials/credentials.json'),
// });

// const bucketName = 'project2025-images';

// router.post('/', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'Файл не найден' });
//     }

//     const filename = `${Date.now()}.webp`;
//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(filename);

//     // 🔄 Конвертируем изображение в WebP
//     const webpBuffer = await sharp(req.file.buffer)
//       .webp({ quality: 75 }) // можно изменить качество по желанию
//       .toBuffer();

//     const stream = file.createWriteStream({
//       metadata: {
//         contentType: 'image/webp',
//       },
//       resumable: false,
//     });

//     stream.on('error', (err) => {
//       console.error('Ошибка потока:', err);
//       return res.status(500).json({ error: 'Ошибка при загрузке файла' });
//     });

//     stream.on('finish', () => {
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
//       return res.status(200).json({ message: 'Файл загружен', url: publicUrl });
//     });

//     stream.end(webpBuffer);
//   } catch (err) {
//     console.error('Ошибка сервера:', err);
//     return res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// module.exports = router;




const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config(); // Загрузка переменных из .env

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
});

// Используем путь к credentials из .env
const storage = new Storage({
  keyFilename: process.env.GC_KEY_FILENAME || path.join(__dirname, '../credentials/credentials.json'),
});

// Название bucket-а тоже берём из .env
const bucketName = process.env.GC_BUCKET_NAME || 'project2025-images';

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не найден' });
    }

    const filename = `${Date.now()}.webp`;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    // 🔄 Конвертируем изображение в WebP
    const webpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 75 }) // можно изменить качество по желанию
      .toBuffer();

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/webp',
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Ошибка потока:', err);
      return res.status(500).json({ error: 'Ошибка при загрузке файла' });
    });

    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      return res.status(200).json({ message: 'Файл загружен', url: publicUrl });
    });

    stream.end(webpBuffer);
  } catch (err) {
    console.error('Ошибка сервера:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
