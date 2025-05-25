const express = require('express'); // Импорт express
const router = express.Router(); // Создание нового роутера
const { addApartment } = require('./apartments.controller'); // Импорт контроллера добавления
const multer = require('multer'); // Импорт multer для обработки загрузки файлов

const storage = multer.memoryStorage(); // Храним файлы в оперативной памяти (в буфере)
const upload = multer({ storage }); // Настраиваем multer с этим типом хранения

// Роут POST-запроса по пути /add, загружаем до 9 фото, передаём в контроллер
router.post('/add', upload.array('photos', 9), addApartment);

module.exports = router; // Экспорт роутера



