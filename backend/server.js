/**
 * server.js
 * 
 * Основной файл backend-сервера для VK Mini App факультета №9.
 * Отвечает за регистрацию пользователей и обновление их профиля.
 */

// ====================== 1. ЗАГРУЗКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ======================
// Должно быть в самом начале файла!
require('dotenv').config();

/**
 * require() — это способ подключения модулей в Node.js (CommonJS).
 * Мы подключаем внешние библиотеки и наш локальный файл модели.
 */

// express — основной фреймворк для создания HTTP-сервера
const express = require('express');

// mongoose — ODM (Object Data Modeling) для удобной работы с MongoDB
const mongoose = require('mongoose');

// cors — позволяет фронтенду (VK Mini App) делать запросы к серверу
const cors = require('cors');

// Подключаем модель пользователя
const User = require('./models/User');

/**
 * Создаём экземпляр Express-приложения.
 * Через этот объект мы настраиваем сервер и определяем маршруты.
 */
const app = express();

// ====================== MIDDLEWARE ======================

/**
 * cors() — разрешает кросс-доменные запросы.
 * origin: '*' — разрешает запросы с любого источника (удобно на этапе разработки).
 */
app.use(cors({ origin: '*' }));

/**
 * express.json() — парсит тело запроса в формате JSON.
 * Без этого middleware req.body будет undefined.
 */
app.use(express.json());

// ====================== ПОДКЛЮЧЕНИЕ К MONGODB ======================

/**
 * Получаем строку подключения из .env файла.
 * Если MONGO_URI не указан — используем локальную базу по умолчанию.
 */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/facultyDB';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB успешно подключён');
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
  });

// ====================== ЭНДПОИНТЫ ======================

/**
 * POST /api/user/me
 * Основной эндпоинт для авторизации пользователя из VK Mini App.
 * Создаёт пользователя, если его нет, или обновляет время последнего визита.
 */
app.post('/api/user/me', async (req, res) => {
  try {
    const { vkId, firstName, lastName, photoUrl } = req.body;

    if (!vkId) {
      return res.status(400).json({ error: 'vkId является обязательным полем' });
    }

    const user = await User.findOneAndUpdate(
      { vkId },
      {
        vkId,
        firstName,
        lastName,
        photoUrl,
        lastVisit: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(`👤 Пользователь ${vkId} авторизован`);
    res.json(user);

  } catch (error) {
    console.error('Ошибка в /api/user/me:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PUT /api/user/update
 * Обновляет дополнительные данные студента (группа, курс, специальность).
 */
app.put('/api/user/update', async (req, res) => {
  try {
    const { vkId, group, course, specialty } = req.body;

    if (!vkId) {
      return res.status(400).json({ error: 'vkId является обязательным полем' });
    }

    const user = await User.findOneAndUpdate(
      { vkId },
      {
        group: group?.trim(),
        course,
        specialty: specialty?.trim(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    console.log(`📝 Профиль пользователя ${vkId} обновлён`);
    res.json(user);

  } catch (error) {
    console.error('Ошибка в /api/user/update:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ====================== ЗАПУСК СЕРВЕРА ======================

/**
 * PORT берём из .env, если не указан — используем 5000 по умолчанию.
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend сервер успешно запущен`);
  console.log(`📍 Порт: ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`\nДоступные эндпоинты:`);
  console.log(`   POST → /api/user/me`);
  console.log(`   PUT  → /api/user/update`);
});