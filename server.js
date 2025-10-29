const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

// Initialize Firebase Admin
let db = null;
try {
    let serviceAccount;
    
    // Try environment variables first (for Vercel deployment)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        console.log('🔧 Initializing Firebase from environment variables...');
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Handle escaped newlines
        };
    } 
    // Fall back to service account file (for local development)
    else if (require('fs').existsSync('./serviceAccountKey.json')) {
        console.log('🔧 Initializing Firebase from serviceAccountKey.json...');
        serviceAccount = require('./serviceAccountKey.json');
    }
    
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log('✅ Firebase Admin initialized successfully');
    } else {
        throw new Error('No Firebase credentials found');
    }
} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.log('⚠️  Falling back to JSON file storage');
    console.log('💡 To use Firebase on Vercel, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY as environment variables');
}

// Simple file-based database for persistence
const fs = require('fs');

const USERS_FILE = path.join(__dirname, 'users.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const AGRICULTURISTS_FILE = path.join(__dirname, 'agriculturists.json');

// Data storage - use Firestore if available, otherwise fallback to JSON files
let mockUsers = new Map();
let products = [];
let orders = [];
let agriculturists = [];

// Load data from Firestore or JSON files
async function loadDataFromStorage() {
    if (db) {
        // Load from Firestore
        try {
            // Load users
            const usersSnapshot = await db.collection('users').get();
            mockUsers = new Map();
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                mockUsers.set(userData.uid, userData);
            });
            console.log('✅ Loaded', mockUsers.size, 'users from Firestore');
            
            // Load products
            const productsSnapshot = await db.collection('products').get();
            products = [];
            productsSnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            console.log('✅ Loaded', products.length, 'products from Firestore');
            
            // Load orders
            const ordersSnapshot = await db.collection('orders').get();
            orders = [];
            ordersSnapshot.forEach(doc => {
                orders.push({ id: doc.id, ...doc.data() });
            });
            console.log('✅ Loaded', orders.length, 'orders from Firestore');
            
            // Load agriculturists
            const agriculturistsSnapshot = await db.collection('agriculturists').get();
            agriculturists = [];
            agriculturistsSnapshot.forEach(doc => {
                agriculturists.push({ id: doc.id, ...doc.data() });
            });
            console.log('✅ Loaded', agriculturists.length, 'agriculturists from Firestore');
            
            // Migrate existing JSON data to Firestore if Firestore is empty but JSON files exist
            if (mockUsers.size === 0 && fs.existsSync(USERS_FILE)) {
                console.log('🔄 Migrating users from JSON to Firestore...');
                const data = fs.readFileSync(USERS_FILE, 'utf8');
                const usersArray = JSON.parse(data);
                for (const [uid, userData] of usersArray) {
                    await db.collection('users').doc(uid).set(userData);
                    mockUsers.set(uid, userData);
                }
                console.log('✅ Migrated', mockUsers.size, 'users to Firestore');
            }
            
            if (products.length === 0 && fs.existsSync(PRODUCTS_FILE)) {
                console.log('🔄 Migrating products from JSON to Firestore...');
                const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
                const productsData = JSON.parse(data);
                const batch = db.batch();
                for (const product of productsData.products || []) {
                    const productRef = db.collection('products').doc(product.id || Date.now().toString());
                    batch.set(productRef, product);
                    products.push({ id: productRef.id, ...product });
                }
                await batch.commit();
                console.log('✅ Migrated', products.length, 'products to Firestore');
            }
            
            if (orders.length === 0 && fs.existsSync(ORDERS_FILE)) {
                console.log('🔄 Migrating orders from JSON to Firestore...');
                const data = fs.readFileSync(ORDERS_FILE, 'utf8');
                const ordersData = JSON.parse(data);
                const batch = db.batch();
                for (const order of ordersData.orders || []) {
                    const orderRef = db.collection('orders').doc(order.id || Date.now().toString());
                    batch.set(orderRef, order);
                    orders.push({ id: orderRef.id, ...order });
                }
                await batch.commit();
                console.log('✅ Migrated', orders.length, 'orders to Firestore');
            }
            
            if (agriculturists.length === 0 && fs.existsSync(AGRICULTURISTS_FILE)) {
                console.log('🔄 Migrating agriculturists from JSON to Firestore...');
                const data = fs.readFileSync(AGRICULTURISTS_FILE, 'utf8');
                const agriculturistsData = JSON.parse(data);
                const batch = db.batch();
                for (const agriculturist of agriculturistsData.agriculturists || []) {
                    const agriculturistRef = db.collection('agriculturists').doc(agriculturist.id || Date.now().toString());
                    batch.set(agriculturistRef, agriculturist);
                    agriculturists.push({ id: agriculturistRef.id, ...agriculturist });
                }
                await batch.commit();
                console.log('✅ Migrated', agriculturists.length, 'agriculturists to Firestore');
            }
            
        } catch (error) {
            console.error('❌ Error loading from Firestore:', error);
            console.log('⚠️  Falling back to JSON file storage');
            loadDataFromJSONFiles();
        }
    } else {
        // Fallback to JSON files
        loadDataFromJSONFiles();
    }
}

