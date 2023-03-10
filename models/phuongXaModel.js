const mongoose = require('mongoose');

const phuongXaSchema = new mongoose.Schema(
    {
        // code: {
        //     type: String,
        //     ten: {
        //         type: String,
        //         required: [true, 'Required!']
        //     },
        //     parentCode: {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'quanHuyen',
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

const phuongXa = mongoose.model('phuongXa', phuongXaSchema);

module.exports = phuongXa;
