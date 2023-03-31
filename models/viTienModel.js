// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const viTienSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
            unique: true,
        },
        tongSoDu: {
            type: Number,
            required: [true, 'Tổng số dư không được trống!']
        },
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const ViTien = mongoose.model('viTien', viTienSchema);

module.exports = ViTien;
