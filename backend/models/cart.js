// Mongoose model for representing a user's shopping cart in the e-commerce application
// This schema defines the structure of the cart collection in MongoDB, including references to users and products

const mongoose = require('mongoose'); // Import mongoose for schema and model creation

const cartSchema = new mongoose.Schema({
  // Reference to the user who owns this cart (must be a valid User document)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Array of items in the cart
  items: [
    {
      // Reference to the product in the cart (must be a valid Product document)
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      // Quantity of the product in the cart (must be at least 1)
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Export the Cart model for use in database operations
module.exports = mongoose.model('Cart', cartSchema);