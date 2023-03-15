const mongoose = require('mongoose');

const danhMucPhuSchema = new mongoose.Schema(
    {
        danhMucPhuId: {
            type: Number,
        },
        danhMucId: {
            type: Number,
        },
        ten: {
            type: String,
            required: [true, 'Name of role can not be null!']
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const DanhMucPhu = mongoose.model('DanhMucPhu', danhMucPhuSchema);

module.exports = DanhMucPhu;