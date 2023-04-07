// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const hoaDonSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        donViThanhToan: {
            type: String,
        },
        hinhThuc: {
            type: String,
        },
        phuongThucThanhToan: {
            type: String
        },
        ketQuaThanhToan: {
            type: Boolean
        },
        soTien: {
            type: Number,
        },
        donDatId: {
            type: String,
        },
        thoiGianTao: { type: Date, default: Date.now },
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const HoaDon = mongoose.model('hoaDon', hoaDonSchema);

module.exports = HoaDon;
