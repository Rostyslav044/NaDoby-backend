const Apartment = require('./apartments.model'); // Импорт модели Apartment
const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud'); // Импорт функции загрузки на Google Cloud

// Контроллер для добавления квартиры
const addApartment = async (req, res) => {
  try {
    // Извлекаем данные из тела запроса
    const { objectName, category, description, city, street, price } = req.body;

    const photoUrls = []; // Массив для хранения URL загруженных фото

    // Если файлы переданы
    if (req.files && req.files.length) {
      for (const file of req.files) { // Для каждого файла
        const url = await uploadToGoogleCloud(file); // Загружаем файл в GCS и получаем URL
        photoUrls.push(url); // Добавляем URL в массив
      }
    }

    // Создаём новую запись квартиры
    const apartment = new Apartment({
      objectName,
      category,
      description,
      city,
      street,
      price,
      photos: photoUrls, // Сохраняем массив URL фото
    });

    await apartment.save(); // Сохраняем в MongoDB

    // Отправляем успешный ответ
    res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
  } catch (error) {
    console.error('Ошибка при добавлении:', error); // Логгируем ошибку
    res.status(500).json({ message: 'Ошибка сервера при добавлении объявления' }); // Ответ с ошибкой
  }
};

module.exports = { addApartment }; // Экспорт контроллера


