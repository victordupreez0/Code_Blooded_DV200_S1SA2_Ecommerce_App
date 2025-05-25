require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const authRouter = require('./routes/auth.js');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json())
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

const productsRouter = require('./routes/products.js')
app.use('/products', productsRouter)


app.listen(3000, () => console.log('Server Started'))


app.use('/auth', authRouter);