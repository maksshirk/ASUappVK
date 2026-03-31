const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  vkUserId: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  firstName: String,
  lastName: String,
  photoUrl: String,        // маленькое фото
  photo200: String,        // большое фото (если нужно)
  city: String,
  country: String,
  sex: Number,             // 0 - не указан, 1 - женский, 2 - мужской
  bdate: String,           // дата рождения

  // Дополнительные поля для твоего приложения
  faculty: { type: String, default: null },
  group: { type: String, default: null },
  isStudent: { type: Boolean, default: true },

  lastVisit: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);