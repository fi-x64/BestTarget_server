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
        // moTa: {
        //     type: String,
        //     required: [true, 'Mô tả không được để trống!']
        // },
        moTa: {
            text: {
                type: String
            },
            html: {
                type: String
            },
        },
        gia: {
            type: Number,
            required: [true, 'Giá không được để trống!']
        },
        thoiGianTao: { type: Date, default: Date.now },
        thoiGianPush: { type: Date, default: Date.now },
        nguoiDungId: {
            type: mongoose.Schema.ObjectId,
            ref: 'NguoiDung',
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
        lyDoTuChoi: {
            type: String,
        },
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
            enum: ['Đang hiển thị', 'Hết hạn', 'Bị từ chối', "Đã bán", "Đã ẩn", "Đang đợi duyệt"],
            default: 'Đang đợi duyệt'
        },
        tinhTrang: {
            type: String,
            enum: ["Mới", "Đã sử dụng (chưa sửa chữa)", "Đã sử dụng (qua sửa chữa)"]
        },
        xoaMem: {
            type: Boolean,
            default: false
        }
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tinDangSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ xoaMem: false });
    next();
});

const TinDang = mongoose.model('tinDang', tinDangSchema);

module.exports = TinDang;
