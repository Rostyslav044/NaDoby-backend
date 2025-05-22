const express = require('express');
const router = express.Router();
const { addApartment } = require('./apartments.controller'); // путь остаётся тем же
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add', upload.array('photos', 9), addApartment);

module.exports = router;
