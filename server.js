const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin (temporarily disabled for testing)
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();

// Simple file-based database for persistence
const fs = require('fs');

const USERS_FILE = path.join(__dirname, 'users.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const AGRICULTURISTS_FILE = path.join(__dirname, 'agriculturists.json');

// Load users from file
let mockUsers = new Map();
try {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const usersArray = JSON.parse(data);
        mockUsers = new Map(usersArray);
        console.log('Loaded', mockUsers.size, 'users from file');
    }
} catch (error) {
    console.log('No existing users file, starting fresh');
}

// Load products from file
let products = [];
try {
    if (fs.existsSync(PRODUCTS_FILE)) {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        const productsData = JSON.parse(data);
        products = productsData.products || [];
        console.log('Loaded', products.length, 'products from file');
    }
} catch (error) {
    console.log('No existing products file, starting fresh');
}

// Load orders from file
let orders = [];
try {
    if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        const ordersData = JSON.parse(data);
        orders = ordersData.orders || [];
        console.log('Loaded', orders.length, 'orders from file');
    }
} catch (error) {
    console.log('No existing orders file, starting fresh');
}

// Load agriculturists from file
let agriculturists = [];
try {
    if (fs.existsSync(AGRICULTURISTS_FILE)) {
        const data = fs.readFileSync(AGRICULTURISTS_FILE, 'utf8');
        const agriculturistsData = JSON.parse(data);
        agriculturists = agriculturistsData.agriculturists || [];
        console.log('Loaded', agriculturists.length, 'agriculturists from file');
    }
} catch (error) {
    console.log('No existing agriculturists file, starting fresh');
}

// Save users to file
function saveUsers() {
    try {
        const usersArray = Array.from(mockUsers.entries());
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2));
        console.log('Saved', mockUsers.size, 'users to file');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Save products to file
function saveProducts() {
    try {
        const productsData = { products: products };
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));
        console.log('Saved', products.length, 'products to file');
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// Save orders to file
function saveOrders() {
    try {
        const ordersData = { orders: orders };
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersData, null, 2));
        console.log('Saved', orders.length, 'orders to file');
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

// Save agriculturists to file
function saveAgriculturists() {
    try {
        const agriculturistsData = { agriculturists: agriculturists };
        fs.writeFileSync(AGRICULTURISTS_FILE, JSON.stringify(agriculturistsData, null, 2));
        console.log('Saved', agriculturists.length, 'agriculturists to file');
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
                saveUsers(); // Save to file
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
                    saveUsers(); // Save to file
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

const db = mockDb;

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
        
        // Mock user creation for testing
        const userRecord = {
            uid: Date.now().toString(),
            email: email,
            displayName: username
        };

        // Save additional user data to Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            username: username,
            email: email,
            password: password, // Store password for now (in production, hash it)
            role: 'farmer',
            gender: gender || '',
            occupation: occupation || '',
            location: location || '',
            createdAt: new Date().toISOString(),
            lastLogin: null
        });
        
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
        
        // Check if username is an email or username
        let email = username;
        if (!username.includes('@')) {
            // If it's a username, find the email from Firestore
            const usersSnapshot = await db.collection('users')
                .where('username', '==', username)
                .limit(1)
                .get();
            
            if (usersSnapshot.empty) {
                return res.status(400).json({ error: 'No account found with this username. Please check your credentials or sign up.' });
            }
            
            const userDoc = usersSnapshot.docs[0];
            email = userDoc.data().email;
        }
        
        console.log('Looking for user with email:', email);
        console.log('Current users in database:', Array.from(mockUsers.keys()));
        console.log('All users data:', Array.from(mockUsers.values()).map(u => ({ email: u.email, username: u.username })));
        
        // Check if user exists in our database (case-insensitive)
        const userSnapshot = await db.collection('users')
            .where('email', '==', email.toLowerCase())
            .limit(1)
            .get();
        
        if (userSnapshot.empty) {
            console.log('No user found with email:', email);
            return res.status(400).json({ error: 'No account found with this email. Please check your credentials or sign up.' });
        }
        
        const userData = userSnapshot.docs[0].data();
        
        // Debug logging
        console.log('Login attempt:', { email: email, providedPassword: password.substring(0, 3) + '***', storedPassword: userData.password.substring(0, 3) + '***' });
        
        // Check if the stored password matches
        if (userData.password !== password) {
            console.log('Password mismatch:', { provided: password.substring(0, 3) + '***', stored: userData.password.substring(0, 3) + '***' });
            return res.status(400).json({ error: 'Incorrect password. Please try again.' });
        }
        
        const userRecord = {
            uid: userData.uid,
            email: email
        };
        
        // Generate token
        const customToken = 'token-' + Date.now() + '-' + userRecord.uid;
        
        // Update last login
        await db.collection('users').doc(userRecord.uid).update({
            lastLogin: new Date().toISOString()
        });
        
        console.log('User login successful:', userRecord.uid);
        
        res.json({
            message: 'Login successful',
            user: {
                uid: userRecord.uid,
                username: userData.username,
                email: email,
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
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        
        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentUsers = usersSnapshot.docs.filter(doc => {
            const userData = doc.data();
            const createdAt = new Date(userData.createdAt);
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
        res.json({ products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Unable to fetch products' });
    }
});

// Add new product (Admin only)
app.post('/api/products', upload.single('image'), (req, res) => {
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
        saveProducts();
        
        console.log('New product added:', newProduct);
        res.json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Unable to add product' });
    }
});

// Update product (Admin only)
app.put('/api/products/:id', upload.single('image'), (req, res) => {
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
        
        saveProducts();
        res.json({ message: 'Product updated successfully', product: products[productIndex] });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Unable to update product' });
    }
});

// Delete product (Admin only)
app.delete('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products.splice(productIndex, 1);
        saveProducts();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Unable to delete product' });
    }
});