// Load data from JSON files (fallback)
function loadDataFromJSONFiles() {
    try {
        // Load users
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            const usersArray = JSON.parse(data);
            mockUsers = new Map(usersArray);
            console.log('📄 Loaded', mockUsers.size, 'users from JSON file');
        }
    } catch (error) {
        console.log('No existing users file, starting fresh');
    }
    
    try {
        // Load products
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            const productsData = JSON.parse(data);
            products = productsData.products || [];
            console.log('📄 Loaded', products.length, 'products from JSON file');
        }
    } catch (error) {
        console.log('No existing products file, starting fresh');
    }
    
    try {
        // Load orders
        if (fs.existsSync(ORDERS_FILE)) {
            const data = fs.readFileSync(ORDERS_FILE, 'utf8');
            const ordersData = JSON.parse(data);
            orders = ordersData.orders || [];
            console.log('📄 Loaded', orders.length, 'orders from JSON file');
        }
    } catch (error) {
        console.log('No existing orders file, starting fresh');
    }
    
    try {
        // Load agriculturists
        if (fs.existsSync(AGRICULTURISTS_FILE)) {
            const data = fs.readFileSync(AGRICULTURISTS_FILE, 'utf8');
            const agriculturistsData = JSON.parse(data);
            agriculturists = agriculturistsData.agriculturists || [];
            console.log('📄 Loaded', agriculturists.length, 'agriculturists from JSON file');
        }
    } catch (error) {
        console.log('No existing agriculturists file, starting fresh');
    }
}

// Save users to Firestore or JSON file
async function saveUsers() {
    if (db) {
        try {
            // Save to Firestore
            const batch = db.batch();
            for (const [uid, userData] of mockUsers.entries()) {
                const userRef = db.collection('users').doc(uid);
                batch.set(userRef, userData);
            }
            await batch.commit();
            console.log('✅ Saved', mockUsers.size, 'users to Firestore');
        } catch (error) {
            console.error('Error saving users to Firestore:', error);
            // Fallback to JSON
            saveUsersToFile();
        }
    } else {
        // Fallback to JSON file
        saveUsersToFile();
    }
}

function saveUsersToFile() {
    try {
        const usersArray = Array.from(mockUsers.entries());
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2));
        console.log('📄 Saved', mockUsers.size, 'users to file');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Save products to Firestore or JSON file
async function saveProducts() {
    if (db) {
        try {
            // Save to Firestore
            const batch = db.batch();
            for (const product of products) {
                const productRef = db.collection('products').doc(product.id);
                batch.set(productRef, product);
            }
            await batch.commit();
            console.log('✅ Saved', products.length, 'products to Firestore');
        } catch (error) {
            console.error('Error saving products to Firestore:', error);
            // Fallback to JSON
            saveProductsToFile();
        }
    } else {
        // Fallback to JSON file
        saveProductsToFile();
    }
}

