// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const tinYeuThichSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        tinYeuThichId: [{
            type: mongoose.Types.ObjectId,
            ref: 'TinDang',
        }
        ]
    },
    {
        collection: 'tinyeuthichs' // đặt tên Collection là "User" (không thêm "s")
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const TinYeuThich = mongoose.model('tinYeuThich', tinYeuThichSchema);

module.exports = TinYeuThich;
