/**
 * models/User.js
 * 
 * Модель пользователя для MongoDB (Mongoose)
 */

const mongoose = require('mongoose');

const getMoscowDate = () => {
    const now = new Date();
    const moscowOffsetMs = 3 * 60 * 60 * 1000;   // MSK = UTC+3
    return new Date(now.getTime() + moscowOffsetMs);
};

const moscowDate = getMoscowDate();

/**
 * Схема пользователя
 */
const UserSchema = new mongoose.Schema({

  // ====================== Основные данные из VK ======================
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

  photoUrl: { type: String, default: null },
  photo200: { type: String, default: null },

  city: { type: String, default: null, trim: true },
  country: { type: String, default: null, trim: true },

  sex: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },

  bdate: { type: String, default: null },

  // ====================== Академические и служебные данные ======================

  faculty: {
    type: String,
    default: "Факультет №9"
  },

  kafedra_postupleniya: {
    type: String,
    default: null,
    trim: true,
  },

  year_postupleniya: {
    type: String,
    default: null,
    trim: true
  },

  ref_code: {
    type: String,
    default: null,
    trim: true
  },

  // ==================== НОВЫЕ ПОЛЯ ИЗ ФОРМЫ ====================

  /** Категория пользователя */
  category: {
    type: String,
    default: null,
    enum: [
      null,
      'Представитель кафедры',
      'Курсант',
      'Представитель факультета',
      'Абитуриент (поступающий)'
    ]
  },

  /** Должность курсанта (появляется только для "Курсант") */
  unit: {
    type: String,
    default: null,
    enum: [
      null,
      'Курсант',
      'Командир отделения',
      'Командир учебной группы',
      'Старшина курса'
      // Добавляй новые должности сюда
    ]
  },

  /** Год набора */
  year_nabor: {
    type: String,
    default: null,
    enum: [null, '2021', '2022', '2023', '2024', '2025', '2026']
  },

  /** Факультет (номер) */
  fakultet: {
    type: String,
    default: null,
    enum: [null, '1', '2', '3', '4', '5', '6', '7', '8', '9']
  },

  /** Кафедра (номер) */
  kafedra: {
    type: String,
    default: null,
    enum: [null, '1', '2', '3', '4', '5', '6', '7']
  },

  /** Подгруппа / специализация */
  podgruppa: {
    type: String,
    default: null,
    enum: [
      null,
      '1',
      '2',
      '3',
      'Подгруппы нет (одна специализация)'
    ]
  },

  /** Пароль (хранить в открытом виде **не рекомендуется** — в будущем замени на hash) */
  password: {
    type: String,
    default: null,
    minlength: 4,
    maxlength: 10
  },

  /** Фамилия (дополнительная, если отличается от VK) */
  last_name: {
    type: String,
    default: null,
    trim: true
  },

  /** Имя */
  name: {
    type: String,
    default: null,
    trim: true
  },

  /** Отчество */
  middle_name: {
    type: String,
    default: null,
    trim: true
  },

  /** Номер телефона */
  phone_number: {
    type: String,
    default: null,
    trim: true
    // Можно добавить валидацию regex для российского номера, если нужно
  },

  // ====================== Служебные поля ======================

  isStudent: {
    type: Boolean,
    default: true
  },

  lastVisit: {
    type: Date,
    default: moscowDate
  },

  createdAt: {
    type: Date,
    default: moscowDate
  },

  updatedAt: {
    type: Date,
    default: moscowDate
  },

  Facts: {
        type: mongoose.Schema.Types.Mixed,   // позволяет хранить любой объект
        default: {}
    }

}, {
  timestamps: false   // отключаем встроенные, т.к. используем свои createdAt/updatedAt
});

/**
 * Middleware: обновляем updatedAt перед сохранением
 */
UserSchema.pre('save', function(next) {
  this.updatedAt = getMoscowDate();
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;