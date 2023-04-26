// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const luotXemTinSchema = new mongoose.Schema(
    {
        tinDangId: {
            type: mongoose.Types.ObjectId,
            ref: 'tinDang',
        },
        noiDung: [{
            nguoiDungId: {
                type: mongoose.Types.ObjectId,
                ref: 'tinDang',
            },
            thoiGianXem: {
                type: Date,
                default: Date.now()
            }
        }
        ],
        tongLuotXemTin: {
            type: Number,
            default: 1
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const LuotXemTin = mongoose.model('luotXemTin', luotXemTinSchema);

module.exports = LuotXemTin;
