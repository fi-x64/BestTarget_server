// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const khuyenMaiSchema = new mongoose.Schema(
    {
        noiDung: {
            type: String
        },
        tiLeGiamGia: {
            type: Number
        },
        ngayBatDau: {
            type: Date
        },
        ngayKetThuc: {
            type: Date
        },
        goiDangKyId: [{
            type: mongoose.Types.ObjectId,
            ref: 'goiDangKy',
        }],
    },
    {
        collection: 'khuyenmais' // đặt tên Collection là "User" (không thêm "s")
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const KhuyenMai = mongoose.model('khuyenMai', khuyenMaiSchema);

module.exports = KhuyenMai;
