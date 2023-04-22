// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const lichSuTimKiemSchema = new mongoose.Schema(
    {
        nguoiDungId: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        noiDung: [{
            tieuDe: {
                type: String
            },
            hangSX: {
                value: {
                    type: Number,
                },
                label: {
                    type: String
                }
            },
            danhMucPhuId: {
                type: Number,
            }
        }],
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const LichSuTimKiem = mongoose.model('lichSuTimKiem', lichSuTimKiemSchema);

module.exports = LichSuTimKiem;
