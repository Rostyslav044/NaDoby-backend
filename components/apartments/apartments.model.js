


const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  objectName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  region: { type: String },
  originalCity: { type: String },
  city: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String }, // необязательное
  metro: { type: String },
  hasMetro: { type: Boolean },

  houseNumber: { type: String },

  price: { type: Number, required: true },
  minRent: { type: Number },       // минимум дней аренды
  deposit: { type: String },       // сумма или "none"
  reportDocs: { type: String },    // "yes" / "no"

  rooms: { type: Number },
  beds: { type: Number },
  size: { type: Number },
  floor: { type: Number },
  totalFloors: { type: Number },

  checkIn: { type: String },
  checkOut: { type: String },
  fullDayCheckIn: { type: String }, // "yes" / "no"
  smoking: { type: String },        // "yes" / "no"
  parties: { type: String },        // "yes" / "no"
  pets: { type: String },           // "yes" / "no"

  ageLimit: { type: Number },        // Возрастное ограничение (например, "21")
  kidsAge: { type: Number },         // Возраст ребёнка
  childrenFrom: { type: Number },    // С какого возраста дети разрешены

  name: { type: String },           // Имя (владелец или пользователь)
  phones: [String],                // Телефоны

  conveniences: [String],          // Удобства (checkbox)
  photos: [String],        
      
  uploudImages: [String],         // Необязательные изображения

  latitude: { type: Number },
  longitude: { type: Number },

  userId: { type: String, required: false}, // id пользователя

}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);





