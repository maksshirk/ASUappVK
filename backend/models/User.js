/**
 * models/User.js
 * 
 * Модель пользователя для MongoDB (Mongoose)
 * 
 * Хранит данные студентов факультета №9, полученные из VK Mini App,
 * а также дополнительную академическую информацию.
 */

const mongoose = require('mongoose');

/**
 * Схема пользователя
 */
const UserSchema = new mongoose.Schema({

  // ====================== Основные данные из VK ======================

  /**
   * vkUserId — уникальный идентификатор пользователя ВКонтакте
   * Основной ключ для идентификации пользователя
   */
  vkUserId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  photoUrl: {
    type: String,
    default: null
  },

  photo200: {
    type: String,
    default: null
  },

  city: {
    type: String,
    default: null,
    trim: true
  },

  country: {
    type: String,
    default: null,
    trim: true
  },

  sex: {
    type: Number,
    enum: [0, 1, 2],        // 0 - не указан, 1 - женский, 2 - мужской
    default: 0
  },

  bdate: {
    type: String,
    default: null
  },

  // ====================== Академические данные ======================

  faculty: {
    type: String,
    default: "Факультет №9"
  },

  /**
   * group — учебная группа студента
   * Пример: "ИК-21-1", "ПИ-22-3"
   */
  group: {
    type: String,
    default: null,
    trim: true,
    uppercase: true          // автоматически переводит в верхний регистр
  },

  course: {
    type: String,
    enum: ['1', '2', '3', '4', '5', null],
    default: null
  },

  specialty: {
    type: String,
    default: null,
    trim: true
  },

  // ====================== Служебные поля ======================

  isStudent: {
    type: Boolean,
    default: true
  },

  lastVisit: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

}, {
  // Автоматически обновляет поле updatedAt при каждом сохранении
  timestamps: true
});

/**
 * Создание модели
 * 
 * 'User' — имя модели
 * В MongoDB коллекция будет называться "users" (множественное число)
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;