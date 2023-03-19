// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const trangThaiTaiKhoanSchema = new mongoose.Schema(
    {
        ten: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const TrangThaiTaiKhoan = mongoose.model('trangThaiTaiKhoan', trangThaiTaiKhoanSchema);

module.exports = TrangThaiTaiKhoan;
