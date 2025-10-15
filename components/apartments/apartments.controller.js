



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

const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { photos = [], ...apartmentData } = req.body;
    
    console.log('Полученные данные для обновления:', apartmentData);
    console.log('ID объявления:', id);

    let photoUrls = [...photos];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToGoogleCloud(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      photoUrls = [...photoUrls, ...uploadedUrls];
    }

    const updatedApartment = await Apartment.findByIdAndUpdate(
      id,
      {
        ...apartmentData,
        photos: photoUrls
      },
      { new: true, runValidators: true }
    );

    console.log('Результат обновления:', updatedApartment);

    if (!updatedApartment) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    res.status(200).json({ 
      message: 'Объявление успешно обновлено', 
      apartment: updatedApartment 
    });
  } catch (error) {
    console.error('Ошибка при обновлении:', error);
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
    return res.status(200).json({ count });
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

const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Удаление объявления с ID:', id);
    
    const deletedApartment = await Apartment.findByIdAndDelete(id);
    
    if (!deletedApartment) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }
    
    console.log('Объявление успешно удалено:', deletedApartment);
    res.status(200).json({ 
      message: 'Объявление успешно удалено',
      apartment: deletedApartment 
    });
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};

// Middleware для получения userId
const getUserId = (req, res, next) => {
  req.userId = req.headers['user-id'];
  
  if (!req.userId) {
    return res.status(401).json({ 
      success: false,
      message: 'Необходима авторизация: user-id header is required' 
    });
  }
  
  next();
};



