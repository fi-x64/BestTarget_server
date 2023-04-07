// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const goiNguoiDungSchema = mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        goiDangKyId: {
            type: Number,
        },
        soLuongTinConLai: {
            type: String
        },
        ngayDangKy: {
            type: Date
        }
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const GoiNguoiDung = mongoose.model('goiNguoiDung', goiNguoiDungSchema);

module.exports = GoiNguoiDung;