function saveProductsToFile() {
    try {
        const productsData = { products: products };
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));
        console.log('📄 Saved', products.length, 'products to file');
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// Save orders to Firestore or JSON file
async function saveOrders() {
    if (db) {
        try {
            // Save to Firestore
            const batch = db.batch();
            for (const order of orders) {
                const orderRef = db.collection('orders').doc(order.id);
                batch.set(orderRef, order);
            }
            await batch.commit();
            console.log('✅ Saved', orders.length, 'orders to Firestore');
        } catch (error) {
            console.error('Error saving orders to Firestore:', error);
            // Fallback to JSON
            saveOrdersToFile();
        }
    } else {
        // Fallback to JSON file
        saveOrdersToFile();
    }
}

function saveOrdersToFile() {
    try {
        const ordersData = { orders: orders };
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersData, null, 2));
        console.log('📄 Saved', orders.length, 'orders to file');
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

// Save agriculturists to Firestore or JSON file
async function saveAgriculturists() {
    if (db) {
        try {
            // Save to Firestore
            const batch = db.batch();
            for (const agriculturist of agriculturists) {
                const agriculturistRef = db.collection('agriculturists').doc(agriculturist.id);
                batch.set(agriculturistRef, agriculturist);
            }
            await batch.commit();
            console.log('✅ Saved', agriculturists.length, 'agriculturists to Firestore');
        } catch (error) {
            console.error('Error saving agriculturists to Firestore:', error);
            // Fallback to JSON
            saveAgriculturistsToFile();
        }
    } else {
        // Fallback to JSON file
        saveAgriculturistsToFile();
    }
}

function saveAgriculturistsToFile() {
    try {
        const agriculturistsData = { agriculturists: agriculturists };
        fs.writeFileSync(AGRICULTURISTS_FILE, JSON.stringify(agriculturistsData, null, 2));
        console.log('📄 Saved', agriculturists.length, 'agriculturists to file');
    } catch (error) {
        console.error('Error saving agriculturists:', error);
    }
}

const mockDb = {
    collection: (name) => ({
        doc: (id) => ({
            set: async (data) => {
                console.log('Mock: Creating user', data);
                mockUsers.set(data.uid, data);
                await saveUsers(); // Save to Firestore/file
                return { success: true };
            },
            get: async () => ({ 
                data: () => mockUsers.get(id) || { username: 'testuser', role: 'farmer' } 
            }),
            update: async (data) => {
                console.log('Mock: Updating user', data);
                const user = mockUsers.get(id);
                if (user) {
                    Object.assign(user, data);
                    mockUsers.set(id, user);
                    await saveUsers(); // Save to Firestore/file
                }
                return { success: true };
            }
        }),
        where: (field, op, value) => ({
            limit: (num) => ({
                get: async () => {
                    // Search through mock users (case-insensitive)
                    for (let [id, user] of mockUsers) {
                        if (field === 'email' && user.email.toLowerCase() === value.toLowerCase()) {
                            return {
                                empty: false,
                                docs: [{ data: () => user }]
                            };
                        }
                        if (field === 'username' && user.username.toLowerCase() === value.toLowerCase()) {
                            return {
                                empty: false,
                                docs: [{ data: () => user }]
                            };
                        }
                    }
                    return { empty: true, docs: [] };
                }
            })
        }),
        get: async () => ({
            size: mockUsers.size,
            docs: Array.from(mockUsers.values()).map(user => ({ data: () => user }))
        })
    })
};

// db is already defined at the top (Firestore or null)
// mockDb is only used if db (Firestore) is not available

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Serve images with proper headers
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    }
});

