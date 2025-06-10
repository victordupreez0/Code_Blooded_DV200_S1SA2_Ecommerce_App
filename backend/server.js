require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cart');
const productsRouter = require('./routes/products.js');
const authRouter = require('./routes/auth.js');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Update carts collection index
    const cartsCollection = mongoose.connection.db.collection('carts');
    try {
      await cartsCollection.dropIndex('userId_1');
      console.log('Dropped existing userId_1 index');
    } catch (error) {
      if (error.codeName !== 'IndexNotFound') {
        console.error('Error dropping index:', error);
      }
    }
    await cartsCollection.createIndex({ user: 1 }, { unique: true });
    console.log('Created unique index on user');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/api', cartRoutes);

app.listen(3000, () => console.log('Server Started'));