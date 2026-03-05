const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const port = 3000;

// Начальные данные (10 товаров)
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

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Логирование
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Helper
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

// Routes
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

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});