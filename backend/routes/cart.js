const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

// Add to cart
router.post('/cart/add', auth, async (req, res) => {
  try {
    console.log('Request body:', req.body, 'User:', req.user);
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const { productId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const existing = cart.items.find(item => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get cart
router.get('/cart', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    console.log('Fetching cart for user:', userId);
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Cart fetched:', cart);
    res.json({
      items: cart
        ? cart.items.map(item => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            imageUrl: item.product.imageUrl,
            category: item.product.category,
            quantity: item.quantity
          }))
        : []
    });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart
router.delete('/cart/remove/:productId', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;