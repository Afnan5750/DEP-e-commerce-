const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up static file serving for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'ecommerce', // Specify the database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB database');
});

mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to the database. \n${err}`);
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
});

const Product = mongoose.model('Product', productSchema);

// Seed product data from JSON file
const seedProducts = async () => {
    try {
        const filePath = path.join(__dirname, 'products.json');
        const productsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Convert local image paths to URLs
        productsData.forEach(product => {
            if (product.image.startsWith('images/')) {
                product.image = `http://localhost:${PORT}/images/${path.basename(product.image)}`;
            }
        });

        await Product.deleteMany({});
        await Product.insertMany(productsData);

        console.log('Product data seeded successfully');
    } catch (error) {
        console.error('Error seeding product data:', error);
    }
};

seedProducts();

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});


// Upload image endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ filePath: `/images/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
