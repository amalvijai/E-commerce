const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true,},
    description: {type: String, trim: true, },
    discount: {type: Number,required: true, min: 0, max: 100, },
    validUntil: {type: Date,required: true, },
    isActive: { type: Boolean,default: true,},
    createdAt: {type: Date, default: Date.now,},
    updatedAt: { type: Date, default: Date.now, },});
    OfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Offer', OfferSchema);



