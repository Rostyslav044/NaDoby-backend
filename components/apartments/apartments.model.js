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
  objectName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String }, // необязательное
  metro: { type: String },
  hasMetro: { type: Boolean },
  price: { type: Number, required: true },
  photos: [String],
  name:[String] ,
  kidsAge: { type: Number },
  phones: [String],
  rooms: { type: Number },
  beds: { type: Number },
  size: { type: Number },
  floor: { type: Number },
  totalFloors: { type: Number },
  checkIn: { type: String },
  checkOut: { type: String },
  fullDayCheckIn: { type: String }, // "yes" / "no"
  smoking: { type: String },        // "yes" / "no"
  parties: { type: String },
  pets: { type: String },
  minRent: { type: Number },
  reportDocs: { type: String },
  deposit: { type: String }, // "none" / "daily"
  ageLimit: { type: Number },
  childrenFrom: { type: Number }, // если добавлен на фронте
  name: { type: String },         // если добавлен на фронте

  conveniences: [String],
  uploudImages: [String]
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);