// Order Management Routes

// Submit order
app.post('/api/orders', (req, res) => {
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
        saveOrders();
        
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
app.delete('/api/orders/:id', (req, res) => {
    try {
        const { id } = req.params;
        const orderIndex = orders.findIndex(order => order.id === id);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        orders.splice(orderIndex, 1);
        saveOrders();
        
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
app.post('/api/agriculturists', upload.single('profileImage'), (req, res) => {
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
        saveAgriculturists();
        
        console.log('New agriculturist enrolled:', newAgriculturist);
        res.json({ message: 'Agriculturist enrolled successfully', agriculturist: newAgriculturist });
    } catch (error) {
        console.error('Error enrolling agriculturist:', error);
        res.status(500).json({ error: 'Unable to enroll agriculturist' });
    }
});

// Update agriculturist profile
app.put('/api/agriculturists/:id', upload.single('profileImage'), (req, res) => {
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

        saveAgriculturists();
        
        console.log('Agriculturist profile updated:', agriculturists[agriculturistIndex]);
        res.json({ message: 'Profile updated successfully', agriculturist: agriculturists[agriculturistIndex] });
    } catch (error) {
        console.error('Error updating agriculturist profile:', error);
        res.status(500).json({ error: 'Unable to update profile' });
    }
});

// Delete agriculturist (Admin only)
app.delete('/api/agriculturists/:id', (req, res) => {
    try {
        const { id } = req.params;
        const agriculturistIndex = agriculturists.findIndex(a => a.id === id);
        
        if (agriculturistIndex === -1) {
            return res.status(404).json({ error: 'Agriculturist not found' });
        }

        const deletedAgriculturist = agriculturists.splice(agriculturistIndex, 1)[0];
        saveAgriculturists();
        
        console.log('Agriculturist deleted:', deletedAgriculturist);
        res.json({ message: 'Agriculturist deleted successfully' });
    } catch (error) {
        console.error('Error deleting agriculturist:', error);
        res.status(500).json({ error: 'Unable to delete agriculturist' });
    }
});

// Check if user is admin
app.get('/api/check-admin/:email', (req, res) => {
    try {
        const { email } = req.params;
        const user = Array.from(mockUsers.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && user.role === 'admin') {
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Cropwise server running on http://localhost:${PORT}`);
    console.log(`Signup: http://localhost:${PORT}/signup`);
    console.log(`Login: http://localhost:${PORT}/login`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
});

module.exports = app;
