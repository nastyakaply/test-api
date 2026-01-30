const express = require("express");
const cors = require("cors");
const authRouter = require("./auth");
const regRouter = require("./index");
const nameRouter = require("./name");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/reg', regRouter);
app.use('/api/profile', nameRouter);

app.listen(PORT, async() => { //запуск сервера в ожидании запросов
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});