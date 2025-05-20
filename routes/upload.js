






// const express = require('express');
// const router = express.Router();
// const multer = require('multer');

// // Используем memoryStorage для multer
// const upload = multer({
// 	storage: multer.memoryStorage(),
// 	limits: { fileSize: 5 * 1024 * 1024 }, // макс 5MB
// });

// router.post('/', upload.single('file'), (req, res) => {
// 	if (!req.file) {
// 		return res.status(400).json({ error: 'Файл не загружен' });
// 	}
// 	// Здесь должна быть логика загрузки файла в Google Cloud Storage
// 	// Для теста просто отправим имя файла обратно
// 	res.json({ message: 'Файл получен', filename: req.file.originalname });
// });

// module.exports = router;




// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { Storage } = require('@google-cloud/storage');

// const router = express.Router();

// // Настройка Multer для хранения в памяти (без сохранения на диск)
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
// });

// // Инициализация Google Cloud Storage
// const storage = new Storage({
//   keyFilename: path.join(__dirname, '../credentials/credentials.json'),
// });

// // Укажи имя своего bucket из Google Cloud
// const bucketName = 'project2025-images';

// // Роут для загрузки файла
// router.post('/', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'Файл не найден' });
//     }

//     const filename = `${Date.now()}_${req.file.originalname}`;

//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(filename);

//     const stream = file.createWriteStream({
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//       resumable: false,
//     });

//     stream.on('error', (err) => {
//       console.error('Ошибка потока:', err);
//       return res.status(500).json({ error: 'Ошибка при загрузке файла' });
//     });

//     stream.on('finish', async () => {
//       await file.makePublic(); // делаем доступным по ссылке
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
//       return res.status(200).json({ message: 'Файл загружен', url: publicUrl });
//     });

//     stream.end(req.file.buffer);
//   } catch (err) {
//     console.error('Ошибка сервера:', err);
//     return res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// module.exports = router;



const express = require('express');
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const router = express.Router();

// Настройка Multer для хранения в памяти (без сохранения на диск)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
});

// Инициализация Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, '../credentials/credentials.json'),
});

// Имя бакета
const bucketName = 'project2025-images';

// Роут для загрузки файла
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не найден' });
    }

    const filename = `${Date.now()}_${req.file.originalname}`;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Ошибка потока:', err);
      return res.status(500).json({ error: 'Ошибка при загрузке файла' });
    });

    stream.on('finish', () => {
      // Убираем вызов makePublic(), доступ управляем на уровне бакета в консоли
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      return res.status(200).json({ message: 'Файл загружен', url: publicUrl });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Ошибка сервера:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
