const express = require('express'); //импортнули модуль для создания API
const fs = require('fs').promises; //импортнули модуль для работы с файловой системой с промис оберткой(асинхронная работа)
const path = require('path'); //для создания файла
const cors = require('cors'); //импортнули модуль для безопасного обмена данными


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
            'POST /api/register - регистрация нового пользователя'
        ],
        instructions: {
            register: 'Отправьте POST запрос на /api/register с JSON телом: { name: ..., email: ..., password: ...}',
            getUsers: 'Отправьте GET запрос на /api/users'
        }
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
app.post('/api/register', async (req, res) => {
    try {
        const {name, email, password} = req.body; // заносим данные в словарь с ключами из тела запроса от пользователя

        if (!name || !email || !password) { // если хотя бы одно поле пустое
            return res.status(400).json({   // получаем ошибку 400 
                success: false,             // состояние
                message: 'Все поля обязательны' // сообщение
            });
        };

        if (password.length < 6) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Пароль должен быть не менее 6 символов'
                }
            );
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
            message: 'Регистрация успешна',
            user: {
                id: newUser.id, 
                name: newUser.name, 
                email: newUser.email}
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
app.get('/api/users', async (req, res) => {
    try {
        const data = await fs.readFile(USER_FILE, 'utf8'); // считываем данные файлы
        const users = JSON.parse(data); // преобразуем их в формат js

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

app.listen(PORT, async () => { //запуск сервера в ожидании запросов
    await initUsersFile();
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});





