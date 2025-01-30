const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const authMiddleware = (roles) => async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const isBlacklisted = await TokenBlacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is invalid' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (roles && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;