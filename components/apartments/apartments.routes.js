


// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { 
//   addApartment, 
//   getAllApartments, 
//   getApartmentById, 
//   getUserApartments, 
//   getUserApartmentsCount,
//   updateApartment,
//   deleteApartment,
//   toggleFavorite,
//   getUserFavorites,
//   checkIsFavorite,
//   getFavoritesCount
// } = require('./apartments.controller');
// const Apartment = require('./apartments.model');

// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage,
//   limits: { 
//     fileSize: 50 * 1024 * 1024,
//     files: 15
//   }
// });

// // Middleware для получения userId
// const getUserId = (req, res, next) => {
//   // Получаем userId из заголовка, query параметра или body
//   req.userId = req.headers['user-id'] || req.query.userId || req.body.userId;
//   next();
// };

// // Маршруты
// router.post('/add', upload.array('files', 15), addApartment);
// router.put('/update/:id', upload.array('files', 15), updateApartment); // Добавлен маршрут обновления
// router.get('/get-all', getAllApartments);
// router.get('/:id', getApartmentById);
// router.get('/user-apartment/:userId', getUserApartments);
// router.get('/user-apartment-count/:userId', getUserApartmentsCount);
// router.delete('/:id', deleteApartment);
// // Маршруты для избранного
// router.post('/favorites/toggle', getUserId, toggleFavorite);
// router.get('/favorites/user', getUserId, getUserFavorites);
// router.get('/favorites/check/:apartmentId', getUserId, checkIsFavorite);
// router.get('/favorites/count', getUserId, getFavoritesCount);

// router.get('/user/:userId', async (req, res) => {
//   try {
//     const apartments = await Apartment.find({ userId: req.params.userId });
//     res.status(200).json(apartments);
//   } catch (error) {
//     console.error('Ошибка при получении квартир пользователя:', error);
//     res.status(500).json({ message: 'Ошибка сервера' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
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
  getUserId
} = require('./apartments.controller');
const Apartment = require('./apartments.model');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024,
    files: 15
  }
});

// Маршруты
router.post('/add', upload.array('files', 15), addApartment);
router.put('/update/:id', upload.array('files', 15), updateApartment);
router.get('/get-all', getAllApartments);
router.get('/:id', getApartmentById);
router.get('/user-apartment/:userId', getUserApartments);
router.get('/user-apartment-count/:userId', getUserApartmentsCount);
router.delete('/:id', deleteApartment);

// Маршруты для избранного (все используют middleware getUserId)
router.post('/favorites/toggle', getUserId, toggleFavorite);
router.get('/favorites/user', getUserId, getUserFavorites);
router.get('/favorites/check/:apartmentId', getUserId, checkIsFavorite);
router.get('/favorites/count', getUserId, getFavoritesCount);
router.get('/favorites/check', checkIsFavorite);
// Новый маршрут для прямого удаления
// router.post('/favorites/remove', getUserId, removeFavorite);
// В routes.js
// router.post('/favorites/remove', getUserId, removeFavorite);

router.get('/user/:userId', async (req, res) => {
  try {
    const apartments = await Apartment.find({ userId: req.params.userId });
    res.status(200).json(apartments);
  } catch (error) {
    console.error('Ошибка при получении квартир пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;