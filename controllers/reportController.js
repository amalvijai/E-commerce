const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getSalesReport = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const orders = await Order.find()
            .select("totalAmount status createdAt")
            .populate("user", "username email")
            .populate("products.product", "name price")
            .lean();

        res.json({ totalSales: totalSales[0]?.total || 0, orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductReport = async (req, res) => {
    try {
        const products = await Product.find().select("name stock price").lean();
        const totalProducts = products.length;
        const outOfStockProducts = products.filter(p => p.stock === 0).length;

        res.json({ totalProducts, outOfStockProducts, products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserReport = async (req, res) => {
    try {
        const users = await User.find().select("username email role").lean();
        const totalUsers = users.length;
        const adminUsers = users.filter(user => user.role === 'admin').length;

        res.json({ totalUsers, adminUsers, users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderReport = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "Pending" });
        const completedOrders = await Order.countDocuments({ status: "Completed" });

        const orders = await Order.find()
            .select("status createdAt totalAmount")
            .populate("user", "username email")
            .populate("products.product", "name price")
            .lean();

        res.json({ totalOrders, pendingOrders, completedOrders, orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
