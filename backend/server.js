/**
 * server.js
 * 
 * Основной файл backend-сервера для VK Mini App факультета №9.
 * 
 * Этот файл запускает Express-сервер, подключается к MongoDB
 * и обрабатывает запросы от мобильного приложения.
 */

// ==================== ПОДКЛЮЧЕНИЕ МОДУЛЕЙ (require) ====================
require('dotenv').config();
/**
 * require() — это функция Node.js, которая позволяет импортировать модули.
 * Она загружает внешние библиотеки или локальные файлы.
 */

// express — фреймворк для создания веб-сервера
const express = require('express');

// mongoose — библиотека для работы с MongoDB (удобная работа со схемами)
const mongoose = require('mongoose');

// cors — позволяет фронтенду (VK Mini App) делать запросы к нашему серверу
const cors = require('cors');

// Подключаем нашу модель пользователя из папки models
// .js можно не указывать, Node.js сам поймёт
const User = require('./models/User');

/**
 * Создаём экземпляр Express-приложения.
 * app — это наш веб-сервер, через который мы будем обрабатывать запросы.
 */
const app = express();

// ==================== MIDDLEWARE (промежуточное ПО) ====================

/**
 * cors() — разрешает кросс-доменные запросы.
 * origin: '*' — разрешает запросы с любого сайта (удобно для разработки).
 * В продакшене лучше указывать конкретный адрес вашего VK Mini App.
 */
app.use(cors({ origin: '*' }));

/**
 * express.json() — важный middleware.
 * Он автоматически преобразует JSON из тела запроса (req.body) в JavaScript-объект.
 * Без него req.body будет undefined.
 */
app.use(express.json());

// ==================== ПОДКЛЮЧЕНИЕ К MONGODB ====================
const MONGO_URI = process.env.MONGO_URI
/**
 * mongoose.connect() — подключается к базе данных MongoDB.
 * 
 * mongodb://127.0.0.1:27017/facultyDB
 * 127.0.0.1 — это localhost
 * 27017 — стандартный порт MongoDB
 * facultyDB — имя нашей базы данных (создастся автоматически)
 */
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB успешно подключён к базе facultyDB'))
  .catch((err) => console.error('❌ Ошибка подключения к MongoDB:', err.message));

// ==================== ЭНДПОИНТЫ (маршруты) ====================

/**
 * POST /api/user/me
 * 
 * Этот маршрут используется при открытии вкладки "Профиль".
 * Он либо создаёт нового пользователя, либо возвращает существующего.
 */
app.post('/api/user/me', async (req, res) => {
  try {
    const { vkId, firstName, lastName, photoUrl } = req.body;

    if (!vkId) {
      return res.status(400).json({ error: 'vkId является обязательным полем' });
    }

    // findOneAndUpdate с upsert: true — очень удобный паттерн:
    // если пользователь с таким vkId уже есть — обновляем его,
    // если нет — создаём нового.
    const user = await User.findOneAndUpdate(
      { vkId },
      {
        vkId,
        firstName,
        lastName,
        photoUrl,
        lastVisit: new Date(),        // обновляем время последнего входа
      },
      { upsert: true, new: true }
    );

    console.log(`👤 Пользователь ${vkId} успешно авторизован`);
    res.json(user);

  } catch (error) {
    console.error('Ошибка в /api/user/me:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * PUT /api/user/update
 * 
 * Обновляет дополнительную информацию о студенте:
 * группу, курс и специальность.
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

// ==================== ЗАПУСК СЕРВЕРА ====================

const PORT = process.env.PORT || 5000;

/**
 * app.listen() — запускает сервер и начинает прослушивать указанный порт.
 * '0.0.0.0' — позволяет принимать запросы не только с localhost,
 * но и с других устройств в сети (важно для тестирования на телефоне).
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend сервер успешно запущен`);
  console.log(`📍 Порт: ${PORT}`);
  console.log(`🌐 Адрес: http://localhost:${PORT}`);
  console.log(`\n📌 Доступные эндпоинты:`);
  console.log(`   POST → /api/user/me`);
  console.log(`   PUT  → /api/user/update`);
});