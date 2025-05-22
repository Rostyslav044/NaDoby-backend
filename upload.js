// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// // Подключаем credentials
// const storage = new Storage({
//   keyFilename: path.join(__dirname, 'credentials', 'credentials.json'),
// });

// const bucketName = 'project2025-images';
// const localFilePath = path.join(__dirname, 'uploads', 'photo.jpg'); // путь к файлу
// const destination = 'photo.jpg'; // как будет называться в bucket-е

// async function uploadFile() {
//   await storage.bucket(bucketName).upload(localFilePath, {
//     destination: destination,
//   });

//   console.log(`✅ Файл ${destination} загружен в bucket ${bucketName}`);
// }

// uploadFile().catch(console.error);