const toggleFavorite = async (req, res) => {
  try {
    const { apartmentId } = req.body;
    const userId = req.userId;

    console.log('=== TOGGLE FAVORITE START ===');
    console.log('apartmentId:', apartmentId);
    console.log('userId:', userId);

    if (!apartmentId) {
      return res.status(400).json({ 
        success: false,
        message: 'apartmentId is required' 
      });
    }

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ 
        success: false,
        message: 'Объявление не найдено' 
      });
    }

    const isCurrentlyFavorite = apartment.favoritedBy.some(favId => 
      favId.toString() === userId.toString()
    );

    console.log('Current favorite state:', isCurrentlyFavorite);
    console.log('favoritedBy before:', apartment.favoritedBy);
    
    if (isCurrentlyFavorite) {
      // Удаляем из избранного
      apartment.favoritedBy = apartment.favoritedBy.filter(id => id.toString() !== userId.toString());
      console.log('Removed from favorites');
    } else {
      // Добавляем в избранное
      apartment.favoritedBy.push(userId);
      console.log('Added to favorites');
    }

    await apartment.save();

    console.log('favoritedBy after:', apartment.favoritedBy);
    console.log('New isFavorite state:', !isCurrentlyFavorite);
    console.log('=== TOGGLE FAVORITE END ===');

    res.status(200).json({ 
      success: true,
      isFavorite: !isCurrentlyFavorite,
      favoritesCount: apartment.favoritedBy.length,
      message: isCurrentlyFavorite ? 'Удалено из избранного' : 'Добавлено в избранное'
    });
  } catch (error) {
    console.error('Ошибка при обновлении избранного:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера',
      error: error.message 
    });
  }
};
// Получить все избранные объявления пользователя
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    // Находим все объявления, где пользователь в избранном
    const favoriteApartments = await Apartment.find({ 
      favoritedBy: userId 
    });

    res.status(200).json({
      success: true,
      favorites: favoriteApartments,
      count: favoriteApartments.length
    });
  } catch (error) {
    console.error('Ошибка при получении избранного:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};



// Измени этот метод
const checkIsFavorite = async (req, res) => {
  try {
    // Получаем apartmentId из query параметров вместо params
    const { apartmentId } = req.query;
    const userId = req.userId;

    if (!apartmentId) {
      return res.status(400).json({ 
        success: false,
        message: 'apartmentId is required' 
      });
    }

    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ 
        success: false,
        message: 'Объявление не найдено' 
      });
    }

    const isFavorite = apartment.favoritedBy.includes(userId);
    
    res.status(200).json({ 
      success: true,
      isFavorite 
    });
  } catch (error) {
    console.error('Ошибка при проверке избранного:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

// const searchApartments = async (req, res) => {
//   try {
//     const { location, guests, types, language = 'ua' } = req.body;
    
//     console.log('Search parameters:', { location, guests, types });

//     // Базовый запрос
//     let query = {};

//     // Фильтр по местоположению
//     if (location && location.trim() !== '') {
//       query.$or = [
//         { city: { $regex: location, $options: 'i' } },
//         { street: { $regex: location, $options: 'i' } },
//         { district: { $regex: location, $options: 'i' } },
//         { metro: { $regex: location, $options: 'i' } }
//       ];
//     }

//     // Фильтр по количеству гостей
//     if (guests && !isNaN(guests)) {
//       query.beds = { $gte: parseInt(guests) };
//     }

//     // Фильтр по типам жилья - ПРЕОБРАЗУЕМ КЛЮЧИ В НАЗВАНИЯ
//     if (types && types.length > 0) {
//       const categoryMapping = {
//         apart: ['Квартира', 'Квартиры'],
//         hotel: ['Гостиница', 'Готель'],
//         petHotel: ['Готель для животных', 'Готель для тварин'],
//         hostel: ['Хостел'],
//         house: ['Дом', 'Будинок'],
//         recreationCenter: ['База отдыха', 'База відпочинку'],
//         sauna: ['Сауна/Баня', 'Сауна/Лазня'],
//         glamping: ['Глэмпинг', 'Глемпінг'],
//         pansionat: ['Пансионат', 'Пансіонат'],
//         kotedzi: ['Коттедж для компаний', 'Котедж для компаній'],
//         kavorking: ['Коворкинг', 'Коворкінг'],
//         avtokemping: ['Автокемпинг', 'Автокемпінг']
//       };

//       const categories = types.flatMap(key => categoryMapping[key] || []);
//       console.log('Mapped categories for search:', categories);
      
//       if (categories.length > 0) {
//         query.category = { $in: categories };
//       }
//     }

//     console.log('MongoDB query:', JSON.stringify(query, null, 2));

//     const apartments = await Apartment.find(query);
    
//     console.log(`Found ${apartments.length} apartments`);

//     res.status(200).json({
//       success: true,
//       count: apartments.length,
//       data: apartments,
//       searchParams: { location, guests, types }
//     });

//   } catch (error) {
//     console.error('Ошибка при поиске апартаментов:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Ошибка сервера при поиске',
//       error: error.message 
//     });
//   }
// };


const searchApartments = async (req, res) => {
  try {
    const { location, guests, types, language = 'ua' } = req.body;
    
    console.log('Search parameters:', { location, guests, types });

    // Базовый запрос
    let query = {};

    // Фильтр по местоположению
    if (location && location.trim() !== '') {
      query.$or = [
        { city: { $regex: location, $options: 'i' } },
        { street: { $regex: location, $options: 'i' } },
        { district: { $regex: location, $options: 'i' } },
        { metro: { $regex: location, $options: 'i' } }
      ];
    }

    // Фильтр по количеству гостей
    if (guests && !isNaN(guests)) {
      query.beds = { $gte: parseInt(guests) };
    }

    // Фильтр по типам жилья - ИСПРАВЛЕННЫЙ МЭППИНГ
    if (types && types.length > 0) {
      const categoryMapping = {
        apart: ['Квартира', 'Квартира'],
        hotel: ['Гостиница', 'Готель'],
        petHotel: ['Гостиница для животных', 'Готель для тварин'],
        hostel: ['Хостел', 'Хостел'],
        house: ['Дом', 'Будинок'],
        recreationCenter: ['База отдыха', 'База відпочинку'],
        sauna: ['Сауна/Баня', 'Сауна/Лазня'],
        glamping: ['Глемпинг', 'Глемпінг'],
        pansionat: ['Пансионат', 'Пансіонат'],
        kotedzi: ['Коттедж для компаний', 'Котедж для компаній'],
        kavorking: ['Коворкинг', 'Коворкінг'],
        avtokemping: ['Автокемпинг', 'Автокемпінг']
      };

      const categories = types.flatMap(key => categoryMapping[key] || []);
      console.log('Mapped categories for search:', categories);
      
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    const apartments = await Apartment.find(query);
    
    console.log(`Found ${apartments.length} apartments`);

    // ПРАВИЛЬНЫЙ ПЕРЕВОД КАТЕГОРИЙ ПЕРЕД ОТПРАВКОЙ
    const translatedApartments = apartments.map(apartment => {
      const categoryTranslations = {
        'Квартира': { ua: 'Квартира', ru: 'Квартира' },
        'Гостиница': { ua: 'Готель', ru: 'Гостиница' },
        'Гостиница для животных': { ua: 'Готель для тварин', ru: 'Гостиница для животных' },
        'Хостел': { ua: 'Хостел', ru: 'Хостел' },
        'Дом': { ua: 'Будинок', ru: 'Дом' },
        'База отдыха': { ua: 'База відпочинку', ru: 'База отдыха' },
        'Сауна/Баня': { ua: 'Сауна/Лазня', ru: 'Сауна/Баня' },
        'Глемпинг': { ua: 'Глемпінг', ru: 'Глемпинг' },
        'Пансионат': { ua: 'Пансіонат', ru: 'Пансионат' },
        'Коттедж для компаний': { ua: 'Котедж для компаній', ru: 'Коттедж для компаний' },
        'Коворкинг': { ua: 'Коворкінг', ru: 'Коворкинг' },
        'Автокемпинг': { ua: 'Автокемпінг', ru: 'Автокемпинг' }
      };

      return {
        ...apartment.toObject(),
        category: categoryTranslations[apartment.category]?.[language] || apartment.category
      };
    });

    res.status(200).json({
      success: true,
      count: translatedApartments.length,
      data: translatedApartments,
      searchParams: { location, guests, types }
    });

  } catch (error) {
    console.error('Ошибка при поиске апартаментов:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера при поиске',
      error: error.message 
    });
  }
};

// Получить количество избранных для пользователя
const getFavoritesCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Apartment.countDocuments({ 
      favoritedBy: userId 
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Ошибка при получении количества избранных:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

module.exports = { 
  addApartment, 
  getAllApartments, 
  getApartmentById, 
  getUserApartments, 
  getUserApartmentsCount,
  updateApartment,
  deleteApartment,
  toggleFavorite,
  getUserFavorites,
  checkIsFavorite,
  getFavoritesCount,
  getUserId,
  searchApartments 
};