// Rate limiting temporarily disabled - install express-rate-limit to enable
// const rateLimit = require('express-rate-limit');
// const authLimiter = rateLimit({...});
// app.use('/api/signup', authLimiter);
// app.use('/api/login', authLimiter);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// API Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, gender, occupation, location } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Check if user already exists
        for (const [uid, user] of mockUsers.entries()) {
            if (user.email.toLowerCase() === email.toLowerCase() || user.username.toLowerCase() === username.toLowerCase()) {
                return res.status(400).json({ error: 'Email or username already exists. Please use a different email or try logging in.' });
            }
        }
        
        // Create new user
        const userRecord = {
            uid: Date.now().toString(),
            username: username,
            email: email,
            password: password, // Store password for now (in production, hash it)
            role: 'farmer',
            gender: gender || '',
            occupation: occupation || '',
            location: location || '',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        // Save to mockUsers and persist to Firestore/file
        mockUsers.set(userRecord.uid, userRecord);
        await saveUsers();
        
        console.log('New user created:', userRecord.uid);
        console.log('User data saved:', { email, username, password: password.substring(0, 3) + '***' });
        console.log('Total users now:', mockUsers.size);
        
        res.status(201).json({
            message: 'Account created successfully! You can now login.',
            success: true
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: 'This email is already registered. Please use a different email or try logging in.' });
        } else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        } else if (error.code === 'auth/weak-password') {
            return res.status(400).json({ error: 'Password should be at least 6 characters long.' });
        } else {
            return res.status(500).json({ error: 'Failed to create account. Please try again.' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user by email or username (case-insensitive)
        let userData = null;
        let userEmail = username;
        
        // Search through mockUsers to find matching user
        for (const [uid, user] of mockUsers.entries()) {
            const emailMatch = user.email && user.email.toLowerCase() === username.toLowerCase();
            const usernameMatch = user.username && user.username.toLowerCase() === username.toLowerCase();
            
            if (emailMatch || usernameMatch) {
                userData = user;
                userEmail = user.email;
                break;
            }
        }
        
        if (!userData) {
            return res.status(400).json({ error: 'No account found with this email/username. Please check your credentials or sign up.' });
        }
        
        // Debug logging
        console.log('Login attempt:', { email: userEmail, providedPassword: password.substring(0, 3) + '***', storedPassword: userData.password.substring(0, 3) + '***' });
        
        // Check if the stored password matches
        if (userData.password !== password) {
            console.log('Password mismatch:', { provided: password.substring(0, 3) + '***', stored: userData.password.substring(0, 3) + '***' });
            return res.status(400).json({ error: 'Incorrect password. Please try again.' });
        }
        
        // Update last login
        userData.lastLogin = new Date().toISOString();
        mockUsers.set(userData.uid, userData);
        await saveUsers();
        
        // Generate token
        const customToken = 'token-' + Date.now() + '-' + userData.uid;
        
        console.log('User login successful:', userData.uid);
        
        res.json({
            message: 'Login successful',
            user: {
                uid: userData.uid,
                username: userData.username,
                email: userEmail,
                gender: userData.gender || '',
                occupation: userData.occupation || '',
                location: userData.location || '',
                role: userData.role || 'farmer'
            },
            token: customToken
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Dashboard route (public access like original HTML)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// AI Assistant route (public access)
app.get('/ai-assistant', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-assistant.html'));
});

// Profile route (public access)
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/purchase', (req, res) => {
    res.sendFile(path.join(__dirname, 'purchase.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'orders.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

app.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, 'weather.html'));
});

app.get('/agriculturists', (req, res) => {
    res.sendFile(path.join(__dirname, 'agriculturists.html'));
});

app.get('/faqs', (req, res) => {
    res.sendFile(path.join(__dirname, 'faqs.html'));
});

// User statistics endpoint
app.get('/api/stats', async (req, res) => {
    try {
        // Get total user count
        const totalUsers = mockUsers.size;
        
        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentUsers = Array.from(mockUsers.values()).filter(user => {
            if (!user.createdAt) return false;
            const createdAt = new Date(user.createdAt);
            return createdAt >= sevenDaysAgo;
        }).length;
        
        res.json({
            totalUsers: totalUsers,
            recentSignups: recentUsers,
            status: 'healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Stats API error:', error);
        res.status(500).json({ error: 'Unable to fetch statistics' });
    }
});

// Weather API route (placeholder)
app.get('/api/weather/:location', async (req, res) => {
    try {
        const { location } = req.params;
        
        // In a real app, you would call a weather API like OpenWeatherMap
        const mockWeather = {
            location: location,
            temperature: '25°C',
            condition: 'Sunny',
            humidity: '65%',
            windSpeed: '10 km/h'
        };
        
        res.json(mockWeather);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Weather data unavailable' });
    }
});

// Product Management Routes

// Get all products
app.get('/api/products', (req, res) => {
    try {
        console.log('Products API called - returning', products.length, 'products');
        res.json({ products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Unable to fetch products' });
    }
});

// Add new product (Admin only)
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, unit, description, stock, seller, location } = req.body;
        
        // Generate unique ID
        const id = Date.now().toString();
        
        // Handle uploaded image
        let imagePath = 'images/placeholder.svg'; // Default placeholder
        if (req.file) {
            imagePath = 'images/' + req.file.filename;
        }
        
        const newProduct = {
            id,
            name,
            category,
            price: parseFloat(price),
            unit,
            description,
            image: imagePath,
            stock: parseInt(stock),
            seller: seller || 'Cropwise Store',
            location: location || 'Abia, Nigeria',
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        await saveProducts();
        
        console.log('New product added:', newProduct);
        res.json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Unable to add product' });
    }
});

// Update product (Admin only)
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, unit, description, stock, seller, location } = req.body;
        
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Handle uploaded image
        let imagePath = products[productIndex].image; // Keep current image
        if (req.file) {
            imagePath = 'images/' + req.file.filename;
        }
        
        products[productIndex] = {
            ...products[productIndex],
            name,
            category,
            price: parseFloat(price),
            unit,
            description,
            image: imagePath,
            stock: parseInt(stock),
            seller: seller || products[productIndex].seller,
            location: location || products[productIndex].location
        };
        
        await saveProducts();
        res.json({ message: 'Product updated successfully', product: products[productIndex] });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Unable to update product' });
    }
});

