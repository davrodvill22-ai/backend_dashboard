require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Datos en memoria (simulando una base de datos)
let burgers = [
    { id: 1, name: 'Classic Burger', description: 'Carne de res, queso cheddar, lechuga, tomate y salsa de la casa.', price: 120 },
    { id: 2, name: 'Bacon BBQ Burger', description: 'Doble carne, tocino crujiente, aros de cebolla y salsa BBQ.', price: 160 },
    { id: 3, name: 'Spicy Jalapeño', description: 'Carne de res, queso pepper jack, jalapeños asados y aderezo picante.', price: 140 }
];

// Endpoint GET para obtener el listado (Protegido)
app.get('/api/burgers', authMiddleware, (req, res) => {
    res.json(burgers);
});

// Endpoint POST para agregar un nuevo elemento (Protegido)
app.post('/api/burgers', authMiddleware, (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios (name, description, price)' });
    }

    const newBurger = {
        id: burgers.length > 0 ? Math.max(...burgers.map(b => b.id)) + 1 : 1,
        name,
        description,
        price: parseFloat(price)
    };

    burgers.push(newBurger);
    res.status(201).json(newBurger);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend API corriendo en http://localhost:${PORT}`);
});
