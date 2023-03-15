// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const danhMucSchema = new mongoose.Schema(
    {
        danhMucId: {
            type: Number
        },
        tenDanhMuc: {
            type: String,
            required: [true, 'Tên danh mục không được để trống!']
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const DanhMuc = mongoose.model('DanhMuc', danhMucSchema);

module.exports = DanhMuc;
