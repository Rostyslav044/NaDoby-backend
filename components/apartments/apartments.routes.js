

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');

// const { addApartment, getAllApartments, getApartmentById } = require('./apartments.controller');
// const Apartment = require('./apartments.model'); // Импорт модели для дополнительного роута

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Добавление квартиры с загрузкой до 15 фото
// // router.post('/add', upload.array('photos', 15), addApartment);
// // Замените 'photos' на 'files' в Multer:
// router.post('/add', upload.array('files', 15), addApartment);
// // Получить все квартиры
// router.get('/get-all', getAllApartments);

// // Получить квартиру по ID
// router.get('/:id', getApartmentById);

// // Новый роут — получить все квартиры пользователя по userId
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


// const express = require('express');
// const router = express.Router();
// const multer = require('multer');

// const { addApartment, getAllApartments, getApartmentById } = require('./apartments.controller');
// const Apartment = require('./apartments.model'); // Импорт модели для дополнительного роута

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Добавление квартиры с загрузкой до 15 фото
// router.post('/add', upload.array('files', 15), addApartment);

// // Получить все квартиры
// router.get('/get-all', getAllApartments);

// // Получить квартиру по ID
// router.get('/:id', getApartmentById);

// // Новый роут — получить все квартиры пользователя по userId
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
const { addApartment, getAllApartments, getApartmentById ,getUserApartments,getUserApartmentsCount} = require('./apartments.controller');
const Apartment = require('./apartments.model');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 15
  }
});

router.post('/add', upload.array('files', 15), addApartment);
router.get('/get-all', getAllApartments);
router.get('/:id', getApartmentById);
router.get('/user-apartment/:userId', getUserApartments);
router.get('/user-apartment-count/:userId', getUserApartmentsCount);
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