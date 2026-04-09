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
                updatedAt: moscowDate,
                Facts: {}
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
        const { vkUserId, 
            category, 
            unit, 
            year_nabor, 
            fakultet, 
            kafedra, 
            podgruppa, 
            password, 
            last_name, 
            name, 
            middle_name, 
            phone_number, 
            kafedra_postupleniya,
            year_postupleniya,
            ref_code } = req.body;

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
                
                password: password || null, 
                kafedra_postupleniya: kafedra_postupleniya || null,
                year_postupleniya: year_postupleniya || null,
                ref_code: ref_code || null,          // В будущем здесь должен быть hash!
                
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





app.post('/api/doklad', async (req, res) => {
    try {
        const { vkUserId } = req.body;

        if (!vkUserId) {
            console.log('❌ [doklad] vkUserId отсутствует');
            return res.status(400).json({ error: 'vkUserId обязателен' });
        }

        const now = new Date();
        const hour = now.getHours();
        const period = (hour >= 0 && hour <= 12) ? "morning" : "evening";

        const timeStr = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });

        const dateStr = now.toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\./g, '-');

        console.log(`📋 [doklad] Обработка | vkUserId=${vkUserId} | ${dateStr} | ${period}`);

        // 1. Получаем текущий номер
        let userDoc = await User.findOne({ vkUserId });

        let number = 0;
        if (userDoc?.Facts?.[dateStr]?.[`number ${period}`]) {
            number = userDoc.Facts[dateStr][`number ${period}`].number || 0;
        }
        number += 1;

        const counterKey = `Facts.${dateStr}.number ${period}`;
        const factKey = `Facts.${dateStr}.${number} ${period}`;

        // === ИСПРАВЛЕНИЕ: Делаем два отдельных обновления ===

        // Сначала гарантируем, что поле Facts существует
        await User.updateOne(
            { vkUserId },
            { $setOnInsert: { Facts: {} } },
            { upsert: true }
        );

        // Обновляем счётчик
        await User.updateOne(
            { vkUserId },
            { $set: { [counterKey]: { number: number } } }
        );

        // Сохраняем сам доклад
        await User.updateOne(
            { vkUserId },
            {
                $set: {
                    [factKey]: {
                        time: timeStr,
                        number: number,
                        type: "doklad",
                        period: period,
                        submittedAt: now
                    }
                }
            }
        );

        console.log(`✅ [doklad] Успешно сохранён доклад №${number} (${period})`);

        const updatedUser = await User.findOne({ vkUserId }).lean();

        res.json({
            success: true,
            message: `Доклад №${number} успешно сохранён`,
            factNumber: number,
            period,
            date: dateStr
        });

    } catch (error) {
        console.error('❌ Ошибка в /api/doklad:', error);
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