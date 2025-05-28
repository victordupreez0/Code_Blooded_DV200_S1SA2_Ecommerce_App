const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const multer = require('multer');


const upload = multer({storage: multer.memoryStorage()});



// ROUTES
// Getting All Products
router.get ('/', async (req, res) => {
   try{
        const products = await Product.find()
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


router.get('/:id/image', getProduct, async (req, res) => {
    try {
        if (!res.product.image || !res.product.image.data) {
            return res.status(404).json({ message: 'image not found' });
        }
        res.set('Content-Type', res.product.image.contentType);
        res.send(res.product.image.data);
    } catch (err) {
        console.error('Error retrieving product image:', err);
        res.status(500).json({ message: err.message });
    }
});


// Creating a Product (with image upload)
router.post ('/', upload.single('image'), async (req, res) => {
    console.log('Received file:', req.file); // Debug log
   const image = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
   const product = new Product ({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image : req.file

    ? {
        data: req.file.buffer,
        contentType: req.file.mimetype
    } 
    
    : undefined


   });

   try{
    const newProduct = await product.save()
    res.status(201).json(newProduct);
   } catch (err) {
    res.status(400).json({ message: err.message });
   }
});


// Updating a Product
router.patch ('/:id', upload.single('image'), getProduct, async (req, res) => {

    if (req.body.name != null) {
        res.product.name = req.body.name
    }
    if (req.body.price != null) {
        res.product.price = req.body.price
    }
    if (req.body.description != null) {
        res.product.description = req.body.description
    }

    if (req.file) {
        res.product.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    try {
        const updatedProduct = await res.product.save()
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

// Middelware
async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product
    next()
}

module.exports = router;//