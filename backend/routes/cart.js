// Express router for handling shopping cart operations in the e-commerce application
// Provides endpoints for adding items to the cart, retrieving the cart, and removing items from the cart

const express = require('express'); // Import express for routing
const router = express.Router(); // Create a new router instance
const auth = require('../middleware/auth'); // Import authentication middleware to protect cart routes
const Cart = require('../models/cart'); // Import the Cart model for database operations
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Add to cart endpoint: adds a product to the user's cart or updates quantity if it already exists
router.post('/cart/add', auth, async (req, res) => {
  try {
    // Log request body and user for debugging
    console.log('Request body:', req.body, 'User:', req.user);
    // Ensure the user is authenticated and has a valid userId
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    // Validate that the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    // Extract productId and quantity from the request body
    const { productId, quantity } = req.body;
    // Validate that the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    // Validate that quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    // Check if the product is already in the cart
    const existing = cart.items.find(item => item.product.toString() === productId);
    if (existing) {
      // If product exists, increment the quantity
      existing.quantity += quantity;
    } else {
      // Otherwise, add the new product to the cart
      cart.items.push({ product: productId, quantity });
    }
    // Save the updated cart to the database
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    // Handle errors during add to cart
    console.error('Cart add error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get cart endpoint: retrieves the current user's cart with populated product details
router.get('/cart', auth, async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    console.log('Fetching cart for user:', userId); // Debug: log userId
    // Find the user's cart and populate product details for each item
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('Cart fetched:', cart); // Debug: log cart
    // Respond with an array of cart items (or empty array if no cart)
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
    // Handle errors during cart retrieval
    console.error('Cart fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart endpoint: removes a product from the user's cart
router.delete('/cart/remove/:productId', auth, async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    const userId = req.user.userId;
    const { productId } = req.params;
    // Validate that the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    // Remove the product from the cart's items array
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    // Save the updated cart
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    // Handle errors during remove from cart
    console.error('Cart remove error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Export the router for use in the main server
module.exports = router;