// const Apartment = require('./apartments.model'); // Импорт модели Apartment
// const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud'); // Импорт функции загрузки на Google Cloud

// // ✅ Контроллер для получения апартамента по ID
// const getApartmentById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const apartment = await Apartment.findById(id);

//     if (!apartment) {
//       return res.status(404).json({ message: 'Объявление не найдено' });
//     }

//     res.status(200).json(apartment);
//   } catch (error) {
//     console.error('Ошибка при получении квартиры по ID:', error);
//     res.status(500).json({ message: 'Ошибка сервера при получении квартиры' });
//   }
// };



// // Контроллер для добавления квартиры
// const addApartment = async (req, res) => {
//   try {
//     // Извлекаем данные из тела запроса
//     const { objectName, category, description,
//        city, street, price, photos, district,userId} = req.body;

//     const photoUrls = []; // Массив для хранения URL загруженных фото

//     // Если файлы переданы
//     if (req.files && req.files.length) {
//       for (const file of req.files) { // Для каждого файла
//         const url = await uploadToGoogleCloud(file); // Загружаем файл в GCS и получаем URL
//         photoUrls.push(url); // Добавляем URL в массив
//       }
//     }
// // objectName,
//     // Создаём новую запись квартиры
//     const apartment = new Apartment({
//       district,
//       category,
//       description,
//       city,
//       objectName,
//       street,
//       price,
//       // rooms,     // 👈
//       // beds,    // 👈
//       // floor,     // 👈
//       photos, // Сохраняем массив URL фото
//       userId,  // обязательно сохраняем userId
//       // ...rest,
//       ...req.body
//     });

//     await apartment.save(); // Сохраняем в MongoDB

//     // Отправляем успешный ответ
//     res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
//   } catch (error) {
//     console.error('Ошибка при добавлении:', error); // Логгируем ошибку
//     res.status(500).json({ message: 'Ошибка сервера при добавлении объявления' }); // Ответ с ошибкой
//   }
// };

// // ✅ Контроллер для получения всех квартир
// const getAllApartments = async (req, res) => {
//   try {
//     const apartments = await Apartment.find(); // Получаем все апартаменты из MongoDB
//     res.status(200).json(apartments); // Отправляем клиенту
//   } catch (error) {
//     console.error('Ошибка при получении квартир:', error);
//     res.status(500).json({ message: 'Ошибка сервера при получении квартир' });
//   }
// };

// module.exports = { addApartment, getAllApartments,  getApartmentById };

const Apartment = require('./apartments.model');
const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud');

const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }
    res.status(200).json(apartment);
  } catch (error) {
    console.error('Ошибка при получении квартиры по ID:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const addApartment = async (req, res) => {
  try {
    const { photos = [], ...apartmentData } = req.body;
    let photoUrls = [...photos];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToGoogleCloud(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      photoUrls = [...photoUrls, ...uploadedUrls];
    }

    const apartment = new Apartment({
      ...apartmentData,
      photos: photoUrls
    });

    await apartment.save();
    res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};
const getUserApartments = async (req, res) => {
  try {
    
    
    if (!req.params.userId) {
      return res.status(400).json({ message: 'Необхідно вказати user_id' });
    }

    const apartments = await Apartment.find({ user_id: req.params.userId});
    
    if (apartments.length === 0) {
      return res.status(404).json({ message: 'Апартаменти для цього користувача не знайдено' });
    }

    res.status(200).json(apartments);
  } catch (error) {
    console.error('Помилка при отриманні апартаментів користувача:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
const getUserApartmentsCount = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ message: 'Необхідно вказати user_id' });
    }

    const count = await Apartment.countDocuments({ user_id: req.params.userId });

    // Якщо хочете завжди повертати кількість:
    return res.status(200).json({ count });

    // Якщо залишаємо 404 при відсутності:
    // if (count === 0) {
    //   return res.status(404).json({ message: 'Апартаменти для цього користувача не знайдено' });
    // }
    // res.status(200).json({ count });
  } catch (error) {
    console.error('Помилка при отриманні кількості апартаментів користувача:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.status(200).json(apartments);
  } catch (error) {
    console.error('Ошибка при получении квартир:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = { addApartment, getAllApartments, getApartmentById ,getUserApartments,getUserApartmentsCount};




