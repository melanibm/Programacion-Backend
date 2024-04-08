class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios');
        }

        
        if (this.products.some(product => product.code === code)) {
            throw new Error('El código del producto ya existe');
        }

    
        const product = new Product(this.nextId++, title, description, price, thumbnail, code, stock);
        this.products.push(product);
        return product;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error('Este producto no existe en nuesto catálogo, intenta con otro código :)');
        }
    }
}
const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock
            };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`);
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, return an empty array
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            throw new Error(`Error getting product by ID: ${error.message}`);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            } else {
                throw new Error(`Product with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            products = products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}


module.exports = ProductManager;

const manager = new ProductManager();
manager.addProduct('Producto 1', 'Descripción del producto 1', 101, 'thumbnail1.jpg', 'P001', 102);
manager.addProduct('Producto 2', 'Descripción del producto 2', 50, 'thumbnail2.jpg', 'P002', 51);
console.log(manager.getProducts());
console.log(manager.getProductById(1));
console.log(manager.getProductById(3)); 

