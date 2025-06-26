const Apartment = require('./apartments.model'); // Импорт модели Apartment
const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud'); // Импорт функции загрузки на Google Cloud

// Контроллер для добавления квартиры
const addApartment = async (req, res) => {
  try {
    // Извлекаем данные из тела запроса
    const { objectName, category, description, city, street, price, photos, district } = req.body;

    const photoUrls = []; // Массив для хранения URL загруженных фото

    // Если файлы переданы
    if (req.files && req.files.length) {
      for (const file of req.files) { // Для каждого файла
        const url = await uploadToGoogleCloud(file); // Загружаем файл в GCS и получаем URL
        photoUrls.push(url); // Добавляем URL в массив
      }
    }
// objectName,
    // Создаём новую запись квартиры
    const apartment = new Apartment({
      district,
      category,
      description,
      city,
      objectName,
      street,
      price,
      // rooms,     // 👈
      // beds,    // 👈
      // floor,     // 👈
      photos, // Сохраняем массив URL фото
      ...req.body
    });

    await apartment.save(); // Сохраняем в MongoDB

    // Отправляем успешный ответ
    res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
  } catch (error) {
    console.error('Ошибка при добавлении:', error); // Логгируем ошибку
    res.status(500).json({ message: 'Ошибка сервера при добавлении объявления' }); // Ответ с ошибкой
  }
};

// ✅ Контроллер для получения всех квартир
const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find(); // Получаем все апартаменты из MongoDB
    res.status(200).json(apartments); // Отправляем клиенту
  } catch (error) {
    console.error('Ошибка при получении квартир:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении квартир' });
  }
};

module.exports = { addApartment, getAllApartments };




// const Apartment = require('./apartments.model');
// const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud');

// const addApartment = async (req, res) => {
//   try {
//     const { objectName, category, description, city, street, price, photos, district } = req.body;

//     const photoUrls = [];

//     if (req.files && req.files.length) {
//       for (const file of req.files) {
//         const url = await uploadToGoogleCloud(file);
//         photoUrls.push(url);
//       }
//     }

//     const safePhotos = Array.isArray(photos) ? photos : (photos ? [photos] : []);

//     const apartment = new Apartment({
//       district,
//       category,
//       description,
//       city,
//       objectName,
//       street,
//       price,
//       photos: photoUrls.length ? photoUrls : safePhotos,
//       ...req.body,
//     });

//     await apartment.save();

//     res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
//   } catch (error) {
//     console.error('Ошибка при добавлении:', error);
//     res.status(500).json({ message: 'Ошибка сервера при добавлении объявления' });
//   }
// };

// // 🔥 ЭТО ОБЯЗАТЕЛЬНО
// const getAllApartments = async (req, res) => {
//   try {
//     const apartments = await Apartment.find();
//     res.status(200).json(apartments);
//   } catch (error) {
//     console.error('Ошибка при получении квартир:', error);
//     res.status(500).json({ message: 'Ошибка сервера при получении квартир' });
//   }
// };

// // 📦 Вот ЭТО добавь обязательно в самый низ:
// module.exports = {
//   addApartment,
//   getAllApartments
// };
