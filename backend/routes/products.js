// Express router for handling product-related operations in the e-commerce application
// Provides endpoints for CRUD operations, image uploads, comments, reactions, flagging, and admin moderation on products

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.js');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ROUTES
// Getting All Products
router.get ('/', async (req, res) => {
   try{
        let products;
        // If admin, return all products, else only approved
        if (req.headers && req.headers.authorization) {
            // Try to decode token to check admin (reuse auth middleware logic if possible)
            const token = req.headers.authorization.split(' ')[1];
            const jwt = require('jsonwebtoken');
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch {
                decoded = null;
            }
            if (decoded && decoded.role === 'admin') {
                products = await Product.find();
            } else {
                products = await Product.find({ approved: true });
            }
        } else {
            products = await Product.find({ approved: true });
        }
        res.json(products);
   } catch (err) {
    res.status(500).json({ message: err.message });
   }
});


// Getting One Product
router.get ('/:id', getProduct, (req, res) => {

    res.json(res.product);
//    if (!res.product) {
//       return res.status(404).json({ message: 'Product not found' });
//    }
//    res.send(res.product.name);

});


// Creating a Product (with image upload)
router.post ('/', upload.single('image'), async (req, res) => {
   let imageUrl = req.body.imageUrl;
   if (req.file) {
     imageUrl = `/uploads/${req.file.filename}`;
   }
   // The userId field below links the product to the user who uploaded it.
   // This allows us to later filter products by user, so each user only sees/manages their own products in the dashboard.
   const product = new Product ({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: imageUrl, // Always save the imageUrl to the database
    category: req.body.category,
    userId: req.body.userId, // <-- Link product to user who uploaded it
    approved: false,
    status: 'pending'
   })

   try{
    const newProduct = await product.save()
    res.status(201).json(newProduct);
   } catch (err) {
    res.status(400).json({ message: err.message });
   }
});


// Updating a Product
router.patch('/:id', getProduct, upload.single('image'), async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    if (req.body.category != null) {
        res.product.category = req.body.category;
    }
    if (req.file) {
        res.product.imageUrl = `/uploads/${req.file.filename}`;
    }
    // Allow admin to set approval status and status field
    if (req.body.status) {
        res.product.status = req.body.status;
        if (req.body.status === 'approved') {
            res.product.approved = true;
        } else if (req.body.status === 'denied') {
            res.product.approved = false;
        }
    }
    if (typeof req.body.approved !== 'undefined') {
        res.product.approved = req.body.approved;
    }
    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
   
});

// Deleting a Product
router.delete ('/:id', getProduct, async (req, res) => {
    try {
        await res.product.deleteOne();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


});

// Add a comment to a product
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const { comment } = req.body;
        const userId = req.user.userId; // <-- Get userId from auth middleware
        const username = req.user.fullName; // <-- Optionally get username from token
        const newComment = { userId, username, comment, hearts: 0 };
        product.comments.unshift(newComment);
        await product.save();
        res.status(201).json(product.comments[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Edit a comment
router.patch('/:id/comments/:commentId', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const comment = product.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        // Only allow if admin or comment owner
        if (req.user.role !== 'admin' && comment.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to edit this comment' });
        }
        if (req.body.comment !== undefined) comment.comment = req.body.comment;
        await product.save();
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const comment = product.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        // Allow if admin or comment owner
        if (req.user.role !== 'admin' && comment.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        product.comments.pull({ _id: req.params.commentId });
        await product.save();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// React (heart) to a comment
router.post('/:id/comments/:commentId/react', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const comment = product.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        const userId = req.user.userId;
        if (!comment.likedBy) comment.likedBy = [];
        const userIndex = comment.likedBy.indexOf(userId);
        if (userIndex !== -1) {
            // User already liked: remove like
            comment.hearts = Math.max(0, comment.hearts - 1);
            comment.likedBy.splice(userIndex, 1);
        } else {
            // User has not liked: add like
            comment.hearts += 1;
            comment.likedBy.push(userId);
        }
        await product.save();
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Flag a product (add a flag reason)
router.post('/:id/flag', async (req, res) => {
    try {
        const { reason } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (reason) {
            product.flagReasons = product.flagReasons || [];
            product.flagReasons.push(reason);
            product.flagged = true;
        }
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: 'failed to flag' });
    }
});

router.post('/flagged',async (req, res) => {
    try{
        const flaggedProducts = await Product.find({ flagged: true});
        res.json(flaggedProducts);
    } catch(err) {
        res.status(400).json({ error : 'failed to fetch'});
    }
    
});

// Get all unapproved products (admin only)
router.get('/pending', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const products = await Product.find({ approved: false });
    res.json(products);
});

// Approve a product (admin only)
router.patch('/:id/approve', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { approved: true, status: 'approved', approvedBy: req.user.userId },
        { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Get all products for a specific user (regardless of approval)
router.get('/user/:userId', async (req, res) => {
    try {
        // Find all products created by the specified user
        const products = await Product.find({ userId: req.params.userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove a specific flag reason from a product (admin only)
router.delete('/:id/flag/:flagIdx', auth, async (req, res) => {
    // Only allow admins to remove flag reasons
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        // Parse the flag index from the URL parameter
        const idx = parseInt(req.params.flagIdx, 10);
        // Validate the flag index
        if (isNaN(idx) || idx < 0 || idx >= (product.flagReasons?.length || 0)) {
            return res.status(400).json({ message: 'Invalid flag index' });
        }
        // Remove the flag reason at the specified index
        product.flagReasons.splice(idx, 1);
        // If no flag reasons remain, set flagged to false
        if (product.flagReasons.length === 0) product.flagged = false;
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: 'failed to resolve flag' });
    }
});

// Middleware to fetch a product by ID and attach it to the response object
async function getProduct(req, res, next) {
    let product
    try {
        // Attempt to find the product by ID
        product = await Product.findById(req.params.id)
        if (product == null) {
            // If not found, return 404
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        // Handle errors during product lookup
        return res.status(500).json({ message: err.message });
    }

    res.product = product // Attach the found product to the response object
    next() // Proceed to the next middleware or route handler
}

// Export the router for use in the main server
module.exports = router;