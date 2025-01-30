const Product = require('../models/Product');
const Offer = require('../models/Offer');


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('offer');
        const productsWithDiscount = products.map(product => {
            console.log(product);
            
            let discountedPrice = product.price;
            if (product.offer && product.offer.isActive && product.offer.validUntil > new Date()) {
                discountedPrice = product.price * (1 - product.offer.discount / 100);
            }
            return {
                ...product.toObject(),
                discountedPrice: discountedPrice.toFixed(2),
            };
        });
        res.json(productsWithDiscount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.applyOffer = async (req, res) => {
    const { productId, offerId } = req.body;
    try {
        const product = await Product.findById(productId);
        console.log(product);
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const offer = await Offer.findById(offerId);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        if (offer.validUntil < new Date() || !offer.isActive) {
            return res.status(400).json({ message: 'Offer is not valid' });
        }
        product.offer = offerId;
        await product.save();

        res.json({ message: 'Offer applied successfully', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMultipleProducts = async (req, res) => {
    const products = req.body; 
    try {
        const createdProducts = await Product.insertMany(products);
        res.status(201).json(createdProducts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};