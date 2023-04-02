// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const theoDoiSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        nguoiDungTheoDoiId: [{
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const TheoDoi = mongoose.model('theoDoi', theoDoiSchema);

module.exports = TheoDoi;
