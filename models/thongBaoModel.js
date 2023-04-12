// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const thongBaoSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        chiTiet: [{
            _id: mongoose.Schema.Types.ObjectId,
            noiDung: {
                type: String
            },
            tinDangId: {
                type: mongoose.Types.ObjectId,
                ref: 'tinDang',
            },
            loai: {
                type: String,
                enum: ['tinDuocDuyet', 'tinBiTuChoi', 'khuyenMai', 'khac'],
                default: 'khac'
            },
            thoiGianThongBao: {
                type: Date,
                default: Date.now
            },
            daDoc: {
                type: Boolean,
                default: false
            }
        }],
    },
    {
        collection: 'thongbaos' // đặt tên Collection là "User" (không thêm "s")
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const ThongBao = mongoose.model('thongBao', thongBaoSchema);

module.exports = ThongBao;
