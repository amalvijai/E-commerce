const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(400).json({ message: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);t
        const blacklistedToken = new TokenBlacklist({
            token,
            expiresAt: new Date(decoded.exp * 1000), 
        });
        await blacklistedToken.save();

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};