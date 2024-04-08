const fs = require('fs');

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
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.nextId = 1;
        this.initialize();
    }

    async initialize() {
        try {
            const data = await this.getProductsFromFile();
            if (data) {
                this.products = data;
                this.nextId = Math.max(...this.products.map(product => product.id), 0) + 1;
            }
        } catch (error) {
            console.error('Error initializing product manager:', error.message);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Todos los campos son obligatorios');
            }
        
            if (this.products.some(product => product.code === code)) {
                throw new Error('El código del producto ya existe');
            }
        
            const product = new Product(this.nextId++, title, description, price, thumbnail, code, stock);
            this.products.push(product);
            await this.saveProductsToFile();
            return product;
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`);
        }
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error('Este producto no existe en nuesto catálogo, intenta con otro código :)');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedFields };
                await this.saveProductsToFile();
                return this.products[index];
            } else {
                throw new Error(`Product with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            this.products = this.products.filter(product => product.id !== id);
            await this.saveProductsToFile();
            return true;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async getProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            
            return null;
        }
    }

    async saveProductsToFile() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
}





module.exports = ProductManager;

