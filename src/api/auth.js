const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const USER_FILE = path.join(__dirname, 'users.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'authorization работает!' });
});

router.post('/Valid', async(req, res) => {
    console.log('no error');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'error vvod'
            });
        };
        const data = await fs.readFile(USER_FILE, 'utf8'); //читаем юзеров
        const users = JSON.parse(data) //преобразуем юзеров из JSON в объектjs

        if (!(users.some(login => login.email === email))) {
            return res.status(400).json({
                success: false,
                message: 'no email'
            });
        };

        const user = users.find(login => login.email === email);

        if (!(user.password === password)) {
            return res.status(400).json({
                success: false,
                message: 'no password'
            });
        };

        res.status(201).json({
            success: true,
            message: 'Авторизация успешна!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
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

module.exports = router;