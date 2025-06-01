const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    hearts: { type: Number, default: 0 }
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
        required: true
    },


    flagged: {
        type: Boolean,
        default: false
    },

    flagReason: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Product', ProductSchema);

