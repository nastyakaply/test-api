const express = require('express'); //импортнули модуль для создания API
const fs = require('fs').promises; //импортнули модуль для работы с файловой системой с промис оберткой(асинхронная работа)
const path = require('path'); //для создания файла
const cors = require('cors'); //импортнули модуль для безопасного обмена данными
// const http = require('http'); // для WebSocket
// const WebSocket = require('ws');

//init app с портом 3000
const app = express();
const PORT = 3000;
// файл для хранения пользователей
const USER_FILE = path.join(__dirname, 'users.json'); //строим путь (абсолютный) к файлу users.json

app.use(cors()); //подключаем модули к приложухе
app.use(express.json());

// Главная страница - та что появится при загрузке сервера npm start из  ...\api-test-app\src\api
app.get('/', (req, res) => {
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
app.post('/api/register', async(req, res) => {
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

        // // ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ ЧЕРЕЗ WEBSOCKET
        // broadcastToAll({
        //     type: 'user_registered',
        //     user: { id: newUser.id, name: newUser.name, email: newUser.email }
        // });

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
app.get('/api/users', async(req, res) => {
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

// // ========== WebSocket часть (НОВОЕ) ==========

// // Создаем HTTP сервер из Express app
// const server = http.createServer(app);

// // Создаем WebSocket сервер на другом порту (3001)
// const wss = new WebSocket.Server({ port: 3001 });

// // Храним всех подключенных клиентов
// const clients = new Set();

// // Функция для отправки сообщения всем клиентам
// function broadcastToAll(message) {
//     const messageStr = JSON.stringify(message);
//     clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(messageStr);
//         }
//     });
// }

// // Обработка WebSocket подключений
// wss.on('connection', (ws) => {
//     console.log('Новый WebSocket клиент подключился');

//     // Добавляем клиента в список
//     clients.add(ws);

//     // Отправляем приветственное сообщение
//     ws.send(JSON.stringify({
//         type: 'welcome',
//         message: 'Добро пожаловать в WebSocket!',
//         timestamp: new Date().toISOString(),
//         onlineUsers: clients.size
//     }));

//     // Обработка сообщений от клиента
//     ws.on('message', (message) => {
//         try {
//             const data = JSON.parse(message);
//             console.log('Получено WebSocket сообщение:', data);

//             // Пример: чат
//             if (data.type === 'chat') {
//                 broadcastToAll({
//                     type: 'chat_message',
//                     from: data.from || 'Аноним',
//                     text: data.text,
//                     timestamp: new Date().toISOString()
//                 });
//             }

//             // Пример: уведомление о действии
//             if (data.type === 'action') {
//                 broadcastToAll({
//                     type: 'user_action',
//                     action: data.action,
//                     user: data.user,
//                     timestamp: new Date().toISOString()
//                 });
//             }

//         } catch (error) {
//             console.error('Ошибка обработки WebSocket сообщения:', error);
//         }
//     });

//     // Обработка отключения клиента
//     ws.on('close', () => {
//         console.log('WebSocket клиент отключился');
//         clients.delete(ws);

//         // Уведомляем остальных
//         broadcastToAll({
//             type: 'user_left',
//             onlineUsers: clients.size,
//             timestamp: new Date().toISOString()
//         });
//     });
// });

// // Запуск сервера
// server.listen(PORT, async () => {
//     await initUsersFile();
//     console.log('='.repeat(50));
//     console.log('Сервер запущен!');
//     console.log(`REST API: http://localhost:${PORT}`);
//     console.log(`WebSocket: ws://localhost:3001`);
//     console.log('='.repeat(50));
// });

app.listen(PORT, async() => { //запуск сервера в ожидании запросов
    await initUsersFile();
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});