const mongoose = require('mongoose');

const phuongXaSchema = new mongoose.Schema(
    {
        _id: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const phuongXa = mongoose.model('phuongXa', phuongXaSchema);

module.exports = phuongXa;
