/**
 * server.js
 * 
 * Backend-сервер для VK Mini App факультета №9.
 * Отвечает за сохранение данных пользователей из VK и обновление профиля.
 */

// ====================== 1. ЗАГРУЗКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ======================
require('dotenv').config();   // Должно быть в самом начале!

// ====================== 2. ПОДКЛЮЧЕНИЕ МОДУЛЕЙ ======================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Подключаем модель пользователя
const User = require('./models/User');

// ====================== 3. ИНИЦИАЛИЗАЦИЯ ======================
const app = express();

// ====================== 4. MIDDLEWARE ======================
app.use(cors({ origin: '*' }));           // Разрешаем запросы с VK Mini App
app.use(express.json());                  // Парсим JSON из req.body

// ====================== 5. ПОДКЛЮЧЕНИЕ К MONGODB ======================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/facultyDB';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB успешно подключён'))
  .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err.message));

// ====================== 6. ЭНДПОИНТЫ ======================

/**
 * POST /api/save-user
 * Основной эндпоинт для сохранения пользователя из VK Mini App.
 * Используется в App.tsx при запуске приложения.
 */
app.post('/api/save-user', async (req, res) => {
  try {
    const { 
      vkUserId, 
      firstName, 
      lastName, 
      photoUrl, 
      photo200, 
      city, 
      country, 
      sex, 
      bdate 
    } = req.body;

    if (!vkUserId) {
      return res.status(400).json({ error: 'vkUserId обязателен' });
    }

    const user = await User.findOneAndUpdate(
      { vkUserId },                    // поиск по vkUserId
      {
        vkUserId,
        firstName,
        lastName,
        photoUrl,
        photo200,
        city: city?.title || city,
        country: country?.title || country,
        sex,
        bdate,
        lastVisit: new Date(),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(`👤 Пользователь ${vkUserId} успешно сохранён/обновлён`);
    res.json({ success: true, user });

  } catch (error) {
    console.error('Ошибка в /api/save-user:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PUT /api/user/update
 * Обновляет академические данные студента (группа, курс, специальность)
 * Используется во вкладке "Профиль"
 */
app.put('/api/user/update', async (req, res) => {
  try {
    const { vkUserId, group, course, specialty } = req.body;

    if (!vkUserId) {
      return res.status(400).json({ error: 'vkUserId обязателен' });
    }

    const user = await User.findOneAndUpdate(
      { vkUserId },
      {
        group: group?.trim(),
        course,
        specialty: specialty?.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    console.log(`📝 Профиль пользователя ${vkUserId} обновлён`);
    res.json(user);

  } catch (error) {
    console.error('Ошибка в /api/user/update:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ====================== 7. ЗАПУСК СЕРВЕРА ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend сервер запущен на порту ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`\n📌 Доступные эндпоинты:`);
  console.log(`   POST → /api/save-user`);
  console.log(`   PUT  → /api/user/update`);
});