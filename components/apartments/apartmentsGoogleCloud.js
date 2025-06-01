const { Storage } = require('@google-cloud/storage'); // Импортируем библиотеку для работы с Google Cloud Storage
const path = require('path'); // Модуль Node.js для работы с путями к файлам
const sharp = require('sharp'); // Библиотека для обработки изображений, нужна для конвертации в WebP
const { v4: uuidv4 } = require('uuid'); // Импортируем генератор уникальных ID

const storage = new Storage({ // Создаём экземпляр клиента GCS
  projectId: process.env.GC_PROJECT_ID, // Берём ID проекта из переменной окружения
  keyFilename: process.env.GC_KEY_FILENAME, // Путь к JSON-файлу с ключом аккаунта GCP
});

const bucket = storage.bucket(process.env.GC_BUCKET_NAME); // Получаем бакет по имени из переменной окружения

const uploadToGoogleCloud = async (file) => { // Асинхронная функция для загрузки одного файла
  const filename = `${uuidv4()}.webp`; // Генерируем уникальное имя файла с расширением .webp
  const blob = bucket.file(filename); // Создаём объект файла в бакете

  const webpBuffer = await sharp(file.buffer) // Используем sharp для обработки буфера изображения
    .webp({ quality: 75 }) // Конвертируем в webp с заданным качеством
    .toBuffer(); // Получаем обработанный буфер

  const stream = blob.createWriteStream({ // Создаём поток для записи файла в GCS
    resumable: false, // Отключаем возможность возобновления прерванной загрузки
    metadata: {
      contentType: 'image/webp', // Указываем тип содержимого как WebP
    },
  });

  return new Promise((resolve, reject) => { // Оборачиваем поток в промис для удобной асинхронной работы
    stream.on('error', reject); // Если ошибка — отклоняем промис
    stream.on('finish', () => { // Если успешно завершено — формируем публичный URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // Формируем URL файла
      resolve(publicUrl); // Возвращаем URL
    });

    stream.end(webpBuffer); // Передаём в поток буфер webp-изображения
  });
};

module.exports = { uploadToGoogleCloud }; // Экспортируем функцию для использования в других частях проекта
