const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    hearts: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] } // Array of userIds who liked
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true 
    },
    comments: [CommentSchema],
    
    category: {
        type: String, 
        enum: ['Vehicle', 'Property', 'Miscellaneous'],
        required: true
    },


    flagged: {
        type: Boolean,
        default: false
    },
    flagReasons: {
        type: [String],
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Product', ProductSchema);

