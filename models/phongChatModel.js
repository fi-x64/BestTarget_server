const mongoose = require('mongoose');

const phongChatSchema = new mongoose.Schema(
    {
        nguoiDungId1: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        nguoiDungId2: {
            type: mongoose.Types.ObjectId,
            ref: 'NguoiDung',
        },
        tinDangId: {
            type: mongoose.Types.ObjectId,
            ref: 'tinDang',
        }
    },
    {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

const PhongChat = mongoose.model('phongChat', phongChatSchema);

module.exports = PhongChat;
