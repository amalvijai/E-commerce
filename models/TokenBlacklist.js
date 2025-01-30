const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true,},
    expiresAt: { type: Date, required: true, },
});

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);