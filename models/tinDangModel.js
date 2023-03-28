// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const tinDangSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        tieuDe: {
            type: String,
            required: [true, 'Tiêu đề không được để trống!']
        },
        danhMucId: {
            type: Number
        },
        danhMucPhuId: {
            type: Number
        },
        moTa: {
            type: String,
            required: [true, 'Mô tả không được để trống!']
        },
        gia: {
            type: Number,
            required: [true, 'Giá không được để trống!']
        },
        hangSX: {
            type: Number,
        },
        thoiGianTao: { type: Date, default: Date.now },
        thoiGianPush: { type: Date, default: Date.now },
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
        },
        hinhAnh: [{
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        }],
        video: [{
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        }],
        diaChiTinDang:
        {
            kinhDo: Number,
            viDo: Number,
            soNha: String,
            phuongXaCode: {
                // type: mongoose.Schema.ObjectId,
                // ref: 'phuongXa'
                type: String
            },
            quanHuyenCode: {
                // type: mongoose.Schema.ObjectId,
                // ref: 'quanHuyen'
                type: String
            },
            tinhTPCode: {
                // type: mongoose.Schema.ObjectId,
                // ref: 'tinhTP'
                type: String
            },
        },
        trangThaiTin: {
            type: String,
            enum: ['Đang hiển thị', 'Hết hạn', 'Bị từ chối', "Cần thanh toán", "Đang đợi duyệt"],
            default: 'Đang đợi duyệt'
        },
        tinhTrang: {
            type: String,
            enum: ["Mới", "Đã sử dụng (chưa sửa chửa)", "Đã sử dụng (qua sửa chửa)"]
        },
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const TinDang = mongoose.model('tinDang', tinDangSchema);

module.exports = TinDang;
