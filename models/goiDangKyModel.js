// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const goiDangKySchema = new mongoose.Schema(
    {
        goiId: {
            type: Number,
            unique: true,
        },
        tenGoi: {
            type: String,
        },
        giaTien: {
            type: String
        },
        soLuongTin: {
            type: String
        },
    },
    { collection: 'goidangkys' },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const GoiDangKy = mongoose.model('goidangky', goiDangKySchema);

module.exports = GoiDangKy;
