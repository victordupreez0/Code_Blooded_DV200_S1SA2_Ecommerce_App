// Mongoose model for representing products in the e-commerce application
// This schema defines the structure of the product collection in MongoDB, including product details, comments, moderation status, and user association

const mongoose = require('mongoose'); // Import mongoose for schema and model creation

// Schema for comments on a product
const CommentSchema = new mongoose.Schema({
    // ID of the user who made the comment (stored as string for flexibility)
    userId: { type: String, required: true },
    // Username of the commenter
    username: { type: String, required: true },
    // The comment text
    comment: { type: String, required: true },
    // Number of hearts (likes) the comment has received
    hearts: { type: Number, default: 0 },
    // Array of userIds who have liked the comment
    likedBy: { type: [String], default: [] }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

const ProductSchema = new mongoose.Schema({
    // Name of the product
    name: {
        type: String,
        required: true
    },
    // Price of the product
    price: {
        type: Number,
        required: true
    },
    // Description of the product
    description: {
        type: String,
        required: true
    },
    // URL to the product image
    imageUrl: {
        type: String,
        required: true 
    },
    // Array of comments associated with the product
    comments: [CommentSchema],
    // Category of the product (must be one of the specified values)
    category: {
        type: String, 
        enum: ['Vehicle', 'Property', 'Miscellaneous'],
        required: true
    },
    // Indicates if the product has been flagged for review
    flagged: {
        type: Boolean,
        default: false
    },
    // Reasons for which the product was flagged (array of strings)
    flagReasons: {
        type: [String],
        default: []
    },
    // Reference to the user who created the product (must be a valid User document)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Indicates if the product has been approved by an admin
    approved: {
        type: Boolean,
        default: false
    },
    // Moderation status of the product (pending, approved, or denied)
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    }
});

// Export the Product model for use in database operations
module.exports = mongoose.model('Product', ProductSchema);

