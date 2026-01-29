const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const USER_FILE = path.join(__dirname, 'users.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Сервер регистрации работает!',
        endpoints: [
            'GET  / - эта Главная страница ',
            'GET  /api/users - список всех пользователей',
            'POST /api/register - регистрация нового пользователя',
            // 'WS   ws://localhost:3001 - WebSocket соединение'
        ]
    });
});

//создаем файл, если его нет
async function initUsersFile() { //функция async/await
    try {
        await fs.access(USER_FILE); //проверяем доступ к файлу
    } catch {
        await fs.writeFile(USER_FILE, JSON.stringify([])); //запись в файл в формате JSON
    }
}


//регаем нового пользователя
router.post('/rererererer', async(req, res) => {
    console.log('=== НАЧАЛО ОБРАБОТКИ /api/register ===');
    console.log('Метод:', req.method);
    console.log('Заголовок:', req.headers['content-type']);
    console.log('Тело:', req.body);
    console.log('====================================');
    try {
        const { name, email, password } = req.body; // заносим данные в словарь с ключами из тела запроса от пользователя

        if (!name || !email || !password) { // если хотя бы одно поле пустое
            return res.status(400).json({ // получаем ошибку 400 
                success: false, // состояние
                message: 'Все поля обязательны' // сообщение
            });
        };

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Пароль должен быть не менее 6 символов'
            });
        };

        const data = await fs.readFile(USER_FILE, 'utf8'); //читаем юзеров
        const users = JSON.parse(data) //преобразуем юзеров из JSON в объектjs

        // проверим на совпадение почты
        if (users.some(user => user.email === email)) { //проверяем есть ли в массиве юзеров почта
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        };

        // создадим нового юзера (объект с полями: id, name, email, password, createdAt)
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString() // преобразует объект даты в строку в формате ISO YYYY-MM-DDTHH:mm:ss.sssZ 
        };

        users.push(newUser); // добавим его в массив юзеров
        // запишем в файл
        await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});

//получим всех пользователей
router.get('/users', async(req, res) => {
    console.log('=== НАЧАЛО ОБРАБОТКИ /api/users ===');
    console.log('Метод:', req.method);
    console.log('====================================');
    try {
        const data = await fs.readFile(USER_FILE, 'utf8'); // считываем данные файлы
        const users = JSON.parse(data); // преобразуем их в формат js

        if (!users || (Array.isArray(users) && users.length === 0)) {
            return res.status(404).json({
                success: false,
                message: 'Данные пользователей не найдены'
            });

        };

        const usersWithoutPassword = users.map(user => ({ //получим данные пользователей (без пароля)
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }));

        res.json(usersWithoutPassword); //полученные данные отправляем в формате JSON
    } catch (error) {
        res.status(500).json({
            error: 'Ошибка чтения данных'
        });
    }
});


module.exports = router;