
// const Apartment = require('./apartments.model');
// const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud');

// const getApartmentById = async (req, res) => {
//   try {
//     const apartment = await Apartment.findById(req.params.id);
//     if (!apartment) {
//       return res.status(404).json({ message: 'Объявление не найдено' });
//     }
//     res.status(200).json(apartment);
//   } catch (error) {
//     console.error('Ошибка при получении квартиры по ID:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// };

// const addApartment = async (req, res) => {
//   try {
//     const { photos = [], ...apartmentData } = req.body;
//     let photoUrls = [...photos];

//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map(file => uploadToGoogleCloud(file));
//       const uploadedUrls = await Promise.all(uploadPromises);
//       photoUrls = [...photoUrls, ...uploadedUrls];
//     }

//     const apartment = new Apartment({
//       ...apartmentData,
//       photos: photoUrls
//     });

//     await apartment.save();
//     res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
//   } catch (error) {
//     console.error('Ошибка при добавлении:', error);
//     res.status(500).json({ 
//       message: 'Ошибка сервера',
//       error: error.message 
//     });
//   }
// };
// const getUserApartments = async (req, res) => {
//   try {
    
    
//     if (!req.params.userId) {
//       return res.status(400).json({ message: 'Необхідно вказати user_id' });
//     }

//     const apartments = await Apartment.find({ user_id: req.params.userId});
    
//     if (apartments.length === 0) {
//       return res.status(404).json({ message: 'Апартаменти для цього користувача не знайдено' });
//     }

//     res.status(200).json(apartments);
//   } catch (error) {
//     console.error('Помилка при отриманні апартаментів користувача:', error);
//     res.status(500).json({ message: 'Помилка сервера' });
//   }
// };
// const getUserApartmentsCount = async (req, res) => {
//   try {
//     if (!req.params.userId) {
//       return res.status(400).json({ message: 'Необхідно вказати user_id' });
//     }

//     const count = await Apartment.countDocuments({ user_id: req.params.userId });

//     // Якщо хочете завжди повертати кількість:
//     return res.status(200).json({ count });

//     // Якщо залишаємо 404 при відсутності:
//     // if (count === 0) {
//     //   return res.status(404).json({ message: 'Апартаменти для цього користувача не знайдено' });
//     // }
//     // res.status(200).json({ count });
//   } catch (error) {
//     console.error('Помилка при отриманні кількості апартаментів користувача:', error);
//     res.status(500).json({ message: 'Помилка сервера' });
//   }
// };
// const getAllApartments = async (req, res) => {
//   try {
//     const apartments = await Apartment.find();
//     res.status(200).json(apartments);
//   } catch (error) {
//     console.error('Ошибка при получении квартир:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// };

// module.exports = { addApartment, getAllApartments, getApartmentById ,getUserApartments,getUserApartmentsCount};



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
    
    console.log('Полученные данные для обновления:', apartmentData); // Добавьте лог
    console.log('ID объявления:', id); // Добавьте лог

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

 // Используйте findOneAndUpdate вместо findByIdAndUpdate
//  const updatedApartment = await Apartment.findOneAndUpdate(
//   { _id: id },
//   {
//     ...apartmentData,
//     photos: photoUrls
//   },
//   { new: true, runValidators: true }
// );

    console.log('Результат обновления:', updatedApartment); // Добавьте лог

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

module.exports = { 
  addApartment, 
  getAllApartments, 
  getApartmentById, 
  getUserApartments, 
  getUserApartmentsCount,
  updateApartment 
};
