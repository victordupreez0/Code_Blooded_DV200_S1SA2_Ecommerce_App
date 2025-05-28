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

app.use('/auth', require('./routes/auth'));

const productsRouter = require('./routes/products.js');
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

app.listen(3000, () => console.log('server started on port 3000'));


app.use('/uploads', express.static('uploads'));//