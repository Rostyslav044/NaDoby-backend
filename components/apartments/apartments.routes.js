// const express = require('express'); // Импорт express
// const router = express.Router(); // Создание нового роутера
// const { addApartment, getAllApartments,  getApartmentById,} = require('./apartments.controller'); // Импорт контроллера добавления
// const multer = require('multer'); // Импорт multer для обработки загрузки файлов

// const storage = multer.memoryStorage(); // Храним файлы в оперативной памяти (в буфере)
// const upload = multer({ storage }); // Настраиваем multer с этим типом хранения

// // Роут POST-запроса по пути /add, загружаем до 9 фото, передаём в контроллер
// router.post('/add', upload.array('photos', 15), addApartment);
// router.get('/get-all', getAllApartments);
// router.get('/:id', getApartmentById);
// // router.post('/add', addApartment)
// module.exports = router; // Экспорт роутера


const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addApartment, getAllApartments, getApartmentById } = require('./apartments.controller');
const Apartment = require('./apartments.model'); // Импорт модели для дополнительного роута

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Добавление квартиры с загрузкой до 15 фото
router.post('/add', upload.array('photos', 15), addApartment);

// Получить все квартиры
router.get('/get-all', getAllApartments);

// Получить квартиру по ID
router.get('/:id', getApartmentById);

// Новый роут — получить все квартиры пользователя по userId
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