// Delete product (Admin only)
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products.splice(productIndex, 1);
        await saveProducts();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Unable to delete product' });
    }
});

// Order Management Routes

// Submit order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, total } = req.body;
        
        const orderId = 'ORD' + Date.now().toString().slice(-6);
        
        const newOrder = {
            id: orderId,
            customer,
            items,
            total: parseFloat(total),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        await saveOrders();
        
        console.log('New order received:', newOrder);
        res.json({ message: 'Order submitted successfully', orderId: orderId });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ error: 'Unable to submit order' });
    }
});

// Get all orders (Admin only)
app.get('/api/orders', (req, res) => {
    try {
        res.json({ orders: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Unable to fetch orders' });
    }
});

// Delete order (Admin only)
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderIndex = orders.findIndex(order => order.id === id);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        orders.splice(orderIndex, 1);
        await saveOrders();
        
        console.log('Order deleted:', id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Unable to delete order' });
    }
});

// Agriculturist API routes

// Get all agriculturists
app.get('/api/agriculturists', (req, res) => {
    try {
        res.json(agriculturists);
    } catch (error) {
        console.error('Error fetching agriculturists:', error);
        res.status(500).json({ error: 'Unable to fetch agriculturists' });
    }
});

// Add new agriculturist
app.post('/api/agriculturists', upload.single('profileImage'), async (req, res) => {
    try {
        const { fullName, location, specialization, experience, email, enrolledBy } = req.body;
        
        // Validate required fields
        if (!fullName || !location || !specialization || !experience || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if agriculturist already exists with this email
        const existingAgriculturist = agriculturists.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (existingAgriculturist) {
            return res.status(400).json({ 
                error: 'You are already enrolled as an agriculturist!', 
                message: 'This email address is already registered in our agriculturist directory. You can edit your profile instead of enrolling again.',
                existingProfile: {
                    name: existingAgriculturist.name,
                    specialization: existingAgriculturist.specialization,
                    location: existingAgriculturist.location
                }
            });
        }

        // Handle profile image
        let profileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS42NDA2IDMxLjY0MDYgNTQgNDYgNTRINTRDNjguMzU5NCA1NCA4MCA2NS42NDA2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM2NjY2NjYiLz4KPC9zdmc+';
        
        if (req.file) {
            profileImage = 'images/' + req.file.filename;
        }

        // Create new agriculturist
        const newAgriculturist = {
            id: Date.now().toString(),
            name: fullName,
            location: location,
            specialization: specialization,
            experience: parseInt(experience),
            email: email,
            profileImage: profileImage,
            enrolledAt: new Date().toISOString(),
            enrolledBy: enrolledBy || 'unknown'
        };

        agriculturists.push(newAgriculturist);
        await saveAgriculturists();
        
        console.log('New agriculturist enrolled:', newAgriculturist);
        res.json({ message: 'Agriculturist enrolled successfully', agriculturist: newAgriculturist });
    } catch (error) {
        console.error('Error enrolling agriculturist:', error);
        res.status(500).json({ error: 'Unable to enroll agriculturist' });
    }
});

// Update agriculturist profile
app.put('/api/agriculturists/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, location, specialization, experience, email } = req.body;
        
        // Find the agriculturist
        const agriculturistIndex = agriculturists.findIndex(a => a.id === id);
        if (agriculturistIndex === -1) {
            return res.status(404).json({ error: 'Agriculturist not found' });
        }

        // Validate required fields
        if (!fullName || !location || !specialization || !experience || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email is being changed and if it conflicts with another agriculturist
        const currentAgriculturist = agriculturists[agriculturistIndex];
        if (currentAgriculturist.email.toLowerCase() !== email.toLowerCase()) {
            const existingAgriculturist = agriculturists.find(a => a.email.toLowerCase() === email.toLowerCase() && a.id !== id);
            if (existingAgriculturist) {
                return res.status(400).json({ error: 'Agriculturist with this email already exists' });
            }
        }

        // Handle profile image update
        let profileImage = currentAgriculturist.profileImage; // Keep current image by default
        
        if (req.file) {
            profileImage = 'images/' + req.file.filename;
        }

        // Update the agriculturist
        agriculturists[agriculturistIndex] = {
            ...currentAgriculturist,
            name: fullName,
            location: location,
            specialization: specialization,
            experience: parseInt(experience),
            email: email,
            profileImage: profileImage,
            updatedAt: new Date().toISOString()
        };

        await saveAgriculturists();
        
        console.log('Agriculturist profile updated:', agriculturists[agriculturistIndex]);
        res.json({ message: 'Profile updated successfully', agriculturist: agriculturists[agriculturistIndex] });
    } catch (error) {
        console.error('Error updating agriculturist profile:', error);
        res.status(500).json({ error: 'Unable to update profile' });
    }
});

