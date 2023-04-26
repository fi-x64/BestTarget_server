const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        phongChatId: {
            type: mongoose.Types.ObjectId,
            ref: 'phongChat',
        },
        tinNhan: [{
            _id: mongoose.Types.ObjectId,
            nguoiGuiId: {
                type: mongoose.Types.ObjectId,
                ref: 'NguoiDung',
            },
            noiDung: { type: String },
            thoiGianChat: {
                type: Date,
                default: Date.now()
            },
            daDoc: {
                type: Boolean,
                default: false
            }
        }],
        thoiGianChatMoiNhat: { type: Date, default: Date.now() },
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
