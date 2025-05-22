const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  objectName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  price: { type: Number, required: true },
  photos: [String], // ссылки на фото
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);
