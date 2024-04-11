const express = require('express');
const ProductManager = require('./ProductManager');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());


app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi servidor!');
});


const productManager = new ProductManager('productos.json');

app.get('/api/products/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products/', async (req, res) => {
    const newProduct = req.body;
    try {
        const product = await productManager.addProduct(newProduct);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;
    try {
        const product = await productManager.updateProduct(productId, updatedFields);
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        await productManager.deleteProduct(productId);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
