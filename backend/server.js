// Main server entry point for the e-commerce backend application
// Sets up Express, connects to MongoDB, configures middleware, and mounts API routes

require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import express for creating the server
const app = express(); // Create an Express application instance
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection and models
const cors = require('cors'); // Import CORS middleware to allow cross-origin requests
const cartRoutes = require('./routes/cart'); // Import cart-related routes
const productsRouter = require('./routes/products.js'); // Import product-related routes
const authRouter = require('./routes/auth.js'); // Import authentication routes

// Connect to MongoDB Atlas using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Ensure the 'carts' collection has a unique index on the 'user' field
    const cartsCollection = mongoose.connection.db.collection('carts');
    try {
      // Attempt to drop an old index named 'userId_1' if it exists (for migration/cleanup)
      await cartsCollection.dropIndex('userId_1');
      console.log('Dropped existing userId_1 index');
    } catch (error) {
      // Ignore error if index does not exist, but log other errors
      if (error.codeName !== 'IndexNotFound') {
        console.error('Error dropping index:', error);
      }
    }
    // Create a unique index on the 'user' field to ensure one cart per user
    await cartsCollection.createIndex({ user: 1 }, { unique: true });
    console.log('Created unique index on user');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
app.use('/products', productsRouter); // Mount product routes at /products
app.use('/auth', authRouter); // Mount authentication routes at /auth
app.use('/api', cartRoutes); // Mount cart routes at /api

app.listen(3000, () => console.log('Server Started')); // Start the server on port 3000