const express = require('express');
const { nanoid } = require('nanoid');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');

const app = express();
const port = 3000;

let products = [
    { id: nanoid(6), name: 'Ноутбук Pro', category: 'Компьютеры', description: 'Мощный ноутбук для работы', price: 120000, stock: 5 },
    { id: nanoid(6), name: 'Смартфон X', category: 'Телефоны', description: 'Флагманский смартфон', price: 80000, stock: 10 },
    { id: nanoid(6), name: 'Наушники Bass', category: 'Аудио', description: 'Беспроводные наушники', price: 15000, stock: 20 },
    { id: nanoid(6), name: 'Монитор 4K', category: 'Компьютеры', description: 'Игровой монитор', price: 45000, stock: 3 },
    { id: nanoid(6), name: 'Клавиатура Mech', category: 'Аксессуары', description: 'Механическая клавиатура', price: 12000, stock: 15 },
    { id: nanoid(6), name: 'Мышь Wireless', category: 'Аксессуары', description: 'Эргономичная мышь', price: 5000, stock: 25 },
    { id: nanoid(6), name: 'Планшет Air', category: 'Планшеты', description: 'Легкий планшет', price: 60000, stock: 8 },
    { id: nanoid(6), name: 'Часы Smart', category: 'Гаджеты', description: 'Умные часы', price: 25000, stock: 12 },
    { id: nanoid(6), name: 'Камера 360', category: 'Фото', description: 'Камера для блогеров', price: 35000, stock: 4 },
    { id: nanoid(6), name: 'Колонка Mini', category: 'Аудио', description: 'Портативная колонка', price: 7000, stock: 30 },
];

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

let users = [
    {id: nanoid(6), name: 'Петр', age: 16},
    {id: nanoid(6), name: 'Иван', age: 18},
    {id: nanoid(6), name: 'Дарья', age: 20},
    ];

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления пользователями',
            version: '1.0.0',
            description: 'Простое API для управления пользователями',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *       example:
 *         id: "abc123"
 *         name: "Петр"
 *         age: 16
 */

function findUserOr404(id, res) {
    const user = users.find(u => u.id == id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return null;
    }
    return user;
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создает нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в теле запроса
 */

app.post("/api/users", (req, res) => {
    const { name, age } = req.body;
    if (!name || age === undefined) {
        return res.status(400).json({ error: "Name and age are required" });
    }
    const newUser = {
        id: nanoid(6),
        name: name.trim(),
        age: Number(age),
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

app.get("/api/users", (req, res) => {
    res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */

app.get("/api/users/:id", (req, res) => {
    const user = findUserOr404(req.params.id, res);
    if (!user) return;
    res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Пользователь не найден
 */

app.patch("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const user = findUserOr404(id, res);
    if (!user) return;
    if (req.body?.name === undefined && req.body?.age === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }
    const { name, age } = req.body;
    if (name !== undefined) user.name = name.trim();
    if (age !== undefined) user.age = Number(age);
    res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удален (нет тела ответа)
 *       404:
 *         description: Пользователь не найден
 */

app.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const exists = users.some((u) => u.id === id);
    if (!exists) return res.status(404).json({ error: "User not found" });
    users = users.filter((u) => u.id !== id);
    res.status(204).send();
});










function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category,
        description,
        price: Number(price),
        stock: Number(stock),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    const { name, category, description, price, stock } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });
    products = products.filter((p) => p.id !== id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});