const mongoose = require('mongoose');

const menhGiaSchema = new mongoose.Schema(
    {
        soTien: {
            type: Number,
            // enum: [20000, 50000, 100000, 500000, 1000000, 1500000, 3000000, 8000000],
        },
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

const MenhGia = mongoose.model('menhGia', menhGiaSchema);

module.exports = MenhGia;