// Delete agriculturist (Admin only)
app.delete('/api/agriculturists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agriculturistIndex = agriculturists.findIndex(a => a.id === id);
        
        if (agriculturistIndex === -1) {
            return res.status(404).json({ error: 'Agriculturist not found' });
        }

        const deletedAgriculturist = agriculturists.splice(agriculturistIndex, 1)[0];
        await saveAgriculturists();
        
        console.log('Agriculturist deleted:', deletedAgriculturist);
        res.json({ message: 'Agriculturist deleted successfully' });
    } catch (error) {
        console.error('Error deleting agriculturist:', error);
        res.status(500).json({ error: 'Unable to delete agriculturist' });
    }
});

// AI Chat endpoint (secure - API key stays on server)
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // API key stored securely on server (not exposed to frontend)
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        
        if (!OPENROUTER_API_KEY) {
            console.error('ERROR: OPENROUTER_API_KEY environment variable is not set!');
            return res.status(500).json({ 
                error: 'AI service configuration error. Please contact support.'
            });
        }
        
        // Try multiple AI models
        const models = [
            "deepseek/deepseek-r1:free",
            "meta-llama/llama-3.2-3b-instruct:free",
            "microsoft/phi-3-mini-128k-instruct:free",
            "google/gemma-2-9b-it:free"
        ];

        let aiMessage = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert agricultural advisor for Cropwise, a farming management platform. 
                            You help farmers with:
                            - Crop selection and planning
                            - Pest and disease identification
                            - Soil management advice
                            - Weather impact on farming
                            - Harvest timing
                            - Irrigation and water management
                            - Organic farming practices
                            - Market trends and pricing

                            Always provide practical, actionable advice based on scientific farming principles.
                            Be friendly, helpful, and encourage sustainable farming practices.`
                        },
                        {
                            role: "user",
                            content: message.trim()
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                }, {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://cropwise.com',
                        'X-Title': 'Cropwise AI Assistant'
                    },
                    timeout: 30000
                });

                if (response.status === 200 && response.data.choices && response.data.choices[0]) {
                    aiMessage = response.data.choices[0].message.content;
                    console.log(`Successfully got response from model: ${model}`);
                    break;
                }
            } catch (error) {
                console.error(`Error with model ${model}:`, error.response?.status, error.response?.data?.error?.message || error.message);
                lastError = error;
                
                if (error.response?.status === 429) {
                    // Rate limited, try next model
                    continue;
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    // Auth error - don't try other models
                    return res.status(500).json({ 
                        error: 'AI service authentication failed. Please contact support.' 
                    });
                } else {
                    // Other error - try next model
                    continue;
                }
            }
        }

        // If all models fail, provide helpful fallback
        if (!aiMessage) {
            console.error('All AI models failed. Last error:', lastError?.response?.data || lastError?.message);
            aiMessage = `I'm sorry, I couldn't connect to the AI service right now. This might be due to:

