/**
 * models/User.js
 * 
 * Модель пользователя для MongoDB (Mongoose)
 * 
 * Хранит данные студентов факультета №9, полученные из VK Mini App,
 * а также дополнительную информацию (группа, курс и т.д.).
 */

const mongoose = require('mongoose');

/**
 * Схема пользователя
 * Определяет структуру документа в коллекции "users"
 */
const UserSchema = new mongoose.Schema({

  // ====================== Данные из VK ======================

  /**
   * vkUserId — уникальный идентификатор пользователя ВКонтакте
   * Используется как основной ключ для поиска и обновления
   */
  vkUserId: {
    type: Number,
    required: true,
    unique: true,           // Не может быть двух пользователей с одинаковым ID
    index: true             // Ускоряет поиск по этому полю
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

  /**
   * photoUrl и photo200 — аватары разного размера
   * photo200 — более качественная версия (рекомендуется использовать)
   */
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

  /**
   * sex — пол пользователя
   * 0 — не указан, 1 — женский, 2 — мужской
   */
  sex: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },

  /**
   * bdate — дата рождения в формате "DD.MM.YYYY"
   */
  bdate: {
    type: String,
    default: null
  },

  // ====================== Данные для приложения ======================

  /**
   * faculty — факультет (по умолчанию №9)
   */
  faculty: {
    type: String,
    default: "Факультет №9"
  },

  /**
   * group — учебная группа
   * Пример: "ИК-21-1", "ИВТ-22-3"
   */
  group: {
    type: String,
    default: null,
    trim: true
  },

  /**
   * course — курс обучения
   */
  course: {
    type: String,
    enum: ['1', '2', '3', '4', '5', null],
    default: null
  },

  /**
   * specialty — специальность / направление подготовки
   */
  specialty: {
    type: String,
    default: null,
    trim: true
  },

  /**
   * isStudent — флаг, является ли пользователь студентом
   */
  isStudent: {
    type: Boolean,
    default: true
  },

  // ====================== Служебные поля ======================

  /**
   * lastVisit — дата и время последнего входа в приложение
   */
  lastVisit: {
    type: Date,
    default: Date.now
  },

  /**
   * createdAt — дата регистрации пользователя в системе
   */
  createdAt: {
    type: Date,
    default: Date.now
  },

  /**
   * updatedAt — дата последнего обновления данных
   */
  updatedAt: {
    type: Date,
    default: Date.now
  }

}, {
  // Автоматически обновляет updatedAt при изменении документа
  timestamps: true
});

/**
 * Создаём и экспортируем модель
 * 
 * Название 'User' → в MongoDB коллекция будет называться "users" (во множественном числе)
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;