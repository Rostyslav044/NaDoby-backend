



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




// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const sharp = require('sharp');
// const { Storage } = require('@google-cloud/storage');
// require('dotenv').config(); // Загрузка переменных из .env

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
// });

// // Используем путь к credentials из .env
// const storage = new Storage({
//   keyFilename: process.env.GC_KEY_FILENAME || path.join(__dirname, '../credentials/credentials.json'),
// });

// // Название bucket-а тоже берём из .env
// const bucketName = process.env.GC_BUCKET_NAME || 'project2025-images';

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


// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const sharp = require('sharp');
// const { Storage } = require('@google-cloud/storage');
// require('dotenv').config();

// const router = express.Router();
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 50 * 1024 * 1024 } // 50MB
// });

// const storage = new Storage({
//   keyFilename: process.env.GC_KEY_FILENAME || path.join(__dirname, '../credentials/credentials.json'),
// });

// const bucketName = process.env.GC_BUCKET_NAME || 'project2025-images';

// router.post('/', upload.array('files'), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'Файлы не найдены' });
//     }

//     const uploadResults = await Promise.all(req.files.map(async (file) => {
//       const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
//       const fileRef = storage.bucket(bucketName).file(filename);

//       const webpBuffer = await sharp(file.buffer)
//         .webp({ quality: 80 })
//         .toBuffer();

//       await fileRef.save(webpBuffer, {
//         metadata: { contentType: 'image/webp' },
//       });

//       return `https://storage.googleapis.com/${bucketName}/${filename}`;
//     }));

//     res.status(200).json({ 
//       message: 'Файлы успешно загружены',
//       urls: uploadResults 
//     });
//   } catch (err) {
//     console.error('Ошибка сервера:', err);
//     res.status(500).json({ 
//       error: 'Ошибка при загрузке файлов',
//       details: err.message 
//     });
//   }
// });

// module.exports = router;



const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const router = express.Router();

// Настройка Multer с лимитом 50MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 15 // Максимум 15 файлов за раз
  },
  fileFilter: (req, file, cb) => {
    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Недопустимый формат файла: ${file.originalname}`));
    }
    cb(null, true);
  }
});

// Инициализация Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GC_KEY_FILENAME || path.join(__dirname, '../credentials/credentials.json'),
});
const bucketName = process.env.GC_BUCKET_NAME || 'project2025-images';

router.post('/', upload.array('files'), async (req, res) => {
  try {
    // 1. Проверка наличия файлов
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'Файлы не найдены',
        code: 'NO_FILES'
      });
    }

    // 2. Дополнительная проверка размера (на случай если multer пропустил)
    const oversizedFiles = req.files.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return res.status(413).json({
        error: `Следующие файлы превышают 50 МБ: ${oversizedFiles.map(f => f.originalname).join(', ')}`,
        code: 'FILE_TOO_LARGE',
        files: oversizedFiles.map(f => f.originalname)
      });
    }

    // 3. Обработка и загрузка файлов
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        try {
          const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
          const fileRef = storage.bucket(bucketName).file(filename);

          // Оптимизация изображения
          const webpBuffer = await sharp(file.buffer)
            .resize(3840, 2160, {  // Максимум 4K
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ 
              quality: 80,
              alphaQuality: 80,
              smartSubsample: true
            })
            .toBuffer();

          // Загрузка в Google Cloud
          await fileRef.save(webpBuffer, {
            metadata: { 
              contentType: 'image/webp',
              cacheControl: 'public, max-age=31536000'
            },
          });

          return {
            originalName: file.originalname,
            url: `https://storage.googleapis.com/${bucketName}/${filename}`,
            size: webpBuffer.length,
            status: 'success'
          };
        } catch (err) {
          return {
            originalName: file.originalname,
            error: err.message,
            status: 'failed'
          };
        }
      })
    );

    // 4. Формирование ответа
    const failedUploads = uploadResults.filter(r => r.status === 'failed');
    if (failedUploads.length > 0) {
      return res.status(207).json({ // Multi-Status
        message: 'Некоторые файлы не загружены',
        results: uploadResults,
        error: `Не удалось загрузить ${failedUploads.length} из ${req.files.length} файлов`,
        code: 'PARTIAL_UPLOAD'
      });
    }

    res.status(200).json({ 
      message: 'Все файлы успешно загружены',
      urls: uploadResults.map(r => r.url),
      totalSize: uploadResults.reduce((sum, file) => sum + file.size, 0),
      count: uploadResults.length
    });

  } catch (err) {
    console.error('Ошибка загрузки:', err);

    // Специальная обработка ошибок Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Один или несколько файлов превышают 50 МБ',
        code: 'FILE_TOO_LARGE'
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Превышено максимальное количество файлов (15)',
        code: 'TOO_MANY_FILES'
      });
    }

    res.status(500).json({ 
      error: 'Ошибка при обработке файлов',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;