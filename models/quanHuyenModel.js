// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const quanHuyenSchema = new mongoose.Schema(
    {
        // code: {
        //     type: String,
        //     ten: {
        //         type: String,
        //         required: [true, 'Required!']
        //     },
        //     parentCode: {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'tinhTP',
        //         required: [true, 'Required']
        //     }
        // }
        _id: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const quanHuyen = mongoose.model('quanHuyen', quanHuyenSchema);

module.exports = quanHuyen;
