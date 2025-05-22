const Apartment = require('./apartments.model');
const { uploadToGoogleCloud } = require('./apartmentsGoogleCloud');

const addApartment = async (req, res) => {
  try {
    const { objectName, category, description, city, street, price } = req.body;

    const photoUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const url = await uploadToGoogleCloud(file);
        photoUrls.push(url);
      }
    }

    const apartment = new Apartment({
      objectName,
      category,
      description,
      city,
      street,
      price,
      photos: photoUrls,
    });

    await apartment.save();

    res.status(201).json({ message: 'Объявление успешно добавлено', apartment });
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении объявления' });
  }
};

module.exports = { addApartment };