🔑 **Possible Issues:**
- Service temporarily unavailable
- Network connection issue

**What you can do:**
- Please try again in a few minutes
- Check your internet connection
- Visit our Expert Network for immediate help
- Check the FAQs section

In the meantime, here are general farming tips:

🌱 **Immediate Actions:**
- Check soil moisture levels regularly
- Water according to your crop's needs
- Monitor for pests and diseases
- Apply appropriate fertilizers

💧 **Watering Best Practices:**
- Water deeply but less frequently
- Water early morning or evening to reduce evaporation
- Avoid watering leaves to prevent disease
- Use mulch to retain soil moisture`;
        }

        res.json({ message: aiMessage });
    } catch (error) {
        console.error('Error in AI chat endpoint:', error);
        res.status(500).json({ 
            error: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact a local agricultural expert for immediate assistance."
        });
    }
});

// Check if user is admin
app.get('/api/check-admin/:email', (req, res) => {
    try {
        const { email } = req.params;
        console.log('Checking admin status for:', email);
        const user = Array.from(mockUsers.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
            console.log('User found:', user.email, 'Role:', user.role);
        } else {
            console.log('User not found for email:', email);
        }
        
        if (user && user.role === 'admin') {
            console.log('User is admin!');
            res.json({ isAdmin: true, user: user });
        } else {
            res.json({ isAdmin: false });
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ error: 'Unable to check admin status' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - only for API routes, let static files be handled by express.static
app.use((req, res) => {
    // Skip 404 handling for static files (CSS, JS, images, fonts, etc.)
    const staticFileExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.avif'];
    const isStaticFile = staticFileExtensions.some(ext => req.path.toLowerCase().endsWith(ext));
    
    if (isStaticFile) {
        // For static files, return proper 404 (Express static middleware will handle if file exists)
        res.status(404).send('File not found');
        return;
    }
    
    // For API routes, return JSON
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
        return;
    }
    
    // For page routes, try to serve HTML or return JSON
    res.status(404).json({ error: 'Page not found' });
});

// Start server - wait for data to load first
(async () => {
    await loadDataFromStorage();
    app.listen(PORT, () => {
        console.log(`Cropwise server running on http://localhost:${PORT}`);
        console.log(`Signup: http://localhost:${PORT}/signup`);
        console.log(`Login: http://localhost:${PORT}/login`);
        console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
    });
})();

module.exports = app;
