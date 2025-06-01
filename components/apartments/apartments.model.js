// const mongoose = require('mongoose'); // Импорт библиотеки mongoose для работы с MongoDB

// // Описание схемы квартиры (структура объекта в базе данных)
// const apartmentSchema = new mongoose.Schema({
//   objectName: { type: String, required: true }, // Название объекта (обязательное поле)
//   category: { type: String, required: true },   // Категория недвижимости (обязательное поле)
//   description: { type: String, required: true }, // Описание (обязательное поле)
//   city: { type: String, required: true },        // Город (обязательное поле)
//   street: { type: String, required: true },      // Улица (обязательное поле)
//   price: { type: Number, required: true },       // Цена (обязательное поле)
//   photos: [String], // Массив строк (URL фотографий)
// }, { timestamps: true }); // Автоматически добавляет createdAt и updatedAt

// // Экспорт модели Apartment на основе схемы
// module.exports = mongoose.model('Apartment', apartmentSchema);



const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  city: { type: String, required: true },           // Наприклад, "Київ, Україна, 02000"
  district: { type: String, required: true },       // Наприклад, "троєщина"
  metro: { type: String, default: null },           // Наприклад, null або "Лісова"
  hasMetro: { type: Boolean, default: false },      // true або false
  description: { type: String, required: false },   // Опис, необов'язкове поле
  photos: [String],                                 // Масив фото
  price: { type: Number, required: true },          // Ціна
  createdAt: { type: Date, default: Date.now }      // Дата створення
});

module.exports = mongoose.model('Apartment', apartmentSchema);