const mongoose = require('mongoose');

const tinhTPSchema = new mongoose.Schema(
    {
        // code: {
        //     type: String,
        //     ten: {
        //         type: String,
        //         required: [true, 'Required!']
        //     },
        // }
        _id: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const tinhTP = mongoose.model('tinhTP', tinhTPSchema);

module.exports = tinhTP;
