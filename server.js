const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

/* =========================
   НАСТРОЙКИ
========================= */

const PORT = process.env.PORT || 3000;
const UFC_API = "https://api.ufcalendar.com/v1";
const API_KEY = process.env.UFC_API_KEY;


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());


/* =========================
   СТАТИЧЕСКИЕ ФАЙЛЫ САЙТА
========================= */

app.use(express.static(path.join(__dirname)));


/* =========================
   ЗАПРОС К UFC API
========================= */

async function ufcRequest(endpoint) {
    if (!API_KEY) {
        throw new Error(
            "UFC_API_KEY не найден. Проверь переменную окружения."
        );
    }

    const response = await fetch(UFC_API + endpoint, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Accept": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(
            "UFCalendar ошибка:",
            response.status,
            data
        );

        throw new Error(
            data?.error?.message ||
            data?.message ||
            `UFCalendar API error ${response.status}`
        );
    }

    return data;
}


/* =========================
   ПРОВЕРКА СЕРВЕРА
========================= */

app.get("/api/test", (req, res) => {
    res.json({
        ok: true,
        message: "UFC Fight Center server работает!"
    });
});


/* =========================
   ПОИСК БОЙЦОВ
========================= */

app.get("/api/fighters", async (req, res) => {
    try {
        const q = req.query.q || "";

        if (!q.trim()) {
            return res.status(400).json({
                error: "Введите имя бойца"
            });
        }

        const data = await ufcRequest(
            `/fighters?q=${encodeURIComponent(q)}&org=ufc&limit=20`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка поиска бойца:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   ПРОФИЛЬ БОЙЦА
========================= */

app.get("/api/fighters/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ufcRequest(
            `/fighters/${encodeURIComponent(id)}`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка профиля бойца:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   ИСТОРИЯ БОЙЦА
========================= */

app.get("/api/fighters/:id/history", async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ufcRequest(
            `/fighters/${encodeURIComponent(id)}/history`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка истории бойца:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   СТАТИСТИКА БОЙЦА
========================= */

app.get("/api/fighters/:id/stats", async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ufcRequest(
            `/fighters/${encodeURIComponent(id)}/stats`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка статистики бойца:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   РЕЙТИНГ БОЙЦА
========================= */

app.get("/api/fighters/:id/rankings", async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ufcRequest(
            `/fighters/${encodeURIComponent(id)}/rankings`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка рейтинга бойца:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   БЛИЖАЙШИЕ UFC СОБЫТИЯ
========================= */

app.get("/api/events", async (req, res) => {
    try {
        const data = await ufcRequest(
            "/events?org=ufc&status=upcoming&include=headline&limit=20"
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка загрузки событий:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   КОНКРЕТНОЕ UFC СОБЫТИЕ
========================= */

app.get("/api/events/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ufcRequest(
            `/events/${encodeURIComponent(id)}?include=eta`
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка загрузки события:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   UFC РЕЙТИНГИ
========================= */

app.get("/api/rankings", async (req, res) => {
    try {
        const data = await ufcRequest(
            "/rankings/ufc"
        );

        res.json(data);

    } catch (error) {
        console.error("Ошибка загрузки рейтингов:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   ГЛАВНАЯ СТРАНИЦА
========================= */

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});


/* =========================
   ЗАПУСК СЕРВЕРА
========================= */

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("================================");
    console.log(" UFC FIGHT CENTER SERVER");
    console.log(` Порт: ${PORT}`);
    console.log("================================");
    console.log("");
});