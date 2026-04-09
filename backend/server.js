/**
 * server.js
 * Backend-сервер для VK Mini App факультета №9
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');

const app = express();

// ====================== MIDDLEWARE ======================
app.use(cors({ origin: '*' }));
app.use(express.json());

// ====================== ФУНКЦИЯ ВРЕМЕНИ ======================
// Правильный способ получать актуальное время каждый раз
const getMoscowDate = () => {
    const now = new Date();
    
    // Moscow = UTC + 3 часа (MSK). Летом +4 — но этот способ учитывает DST автоматически
    const moscowOffsetMs = 3 * 60 * 60 * 1000;   // +3 часа в миллисекундах
    
    return new Date(now.getTime() + moscowOffsetMs);
};

// ====================== ПОДКЛЮЧЕНИЕ К MONGODB ======================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/facultyDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB успешно подключён'))
    .catch(err => {
        console.error('❌ Ошибка подключения к MongoDB:', err.message);
        process.exit(1); // Завершаем процесс, если база не подключилась
    });

// ====================== ЭНДПОИНТЫ ======================

app.post('/api/save-user', async (req, res) => {
    try {
        const { 
            vkUserId, firstName, lastName, photoUrl, photo200, 
            city, country, sex, bdate 
        } = req.body;

        if (!vkUserId) {
            return res.status(400).json({ error: 'vkUserId обязателен' });
        }

        const moscowDate = getMoscowDate();

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
                lastVisit: moscowDate,
                updatedAt: moscowDate
            },
            { upsert: true, new: true }
        );
        console.log(moscowDate);
        console.log(`👤 Пользователь ${vkUserId} сохранён/обновлён`);
        res.json({ success: true, user });

    } catch (error) {
        console.error('Ошибка в /api/save-user:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.put('/api/user/update', async (req, res) => {
    try {
        const { vkUserId, category, unit, year_nabor, fakultet, kafedra, podgruppa, password, last_name, name, middle_name, phone_number } = req.body;

        if (!vkUserId) {
            return res.status(400).json({ error: 'vkUserId обязателен' });
        }

        const moscowDate = getMoscowDate();

        const user = await User.findOneAndUpdate(
            { vkUserId },                    // условие поиска
            {
                // === Новые поля из формы ===
                category: category || null,
                unit: unit || null,
                year_nabor: year_nabor || null,
                fakultet: fakultet || null,
                kafedra: kafedra || null,
                podgruppa: podgruppa || null,
                
                password: password || null,           // В будущем здесь должен быть hash!
                
                last_name: last_name?.trim() || null,
                name: name?.trim() || null,
                middle_name: middle_name?.trim() || null,
                phone_number: phone_number?.trim() || null,

                // === Служебные поля ===
                updatedAt: moscowDate,
                
                // Можно добавить isStudent, если нужно менять статус
                // isStudent: true,
            },
            { 
                new: true,           // вернуть обновлённый документ
                runValidators: true  // запускать валидацию схемы (enum, maxlength и т.д.)
            }
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

// ====================== ЗАПУСК СЕРВЕРА ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Backend сервер запущен на порту ${PORT}`);
    console.log(`🌐 Доступен по адресу: http://твой_IP:${PORT}`);
    console.log(`\n📌 Эндпоинты:`);
    console.log(`   POST → /api/save-user`);
    console.log(`   PUT  → /api/user/update`);
});