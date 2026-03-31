const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User.js');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/facultyDB')
  .then(() => console.log('✅ MongoDB подключён'))
  .catch(err => console.error('❌ MongoDB ошибка:', err));

// === Главный эндпоинт для сохранения пользователя ===
app.post('/api/save-user', async (req, res) => {
  try {
    const { vkUserId, firstName, lastName, photoUrl, photo200, city, country, sex, bdate } = req.body;

    if (!vkUserId) {
      return res.status(400).json({ error: 'vkUserId обязателен' });
    }

    // Upsert — обновить если есть, создать если нет
    const user = await User.findOneAndUpdate(
      { vkUserId },
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
        lastVisit: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend запущен на http://localhost:${PORT}`);
});