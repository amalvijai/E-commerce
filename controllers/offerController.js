const Offer = require('../models/Offer');


exports.createOffer = async (req, res) => {
    const { name, discount, validUntil } = req.body;
    try {
        const offer = new Offer({ name, discount, validUntil });
        await offer.save();
        res.status(201).json(offer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};